from app import db

from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.company import Company
from app.models.enum import UserRole, SecurityQuestion

from app.utils.hash_password import hash_password
from backend2.app.utils.company_reg_no_generator import generate_Company_reg_no
from app.utils.ok import ok
from app.utils.fail import fail

import os

from sqlalchemy.exc import IntegrityError
import traceback


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

    user_first_name = data.get("user_first_name")
    user_last_name = data.get("user_last_name")
    user_email = data.get("user_email")
    user_tel = data.get("user_tel")
    user_password = data.get("user_password")
    user_confirm_password = data.get("user_confirm_password")

    security_question = data.get("security_question")
    security_response = data.get("security_response")

    
    #Validation, also include security in models/user.py
    if not all([company_name, user_first_name, user_last_name, user_email, user_password, user_confirm_password, security_question, security_response]):
        return fail(details="Complete all required fields in form")
    elif not user_password == user_confirm_password:
        return fail(details="Passwords don't match")
    #Add okay and fail helper function


    company = Company(
        reg_no = generate_Company_reg_no(company_name),
        name = company_name,
        address = company_address,
        phone = company_tel,
        tax_id = company_tax_id
    )

    db.session.add(company)
    db.session.flush()
    

    salt = os.urandom(16)
    salt_hex = salt.hex()
    password_hash = hash_password(user_password, salt)
    

    user = User(
        first_name = user_first_name,
        last_name = user_last_name,
        email = user_email,
        tel = user_tel,
        password_hash = password_hash,
        salt_hex = salt_hex,
        role = UserRole.Admin.value,
        company_id = company.id,
        security_question = security_question,
        security_response = security_response
    )

    db.session.add(user)
    db.session.commit()

    return ok(data=user.id)


@auth_bp.route("/register-existing", methods=["POST"])
def register_existing():
    data = request.get_json()

    company_reg_no = data.get("company_reg_no")
    user_first_name = data.get("user_first_name")
    user_last_name = data.get("user_last_name")
    user_email = data.get("user_email")
    user_tel = data.get("user_tel")
    user_role = data.get("user_role")
    user_password = data.get("user_password")
    user_confirm_password = data.get("user_confirm_password")

    security_question = SecurityQuestion.motherMaiden.value,
    security_response = security_response

    if not all([company_reg_no, user_first_name, user_last_name, user_email, user_password, user_confirm_password, security_question, security_response]):
        return fail(details="Complete all required fields in form")
    elif not user_password == user_confirm_password:
        return fail(details="Passwords don't match")
    
    #Include validation for if reg_no exists
    
    salt = os.urandom(16)
    salt_hex = salt.hex()
    password_hash = hash_password(user_password, salt)
    
    user = User(
        first_name = user_first_name,
        last_name = user_last_name,
        email = user_email,
        tel = user_tel,
        password_hash = password_hash,
        salt_hex = salt_hex,
        role = user_role,
        company_reg_no = company_reg_no,
        security_question = security_question,
        security_response = security_response
    )

    db.session.add(user)
    db.session.commit()

    return ok(data=f"{user.name} has been registered with company with registration Number: {company_reg_no}")

@auth_bp.route("/login", methods=["POST"])
def login():
    pass
