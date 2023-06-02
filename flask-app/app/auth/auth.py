from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, get_jwt, jwt_required,
                                verify_jwt_in_request, current_user,
                                get_current_user)

from app.models import User, RegistrationModel, LoginModel, ChangePasswordModel
from app.errors import ValidationDBError

from app.auth import bp
from app import db, jwt


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
            if claims['is_admin']:
                return fn(*args, **kwargs)
            else:
                return jsonify(msg="Admin only!"), 403

        return decorator

    return wrapper


@bp.route('/')
@bp.route('/hello')
def hello():
    return 'hello world'


def create_token(identity, is_admin=False):
    access_token = create_access_token(
        identity=identity, additional_claims={"is_admin": is_admin})
    refresh_token = create_refresh_token(identity=identity)
    return access_token, refresh_token


@bp.route('/register', methods=['POST'])
def register():
    req = RegistrationModel(**request.get_json())
    user = User.query.filter_by(username=req.username).first()
    if user is not None:
        raise ValidationDBError('Please use a different username.')
    user = User.query.filter_by(email=req.email).first()
    if user is not None:
        raise ValidationDBError('Please use a different email.')
    new_user = User(username=req.username, email=req.email)
    new_user.set_password(req.password1)
    db.session.add(new_user)
    db.session.commit()
    access_token, refresh_token = create_token(new_user.get_id(),
                                               is_admin=bool(
                                                   new_user.is_admin))
    response = jsonify(access_token=access_token,
                       refresh_token=refresh_token,
                       user_id=new_user.id,
                       username=new_user.username,
                       msg='OK')
    return response


@bp.route('/login', methods=['POST'])
def login():
    req = LoginModel(**request.get_json())
    user: User = User.query.filter_by(username=req.username).first()
    if user is None:
        raise ValidationDBError(f'user {req.username} is not exist.')
    if not user.check_password(req.password):
        raise ValidationDBError('username or password is not correct.')
    access_token, refresh_token = create_token(user.get_id(),
                                               is_admin=bool(
                                                   user.is_admin))
    response = jsonify(access_token=access_token,
                       refresh_token=refresh_token,
                       user_id=user.id,
                       username=user.username,
                       msg='OK')
    return response


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = get_current_user()
    is_admin = bool(user.is_admin) if user is not None else False
    access_token = create_access_token(
        identity=identity, additional_claims={'is_admin': is_admin})
    response = jsonify(access_token=access_token, msg="OK")
    return response


@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify(logout_user=current_user.get_id(),
                       username=current_user.username,
                       msg="OK")
    return response


@bp.route('/change_password', methods=['POST'])
@jwt_required()
def change_password():
    req = ChangePasswordModel(**request.get_json())
    if current_user.username != req.username:
        raise ValidationDBError('username or password is not correct.')
    current_user.set_password(req.password1)
    db.session.add(current_user)
    db.session.commit()
    return jsonify(logout_user=current_user.get_id())


@bp.route('/users', methods=['POST'])
@admin_required()
def user_list():
    users = User.query.all()
    response = jsonify(users=[{
        **u.dict(), 'tags': [t.dict() for t in u.tags]
    } for u in users],
                       msg='OK')
    return response


@bp.route('/user/<int:user_id>/delete', methods=['POST'])
@admin_required()
def delete_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        raise ValidationDBError('user is not exist.')
    db.session.delete(user)
    db.session.commit()
    return jsonify(msg='OK')
