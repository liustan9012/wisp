import pytest
import os
from flask.testing import FlaskClient

from app import create_app, db
from app.models import Post, User
from config import Config

basedir = os.path.abspath(os.path.dirname(__file__))


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    JWT_SECRET_KEY = 'TEST_JWT_SECRET_KEY'
    # JWT_ACCESS_COOKIE_NAME = 'Authorization'


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    app.config.update({
        'TESTING': True,
    })
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()
    # clean up / reset resources here


@pytest.fixture()
def client(app) -> FlaskClient:
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

@pytest.fixture()
def user(app):
    with app.app_context():
        u1 = User(username='john', email='john@example.com')
        db.session.add(u1)
        db.session.commit()
        data = {'user_id':u1.id, **u1.dict()}
    return data

@pytest.fixture()
def post_user_id(app):
    user_id = 10000
    with app.app_context():
        u1 = User(username='john', email='john@example.com', id=user_id)
        p1 = Post(title='get post',
                  content='a post content',
                  slug='slug',
                  user_id=user_id)
        db.session.add_all((u1, p1))
        db.session.commit()
        data = {'post': p1.dict(), 'post_id':p1.id, 'user_id':u1.id}
    return data