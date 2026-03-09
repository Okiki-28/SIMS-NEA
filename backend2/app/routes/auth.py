from app import db

from flask import Blueprint, jsonify, request, session
from app.models.user import User
from app.models.company import Company
from app.models.enum import UserRole

from app.utils.hash_password import hash_password
from app.utils.hash_security_response import hash_security_response
from app.utils.company_reg_no_generator import generate_Company_reg_no
from app.utils.ok import ok
from app.utils.fail import fail

from app.routes.logs import add_log

import os
import hmac

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("", methods=["GET"])
def hello():
    return jsonify({
        "success": True
    })

@auth_bp.route("/register-new", methods=["POST"])
def register_new():
    data = request.get_json() or {}

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
        tax_id = company_tax_id,
        size = 1
    )

    db.session.add(company)
    db.session.flush()
    

    salt = os.urandom(16)
    salt_hex = salt.hex()
    password_hash = hash_password(user_password, salt)

    security_salt = os.urandom(16)
    security_salt_hex = security_salt.hex()
    security_response_hex = hash_security_response(security_response, security_salt)
    

    user = User(
        first_name = user_first_name,
        last_name = user_last_name,
        email = user_email.lower(),
        tel = user_tel,
        password_hash = password_hash,
        salt_hex = salt_hex,
        role = UserRole.Admin.value,
        company_reg_no = company.reg_no,
        security_question = security_question,
        security_response_hex = security_response_hex,
        security_response_salt_hex = security_salt_hex
    )

    db.session.add(user)
    db.session.commit()

    data = {
        'user_id': user.id,
        'username': user.first_name,
        'company_reg_no': user.company_reg_no,
        'loggedIn': True
    }

    log_user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "tel": user.tel,
        "role": user.role,
    }

    log_company_data = {
        "reg_no": company.reg_no,
        "name": company.name,
        "address": company.address,
        "phone": company.phone,
        "tax_id": company.tax_id,
        "size": company.size,
    }

    add_log (
        action="ADD",
        message=f"Registered new company with name '{company_name}' and added new user to database",
        company_reg_no=company.reg_no,
        user_id=user.id,
        user_data=log_user_data,
        company_data=log_company_data
    )

    return data


@auth_bp.route("/register-existing", methods=["POST"])
def register_existing():
    data = request.get_json() or {}

    company_reg_no = data.get("company_reg_no")
    user_first_name = data.get("user_first_name")
    user_last_name = data.get("user_last_name")
    user_email = data.get("user_email")
    user_tel = data.get("user_tel")
    user_role = data.get("user_role")
    user_password = data.get("user_password")
    user_confirm_password = data.get("user_confirm_password")

    security_question = data.get("security_question")
    security_response = data.get("security_response")

    if not all([company_reg_no, user_first_name, user_last_name, user_email, user_password, user_confirm_password, security_question, security_response]):
        return fail(details="Complete all required fields in form")
    if not user_password == user_confirm_password:
        return fail(details="Passwords don't match")
    
    company = Company.query.filter_by(reg_no = company_reg_no).first()
    if not company:
        return fail(details=f"Company with registration number '{company_reg_no}' not found")
    
    salt = os.urandom(16)
    salt_hex = salt.hex()
    password_hash = hash_password(user_password, salt)

    security_salt = os.urandom(16)
    security_salt_hex = security_salt.hex()
    security_response_hex = hash_security_response(security_response, security_salt)
    
    user = User(
        first_name = user_first_name,
        last_name = user_last_name,
        email = user_email.lower(),
        tel = user_tel,
        password_hash = password_hash,
        salt_hex = salt_hex,
        role = user_role.lower(),
        company_reg_no = company_reg_no,
        security_question = security_question,
        security_response_hex = security_response_hex,
        security_response_salt_hex = security_salt_hex
    )

    company.size += (company.size or 0) + 1
    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    session['first_name'] = user.first_name
    session['company_reg_no'] = user.company_reg_no

    data = {
        'user_id': user.id,
        'username': user.first_name,
        'company_reg_no': user.company_reg_no,
        'loggedIn': True
    }

    log_user_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "tel": user.tel,
        "role": user.role,
    }    

    add_log (
        action="ADD",
        message=f"Added new user to company database",
        company_reg_no=company.reg_no,
        user_id=user.id,
        user_data=log_user_data
    )

    return data

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() 

    email = data.get("email").lower()
    password = data.get("password")

    if not email or not password:
        return fail(details="Fill in all fields")
    user = User.query.filter_by(email = email).first()
    if not user:
        return fail(details="Invalid email or password")
    
    salt = bytes.fromhex(user.salt_hex)
    calculated_hash = hash_password(password, salt)

    if not hmac.compare_digest(calculated_hash, user.password_hash):
        return fail(details="Invalid email or password")
    
    session.clear()
    session['user_id'] = user.id
    session['first_name'] = user.first_name

    data = {
        'user_id': user.id,
        'username': user.first_name,
        'company_reg_no': user.company_reg_no,
        'role': user.role,
        'loggedIn': True
    }

    add_log (
        action="AUTH",
        message=f"User '{user.first_name} {user.last_name}' logged in to system",
        company_reg_no=user.company_reg_no,
        user_id=user.id,
    )
    
    return data

@auth_bp.route("/recover/password", methods=["POST"])
def change_password():
    payload = request.get_json()

    email = payload.get("email")
    password = payload.get("password")
    confirm_password = payload.get("confirm_password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return fail()

    if password != confirm_password:
        return fail("Passwords don't match")
    
    salt = bytes.fromhex(user.salt_hex)
    password_hash = hash_password(password, salt)

    user.password_hash = password_hash

    add_log (
        action="AUTH",
        message=f"User '{user.first_name} {user.last_name}' resetted their password",
        company_reg_no=user.company_reg_no,
        user_id=user.id
    )

    return {"status": True}

@auth_bp.route("/recover/security", methods=["POST"])
def confirm_identity():
    payload = request.get_json()

    email = payload.get("email")
    security_response = payload.get("security_response")

    user = User.query.filter_by(email=email).first()
    if not user:
        return fail()
    
    salt = bytes.fromhex(user.security_response_salt_hex)
    calculated_hash = hash_security_response(security_response, salt)

    if not hmac.compare_digest(calculated_hash, user.security_response_hex):
        return fail(details="Invalid email or password")
    else:
        return {"status": True}
    

@auth_bp.route("/recover/question", methods=["POST"])
def get_Security_question():
    payload = request.get_json()

    email = payload.get("email")
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return fail()
    security_question = user.security_question

    data = {
        "security_question": security_question,
        "status": True
    }

    return data

@auth_bp.route("/status", methods=["GET"])
def status():
    
    return {
        "loggedIn": 'user_id' in session,
        "user_id": session.get('user_id'),
        "first_name": session.get('first_name')
    }