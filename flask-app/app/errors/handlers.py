from flask import jsonify, current_app
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app import db
from app.errors import bp


class ValidationDBError(Exception):
    code = 4004

    def __init__(self, msg, *arg, **kwarg):
        super(*arg, **kwarg).__init__()
        self.msg = msg


@bp.app_errorhandler(ValidationDBError)
def handle_validation_db_error(error: ValidationDBError):
    response = jsonify({
        'error': error.msg,
        'msg': 'error',
    })
    response.status_code = 200
    return response


@bp.app_errorhandler(ValidationError)
def handle_validation_error(error: ValidationError):
    parameters = [loc for e in error.errors() for loc in e.get('loc', ())]
    response = jsonify({
        'error_detail': error.errors(),
        'error':
        f'parameter{"s" if len(parameters) > 1 else ""} {", ".join(parameters)} validation failed',
        'msg': 'error',
    })
    response.status_code = 200
    return response


@bp.app_errorhandler(SQLAlchemyError)
def handle_database_error(error):
    db.session.rollback()
    if isinstance(error, SQLAlchemyError) and "connect to" in str(error):
        return jsonify(error="Unable to connect to database"), 503
    current_app.logger.error(f'handle_database_error - {error}')
    return jsonify(error='error'), 500
