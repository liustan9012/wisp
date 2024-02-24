import click
import os

from loguru import logger
from flask.cli import AppGroup

from app.models import User
from app import db

create_command = AppGroup("create")


@create_command.command("admin")
def create_admin():
    username = os.environ.get("ADMIN_USERNAME")
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    if all((username, email, password)):
        admin_user = User.query.filter_by(username=username).first()
        if admin_user is None:
            admin_user = User(username=username, email=email)
            admin_user.set_password(password)
        admin_user.is_admin = True
        db.session.add(admin_user)
        db.session.commit()
    else:
        logger.info(f"username: {username} email: {email} password {'***'}")
