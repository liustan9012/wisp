from flask import jsonify, request

from app import db
from app.errors import ValidationDBError
from app.navlink import bp
from app.auth import admin_required


@bp.get('/navlink')
def navlink():
    return jsonify(navlinks=[])
