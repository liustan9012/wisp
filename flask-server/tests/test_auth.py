from pathlib import Path

import pytest

from app import db
from app.models import User

resources = Path(__file__).parent / "resources"

from .util import auth_header


@pytest.fixture()
def user(app):
    with app.app_context():
        u1 = User(username="john_u1", email="john_u1@example.com", is_admin=True)
        password = "john_u1_password"
        u1.set_password(password)
        db.session.add(u1)
        db.session.commit()
        user_id = u1.id
        data = {"user_id": user_id, "password": password, **u1.dict()}
    return data


def test_request_example(client):
    response = client.get("/hello")
    assert b"hello world" in response.data


def test_register(client, app):
    response = client.post(
        "/register",
        json={
            "username": "Flask",
            "email": "flask@example.com",
            "password1": "password",
            "password2": "password",
        },
    )
    assert response.json["msg"] == "OK"
    assert type(response.json["access_token"]) is str
    user_id = response.json["user_id"]
    assert user_id
    with app.app_context():
        u1 = User.query.filter_by(id=user_id).first()
        db.session.delete(u1)
        db.session.commit()


def test_register_e_name(client, user):
    response = client.post(
        "/register",
        json={
            "username": user.get("username"),
            "email": "Flask@flask.mail",
            "password1": "password",
            "password2": "password",
        },
    )
    assert response.json["msg"] == "error"
    assert response.json["error"] == "Please use a different username."


def test_register_error(client):
    response = client.post(
        "/register",
        json={
            "username": "ee",
            "email": "flask@example.com",
            "password1": "password1",
            "password2": "password",
        },
    )
    assert response.json["msg"] == "error"
    assert response.json["error"] == "parameters username, password2 validation failed"
    assert "at least 4" in str(response.json["error_detail"])
    assert "passwords do not match" in str(response.json["error_detail"])


def test_register_e_email(client, user):
    response = client.post(
        "/register",
        json={
            "username": "susan",
            "email": user.get("email"),
            "password1": "password",
            "password2": "password",
        },
    )
    assert response.json["msg"] == "error"
    assert response.json["error"] == "Please use a different email."


def test_login(client, user):
    # u1 = User(username="john_login", email="john_login@example.com")
    # u1.set_password("john_password")
    # db.session.add(u1)
    # db.session.commit()
    response = client.post(
        "/login",
        json={
            "username": user.get("username"),
            "password": user.get("password"),
        },
    )
    assert response.json["msg"] == "OK"
    assert type(response.json["access_token"]) is str


def test_login_e_username(client):
    response = client.post(
        "/login",
        json={
            "username": "susan",
            "password": "john_password",
        },
    )
    assert response.json["msg"] == "error"
    assert response.json["error"] == "user susan is not exist."


def test_login_e_password(client, user):
    response = client.post(
        "/login",
        json={
            "username": user.get("username"),
            "password": "susan_password",
        },
    )
    assert response.json["msg"] == "error"
    assert response.json["error"] == "username or password is not correct."


def test_logout(client, user):
    response = client.post(
        "/login",
        json={
            "username": user.get("username"),
            "password": user.get("password"),
        },
    )
    token = f'Bearer {response.json["access_token"]}'
    response = client.post(
        "/logout",
        headers={
            "Authorization": token,
        },
    )
    assert response.json["logout_user"] == str(user["user_id"])


def test_change_password(client, user):
    response = client.post(
        "/login",
        json={
            "username": user.get("username"),
            "password": user.get("password"),
        },
    )
    token = f'Bearer {response.json["access_token"]}'
    response = client.post(
        "/change_password",
        json={
            "username": user.get("username"),
            "password1": "john_password_new",
            "password2": "john_password_new",
        },
        headers={
            "Authorization": token,
        },
    )
    assert response.json["user_id"] == str(user["user_id"])


def test_users(client, user):
    user_id = user.get("user_id")
    response = client.post("/users", headers=auth_header(user_id, True))
    assert len(response.json["users"]) >= 1
    u1 = [u for u in response.json["users"] if u.get("id") == user_id][0]
    assert u1.get("username") == user.get("username")
    assert u1.get("is_admin") == user.get("is_admin")
    assert u1.get("email") == user.get("email")
