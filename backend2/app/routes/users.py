from app import db
from app.models.user import User
from app.models.company import Company
from flask import Blueprint, jsonify, request

from app.utils.ok import ok
from app.utils.fail import fail
from app.utils.hash_password import hash_password
from app.utils.validate_user import validate_user

from app.routes.logs import add_log

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
            "security_response_hex": u.security_response_hex,
            "security_response_salt_hex": u.security_response_salt_hex,
            "company reg no": u.company_reg_no,
            "user_password": u.password_hash,
            "salt": u.salt_hex
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
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

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

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    user = User.query.filter_by(id=user_id, company_reg_no=company_reg_no).first()
    company = user.company

    if not user:
        return fail()
    old_user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "tel": user.tel,
        "role": user.role        
    }

    old_company_data = {
        "company_name": company.name,
        "company_address": company.address,
        "company_phone": company.phone,
        "company_tax_id": company.tax_id,
        "company_threshold": company.threshold,
        "company_time_period": company.time_period,
        "company_size": company.size
    }

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

    company.name = payload.get("company_name", company.name)
    company.address = payload.get("company_address", company.address)
    company.phone = payload.get("company_tel", company.phone)
    company.tax_id = payload.get("company_tax", company.tax_id)
    company.threshold = payload.get("company_threshold", company.threshold)
    company.time_period = payload.get("company_report_time_period", company.time_period)
    company.size = payload.get("company_size", company.size)

    db.session.commit()

    new_user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "tel": user.tel,
        "role": user.role        
    }

    new_company_data = {
        "company_name": company.name,
        "company_address": company.address,
        "company_phone": company.phone,
        "company_tax_id": company.tax_id,
        "company_threshold": company.threshold,
        "company_time_period": company.time_period,
        "company_size": company.size
    }

    if old_user_data == new_user_data and old_company_data != new_company_data:

        add_log (
            action="UPDATE",
            message="Edit company details",
            company_reg_no=company_reg_no,
            user_id=user_id,
            old_company_data = old_company_data,
            new_company_data = new_company_data
        )
    elif old_user_data != new_user_data and old_company_data == new_company_data:

        add_log (
            action="UPDATE",
            message="Edit personal details",
            company_reg_no=company_reg_no,
            user_id=user_id,
            old_user_data = old_user_data,
            new_user_data = new_user_data
        )
    else:

        add_log (
            action="UPDATE",
            message="Edit personal and company details",
            company_reg_no=company_reg_no,
            user_id=user_id,
            old_user_data = old_user_data,
            new_user_data = new_user_data,
            old_company_data = old_company_data,
            new_company_data = new_company_data
        )

    return ok()

@user_bp.route("/isAdmin", methods=["POST"])
def is_user_admin():
    payload = request.get_json() or {}

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    user = User.query.filter_by(id=user_id, company_reg_no=company_reg_no).first()

    if not user:
        return fail()
    else:
        return {"status": user.role == "Admin"}
@user_bp.route("/all", methods=["POST"])
def get_all_staff():
    payload = request.get_json() or {}

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    user = User.query.filter_by(id=user_id, company_reg_no=company_reg_no).first()

    if not user:
        return fail()
    
    if not user.role == "Admin":
        return ok(data="Invalid request from this user")

    all_staff = User.query.filter_by(company_reg_no=company_reg_no).all()

    data = [{
        "user_id": s.id,
        "name": s.first_name + " " + s.last_name,
        "role": s.role
    } for s in all_staff]

    return jsonify(data)