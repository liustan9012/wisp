from pathlib import Path
from app import db
from app.models import User

resources = Path(__file__).parent / 'resources'

from .util import auth_header


def test_request_example(client):
    response = client.get('/hello')
    assert b'hello world' in response.data


def test_register(client):
    response = client.post('/register',
                           json={
                               'username': 'Flask',
                               'email': 'flask@example.com',
                               'password1': 'password',
                               'password2': 'password',
                           })
    assert response.json['msg'] == 'OK'
    assert type(response.json['access_token']) is str


def test_register_name(client, app):
    u1 = User(username='john', email='john@example.com')
    db.session.add(u1)
    db.session.commit()
    response = client.post('/register',
                           json={
                               'username': 'john',
                               'email': 'Flask@flask.mail',
                               'password1': 'password',
                               'password2': 'password',
                           })
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'Please use a different username.'


def test_register_error(client):
    response = client.post('/register',
                           json={
                               'username': 'ee',
                               'email': 'flask@example.com',
                               'password1': 'password1',
                               'password2': 'password',
                           })
    assert response.json['msg'] == 'error'
    assert response.json['error'] == \
        'parameters username, password2 validation failed'
    assert 'at least 4' in str(response.json['error_detail'])
    assert 'passwords do not match' in str(response.json['error_detail'])


def test_register_email(client, app):
    u1 = User(username='john', email='john@example.com')
    db.session.add(u1)
    db.session.commit()
    response = client.post('/register',
                           json={
                               'username': 'susan',
                               'email': 'john@example.com',
                               'password1': 'password',
                               'password2': 'password',
                           })
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'Please use a different email.'


def test_login(client, app):
    u1 = User(username='john', email='john@example.com')
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    response = client.post('/login',
                           json={
                               'username': 'john',
                               'password': 'john_password',
                           })
    assert response.json['msg'] == 'OK'
    assert type(response.json['access_token']) is str


def test_login_username(client, app):
    u1 = User(username='john', email='john@example.com')
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    response = client.post('/login',
                           json={
                               'username': 'susan',
                               'password': 'john_password',
                           })
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'user susan is not exist.'


def test_login_password(client, app):
    u1 = User(username='john', email='john@example.com')
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    response = client.post('/login',
                           json={
                               'username': 'john',
                               'password': 'susan_password',
                           })
    assert response.json['msg'] == 'error'
    assert response.json['error'] == 'username or password is not correct.'


def test_logout(client, app):
    u1 = User(username='john', email='john@example.com')
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    u1_id = u1.get_id()
    response = client.post('/login',
                           json={
                               'username': 'john',
                               'password': 'john_password',
                           })
    token = f'Bearer {response.json["access_token"]}'
    response = client.post('/logout', headers={
        'Authorization': token,
    })
    assert response.json['logout_user'] == u1_id


def test_change_password(client, app):
    u1 = User(username='john', email='john@example.com')
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    u1_id = u1.get_id()
    response = client.post('/login',
                           json={
                               'username': 'john',
                               'password': 'john_password',
                           })
    token = f'Bearer {response.json["access_token"]}'
    response = client.post('/change_password',
                           json={
                               'username': 'john',
                               'password1': 'john_password',
                               'password2': 'john_password1',
                           },
                           headers={
                               'Authorization': token,
                           })
    assert response.json['logout_user'] == u1_id


def test_users(client):
    u1 = User(username='john', email='john@example.com', is_admin=True)
    u1.set_password('john_password')
    db.session.add(u1)
    db.session.commit()
    u1_id = u1.get_id()
    response = client.post('/users', headers=auth_header(u1_id,True))
    assert len(response.json['users']) == 1
    user = response.json['users'][0]
    assert user.items() >= dict(username='john', email='john@example.com').items()
