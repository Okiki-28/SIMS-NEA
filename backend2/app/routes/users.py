from app import db
from app.models.user import User
from flask import Blueprint, jsonify, request

from app.utils.ok import ok
from app.utils.fail import fail
from app.utils.hash_password import hash_password

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
            "company reg no": u.company_reg_no,
            "user_password": u.password_hash
        }
        for u in users
    ]

    return jsonify({
        "success": True,
        "data": data
    })

@user_bp.route("", methods=["POST"])
def get_user():
    payload = request.get_json()
    user_id = payload.get("user_id")

    user = User.query.filter_by(id = user_id).first()

    data = {
        "user_id": user.id,
        "user_first_name": user.first_name,
        "user_last_name": user.last_name,
        "user_email": user.email,
        "user_tel": user.tel,
        "user_role": user.role
    }

    return data

@user_bp.route("/edit", methods=["POST"])
def edit_user():
    payload = request.get_json() or {}

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")

    user = User.query.filter_by(id=user_id, company_reg_no=company_reg_no).first()

    if not user:
        return fail()

    user.first_name = payload.get("user_first_name", user.first_name)
    user.last_name = payload.get("user_last_name", user.last_name)
    user.email = payload.get("user_email", user.email)
    user.tel = payload.get("user_tel", user.tel)
    user.role = payload.get("user_role", user.role)

    salt_hex = user.salt_hex
    salt = bytes.fromhex(salt_hex)
    user_password = payload.get("user_password")
    if user_password:
        password = hash_password(user_password, salt)
        user.password_hash = password

    company = user.company

    company.name = payload.get("company_name", company.name)
    company.address = payload.get("company_address", company.address)
    company.phone = payload.get("company_tel", company.phone)
    company.tax_id = payload.get("company_tax", company.tax_id)
    company.threshold = payload.get("company_threshold", company.threshold)

    db.session.commit()

    return ok()