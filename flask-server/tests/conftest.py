import pytest
import os
from flask.testing import FlaskClient

from app import create_app, db
from app.models import Post, User, Navlink, PostStatus
from config import TestConfig

basedir = os.path.abspath(os.path.dirname(__file__))


@pytest.fixture()
def app():
    os.environ.setdefault("FLASK_ENV", "")
    app = create_app(TestConfig)

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


@pytest.fixture
def app_ctx(app):
    with app.app_context():
        yield
