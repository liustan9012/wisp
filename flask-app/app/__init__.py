import logging

from flask import Flask

from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from loguru import logger

import config

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)

db: SQLAlchemy = SQLAlchemy(metadata=metadata)
migrate = Migrate(db)
jwt = JWTManager()


class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Retrieve context where the logging call occurred, this happens to be in the 6th frame upward
        logger_opt = logger.opt(depth=6, exception=record.exc_info)
        logger_opt.log(record.levelno, record.getMessage())


def create_app(config_class=config.ProductionConfig):
    app = Flask(__name__)
    if app.config["DEBUG"]:
        app_cfg = config.DevelopmentConfig
    else:
        app_cfg = config_class

    app.config.from_object(app_cfg)
    app.logger.addHandler(InterceptHandler())
    logging.basicConfig(handlers=[InterceptHandler()], level=20)
    logging.getLogger("sqlalchemy.engine").setLevel(app.config["SQLALCHEMY_LOGLEVEL"])

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from app.errors import bp as errors_bp

    app.register_blueprint(errors_bp)

    from app.auth import bp as auth_bp

    app.register_blueprint(auth_bp)

    from app.blog import bp as blog_bp

    app.register_blueprint(blog_bp)

    from app.navlink import bp as navlink_bp

    app.register_blueprint(navlink_bp)

    from app.command import create_command

    app.cli.add_command(create_command)

    return app


from app import models  # noqa
