from app import db
from app.models.user import User
from flask import Blueprint, jsonify, request

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("", methods=["GET"])
def get_all_users():
    users = User.query.all()

    data = [
        {
            "id": u.id,
            "first name": u.first_name,
            "last name": u.last_name,
            "email": u.email,
            "tel": u.tel,
            "role": u.role,
            "created at": u.created_at,
            "security question": u.security_question,
            "security response": u.security_response,
            "company reg no": u.company_reg_no
        }
        for u in users
    ]

    return jsonify({
        "success": True,
        "data": data
    })

@user_bp.route("", methods=["POST"])
def get_user():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query(User.id == user_id).first()