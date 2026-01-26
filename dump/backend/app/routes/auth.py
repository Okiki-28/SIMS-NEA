from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User
from app.utils.ok import ok
from app.utils.fail import fail

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    companyName = data.get("company-name")
    comanyAddress = data.get("company-address")
    companyTel = data.get("company-tel")
    companyTax = data.get("company-tax")

    fullname = data.get("user-fullname")
    role = data.get("user-role")
    email = data.get("user-email")
    tel = data.get("user-tel")
    password = data.get("user-password")
    confirmPassword = data.get("user-confirm-password")

    securityQuestion = data.get("user-security-question")
    securityResponse = data.get("user-security-response")

    #Validation checks
    if not all ([companyName, comanyAddress, companyTel,
                 companyTax, fullname, role,
                 email, tel, password, confirmPassword,
                 securityQuestion, securityResponse]):
        return fail()