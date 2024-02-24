from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    current_user,
    get_current_user,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    verify_jwt_in_request,
)
from sqlalchemy import asc, desc
from loguru import logger

from app import db, jwt
from app.auth import bp
from app.errors import ValidationDBError
from app.models import (
    ChangePasswordModel,
    LoginModel,
    RegistrationModel,
    User,
    UserPaginationModel,
    PaginationOrder,
)


@jwt.user_identity_loader
def user_identity_lookup(user_id):
    return user_id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()

            if (
                claims["is_admin"]
                and current_user is not None
                and current_user.is_admin
            ):
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admin only!"), 403

        return decorator

    return wrapper


@bp.route("/")
@bp.route("/hello")
def hello():
    return "hello world"


def create_token(identity, is_admin=False):
    access_token = create_access_token(
        identity=identity, additional_claims={"is_admin": is_admin}
    )
    refresh_token = create_refresh_token(identity=identity)
    return access_token, refresh_token


@bp.route("/register", methods=["POST"])
def register():
    req = RegistrationModel(**request.get_json())
    user = User.query.filter_by(username=req.username).first()
    if user is not None:
        raise ValidationDBError("Please use a different username.")
    user = User.query.filter_by(email=req.email).first()
    if user is not None:
        raise ValidationDBError("Please use a different email.")
    new_user = User(username=req.username, email=req.email)
    new_user.set_password(req.password1)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(
        identity=new_user.get_id(), additional_claims={"is_admin": bool(new_user.is_admin)}
    )
    response = jsonify(
        access_token=access_token,
        user_id=new_user.id,
        username=new_user.username,
        msg="OK",
    )
    return response


@bp.route("/login", methods=["POST"])
def login():
    req = LoginModel(**request.get_json())
    user: User = User.query.filter_by(username=req.username).first()
    if user is None:
        raise ValidationDBError(f"user {req.username} is not exist.")
    if not user.check_password(req.password):
        raise ValidationDBError("username or password is not correct.")
    identity = user.get_id()
    access_token = create_access_token(
        identity=identity, additional_claims={"is_admin": bool(user.is_admin)}
    )
    refresh_token = ""
    if req.remember:
        refresh_token = create_refresh_token(identity=identity)
    response = jsonify(
        access_token=access_token,
        refresh_token=refresh_token,
        user_id=user.id,
        username=user.username,
        msg="OK",
    )
    return response


@bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = get_current_user()
    is_admin = bool(user.is_admin) if user is not None else False
    access_token = create_access_token(
        identity=identity, additional_claims={"is_admin": is_admin}
    )
    response = jsonify(access_token=access_token, msg="OK")
    return response


@bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify(
        logout_user=current_user.get_id(), username=current_user.username, msg="OK"
    )
    return response


@bp.route("/change_password", methods=["POST"])
@jwt_required()
def change_password():
    req = ChangePasswordModel(**request.get_json())
    if current_user.username != req.username:
        raise ValidationDBError("username or password is not correct.")
    current_user.set_password(req.password1)
    db.session.add(current_user)
    db.session.commit()
    return jsonify(user_id=current_user.get_id(), msg="OK")


@bp.route("/users", methods=["POST"])
@admin_required()
def user_list():
    req_pagination = UserPaginationModel(**request.args)
    order_func = desc if req_pagination.order == PaginationOrder.DESC else asc

    pagination = db.paginate(
        db.select(User).order_by(
            order_func(getattr(User, req_pagination.order_by, req_pagination.order_by))
        ),
        page=req_pagination.page,
        per_page=req_pagination.per_page,
        max_per_page=50,
        error_out=False,
    )
    return jsonify(
        users=[{**u.dict()} for u in pagination.items],
        page=pagination.page,
        per_page=pagination.per_page,
        order=req_pagination.order,
        order_by=req_pagination.order_by,
        total=pagination.total,
        msg="OK",
    )


@bp.route("/user/<int:user_id>/delete", methods=["POST"])
@jwt_required()
def delete_user(user_id):
    if current_user.get_id() != str(user_id) and not current_user.is_admin:
        raise ValidationDBError("the user is not exist.")
    user: User = User.query.filter_by(id=user_id).first()
    if user.is_admin:
        raise ValidationDBError("the user is admin user.")
    if user is None:
        raise ValidationDBError("the user is not exist.")
    for c in user.comments:
        db.session.delete(c)
    for t in user.tags:
        db.session.delete(t)
    for p in user.posts:
        db.session.delete(p)
    for link in user.navlinks:
        db.session.delete(link)
    db.session.delete(user)
    db.session.commit()
    return jsonify(msg="OK")
