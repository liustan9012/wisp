from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from flask_login import LoginManager
from flask_jwt_extended import JWTManager

from config import Config

db = SQLAlchemy()
migrate = Migrate(db)
# login = LoginManager()
jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    migrate.init_app(app, db)
    # login.init_app(app)
    jwt.init_app(app)

    from app.errors import bp as errors_bp
    app.register_blueprint(errors_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.blog import bp as blog_bp
    app.register_blueprint(blog_bp)

    from app.navlink import bp as navlink_bp
    app.register_blueprint(navlink_bp)

    return app


from app import models  # noqa
