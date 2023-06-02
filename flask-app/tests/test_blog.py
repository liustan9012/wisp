import pytest
from app import db
from app.models import User, Post
from app.models.blog import PostStatus, EnableComment

from .util import auth_header


def test_new_post(client, app):
    user_id = None
    with app.app_context():
        u1 = User(username='john', email='john@example.com')
        db.session.add(u1)
        db.session.commit()
        user_id = u1.id
    new_post = {
        'title': 'new post',
        'content': 'a post content',
    }
    response = client.post(
        '/post',
        json=new_post,
        headers=auth_header(user_id, True),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'OK'
    assert response.json['post'].items() >= {
        **new_post,
        'enable_comment': EnableComment.DISABLE,
        'slug': None,
        'status': PostStatus.DRAFT,
        'author': 'john',
    }.items()


def test_change_post(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_post = {
        'title': 'change post',
        'content': 'a new post content',
        'enable_comment': EnableComment.ENABLE,
        'slug': 'post',
        'status': PostStatus.PUBLISHED,
    }
    response = client.post(
        '/post',
        json={
            'post_id': post_id,
            **new_post
        },
        headers=auth_header(user_id, True),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'OK'
    assert response.json['post'].items() >= new_post.items()


def test_get_post(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    header = auth_header(identity=user_id)
    r1 = client.get(
        f'/post/{post_id}',
        headers=header,
    )
    assert r1.status == '200 OK'
    assert r1.json['msg'] == 'OK'

    slug = post_user_id.get('post')['slug']
    r2 = client.get(
        f'/post/{slug}',
        headers=header,
    )
    assert r2.status == '200 OK'
    assert r2.json['msg'] == 'OK'
    assert r1.json == r2.json


def test_delete_post(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    response = client.post(
        f'/post/{post_id}/delete',
        headers=auth_header(user_id, True),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'OK'
    assert response.json['detail'] == f'post "{"get post"}" has been deleted'


def test_add_comment(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_comment = {'content': 'new comment content'}
    response = client.post(
        f'/post/{post_id}/comment/add',
        json=new_comment,
        headers=auth_header(user_id),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'OK'
    comment = response.json['comment']
    assert comment['created_at'] and comment['id']
    assert response.json['comment'].items() >= {
        **new_comment,
        'post_id': post_id,
        'user_id': user_id,
        'parent_id': None,
    }.items()


def test_add_comment_e_validation(client, app, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    response = client.post(
        f'/post/{post_id}/comment/add',
        json={},
        headers=auth_header(user_id),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'error'
    assert "content" in response.json['error']
    assert "validation failed" in response.json['error']


def test_add_comment_e_post(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_comment = {'content': 'new comment content'}
    response = client.post(
        f'/post/{100000}/comment/add',
        json=new_comment,
        headers=auth_header(user_id),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'the post is not exist.'


def test_add_comment_e_parent(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_comment = {'content': 'new comment content'}
    response = client.post(
        f'/post/{post_id}/comment/add',
        json={
            **new_comment, 'parent_id': 10000
        },
        headers=auth_header(user_id, True),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'the parent comment is not exist.'


def test_post_comments(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_comment = {'content': 'comment content 1'}
    client.post(
        f'/post/{post_id}/comment/add',
        json={
            **new_comment,
        },
        headers=auth_header(user_id),
    )
    response = client.get(
        f'/post/{post_id}/comments',
        headers=auth_header(user_id),
    )
    assert response.json['msg'] == 'OK'
    c1 = response.json['comments'][0]
    c1.items() >= new_comment.items()


def test_post_comments_e_post(client, post_user_id):
    response = client.get(f'/post/{1000000}/comments', )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'the post is not exist.'


def test_comments_delete(client, post_user_id):
    user_id = post_user_id.get('user_id')
    post_id = post_user_id.get('post_id')
    new_comment = {'content': 'comment content 1'}
    c = client.post(
        f'/post/{post_id}/comment/add',
        json={
            **new_comment,
        },
        headers=auth_header(user_id),
    )
    response = client.post(
        f'/comment/{c.json["comment"]["id"]}/delete',
        headers=auth_header(user_id),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'OK'
    assert response.json['comment']['id'] == c.json["comment"]["id"]


def test_comments_e_comment_id(client, post_user_id):
    user_id = post_user_id.get('user_id')
    response = client.post(
        f'/comment/{1000000}/delete',
        headers=auth_header(user_id),
    )
    assert response.status == '200 OK'
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'the comment is not exist.'


def test_new_tag(client, user):
    user_id = user['user_id']
    new_tag = {'name': 'new tag'}
    response = client.post(
        f'/tag',
        json=new_tag,
        headers=auth_header(user_id, True),
    )
    assert response.json['msg'] == 'OK'
    t1 = response.json['tag']
    assert t1['name'] == new_tag['name']
    assert t1['user_id'] == user_id
