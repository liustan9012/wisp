import pytest
from flask.testing import FlaskClient
from loguru import logger

from app import db
from app.models import Post, User, Comment
from app.models.blog import EnableComment, PostStatus

from .util import auth_header


@pytest.fixture()
def user_p(app_ctx, request):
    user_id = 10000
    u_10000 = User(
        id=user_id,
        username="john_u1_post",
        email="john_u1_post@example.com",
        is_admin=True,
    )
    password = "john_u1_post_password"
    u_10000.set_password(password)
    db.session.add(u_10000)
    db.session.commit()

    return {"user_id": user_id, "password": password, **u_10000.dict()}


@pytest.fixture()
def post_data(app_ctx, user_p, request):
    user_id = user_p.get("user_id")
    p_10000 = Post(
        title="get post",
        content="a post content",
        slug="slug",
        user_id=user_id,
        status=PostStatus.PUBLISHED,
    )
    db.session.add(p_10000)
    db.session.commit()

    data = {"post": p_10000.dict(), "post_id": p_10000.id, "user_id": user_id}
    yield data


def test_create_post(client, user_p):
    user_id = user_p.get("user_id")

    new_post = {
        "title": "test cretate new post",
        "content": "test cretate a post content",
    }
    response = client.post(
        "/post",
        json=new_post,
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert (
        response.json["post"].items()
        >= {
            **new_post,
            "enable_comment": EnableComment.DISABLE,
            "slug": None,
            "status": PostStatus.DRAFT,
            "author": user_p.get("username"),
        }.items()
    )
    assert response.json["post"]["id"]


def test_update_post(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_post = {
        "title": "change post",
        "content": "a new post content",
        "enable_comment": EnableComment.ENABLE,
        "slug": "post",
        "status": PostStatus.PUBLISHED,
    }
    response = client.post(
        "/post",
        json={"post_id": post_id, **new_post},
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert response.json["post"].items() >= new_post.items()


def test_get_post(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    header = auth_header(identity=user_id)
    r1 = client.get(
        f"/post/{post_id}",
        headers=header,
    )
    assert r1.status == "200 OK"
    assert r1.json["msg"] == "OK"

    slug = post_data.get("post")["slug"]
    r2 = client.get(
        f"/post/{slug}",
        headers=header,
    )
    assert r2.status == "200 OK"
    assert r2.json["msg"] == "OK"
    assert r1.json == r2.json


def test_delete_post(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    response = client.post(
        f"/post/{post_id}/delete",
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert response.json["detail"] == f'post "{"get post"}" has been deleted'


def test_add_comment(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_comment = {"content": "new comment content"}
    response = client.post(
        f"/post/{post_id}/comment/add",
        json=new_comment,
        headers=auth_header(user_id),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    comment = response.json["comment"]
    assert comment["created_at"] and comment["id"]
    assert (
        response.json["comment"].items()
        >= {
            **new_comment,
            "post_id": post_id,
            "user_id": user_id,
            "parent_id": None,
        }.items()
    )


def test_add_comment_e_validation(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    response = client.post(
        f"/post/{post_id}/comment/add",
        json={},
        headers=auth_header(user_id),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "error"
    assert "content" in response.json["error"]
    assert "validation failed" in response.json["error"]


def test_add_comment_e_post(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_comment = {"content": "new comment content"}
    response = client.post(
        f"/post/{100000}/comment/add",
        json=new_comment,
        headers=auth_header(user_id),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "error"
    assert response.json["error"] == "the post is not exist."


def test_add_comment_e_parent(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_comment = {"content": "new comment content"}
    response = client.post(
        f"/post/{post_id}/comment/add",
        json={**new_comment, "parent_id": 10000},
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "error"
    assert response.json["error"] == "the parent comment is not exist."


def test_post_comments(client, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_comment = {"content": "comment content 1"}
    client.post(
        f"/post/{post_id}/comment/add",
        json={
            **new_comment,
        },
        headers=auth_header(user_id),
    )
    response = client.get(
        f"/post/{post_id}/comments",
        headers=auth_header(user_id),
    )
    assert response.json["msg"] == "OK"
    c1 = response.json["comments"][0]
    c1.items() >= new_comment.items()


def test_post_comments_e_post(client, post_data):
    response = client.get(
        f"/post/{1000000}/comments",
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "error"
    assert response.json["error"] == "the post is not exist."


def test_comments_delete(client: FlaskClient, post_data):
    user_id = post_data.get("user_id")
    post_id = post_data.get("post_id")
    new_comment = {"content": "comment content 1"}
    c = client.post(
        f"/post/{post_id}/comment/add",
        json={
            **new_comment,
        },
        headers=auth_header(user_id, True),
    )
    response = client.post(
        f'/comment/{c.json["comment"]["id"]}/delete',
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert response.json["comment"]["id"] == c.json["comment"]["id"]


def test_comments_e_comment_id(client, post_data):
    user_id = post_data.get("user_id")
    response = client.post(
        f"/comment/{1000000}/delete",
        headers=auth_header(user_id),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "error"
    assert response.json["error"] == "the comment is not exist."


def test_new_tag(client, user_p):
    user_id = user_p["user_id"]
    new_tag = {"name": "new tag"}
    response = client.post(
        f"/tag",
        json=new_tag,
        headers=auth_header(user_id, True),
    )
    assert response.json["msg"] == "OK"
    t1 = response.json["tag"]
    assert t1["name"] == new_tag["name"]
    assert t1["user_id"] == user_id
