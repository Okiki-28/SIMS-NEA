from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("", methods=["POST"])
def create_user():
    data = request.get_json()
    
    #Come back here, not necessarily needed at this point