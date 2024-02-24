import os
from datetime import timedelta
from pathlib import Path
import logging

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///wisp.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "8UMvhj47dsoHQ"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=14)
    NAVICONPATH = Path(r"static/images")
    SQLALCHEMY_LOGLEVEL = os.environ.get("SQLALCHEMY_LOGLEVEL") or logging.WARN
    TESTING = False


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    # SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    JWT_SECRET_KEY = "8UMvhj47dsoHQ"
    SQLALCHEMY_LOGLEVEL = logging.INFO


class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_SECRET_KEY = "TEST_JWT_SECRET_KEY"
    TESTING = True
