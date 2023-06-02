from flask import Blueprint

bp = Blueprint('navlink', __name__)

from app.navlink import navlink
