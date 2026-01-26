from app import db

from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.company import Company
from app.models.enum import UserRole, SecurityQuestion

from app.utils.hash_password import hash_password
from app.utils.company_id_generator import generate_Company_id
from app.utils.ok import ok
from app.utils.fail import fail


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("", methods=["GET"])
def hello():
    return jsonify({
        "success": True
    })

@auth_bp.route("/register-new", methods=["POST"])
def register_new():
    data = request.get_json()

    company_name = data.get("company_name")
    company_address = data.get("company_address")
    company_tel = data.get("company_tel")
    company_tax_id = data.get("company_tax")

    user_name = data.get("user_fullname")
    user_email = data.get("user_email")
    user_tel = data.get("user_tel")
    user_password = data.get("user_password")
    user_confirm_password = data.get("user_confirm_password")

    security_question = data.get("security_question")
    security_response = data.get("security_response")
    
    #Validation, also include security in models/user.py
    if not all([company_name]):
        return fail(details="Complete all required fields in form")

    #Add okay and fail helper function

    #Add a helper function to get first name or just split name into first and last
    company = Company(
        reg_no = generate_Company_id(company_name),
        name = company_name,
        address = company_address,
        phone = company_tel,
        tax_id = company_tax_id
    )
    db.session.add(company)
    db.session.flush()

    user = User(
        full_name = user_name,
        email = user_email,
        tel = user_tel,
        password_hash = hash_password(user_password),
        role = UserRole.Admin,
        company_id = company.id,
        security_question = SecurityQuestion(security_question),
        security_response = security_response
    )

    db.session.add(user)
    db.session.commit()

    return ok(data=user.id)


@auth_bp.route("/register-existing", methods=["POST"])
def register_existing():
    pass

@auth_bp.route("/login", methods=["POST"])
def login():
    pass
