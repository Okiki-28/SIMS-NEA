from app import db
from app.models.company import Company
from flask import Blueprint, jsonify

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("", methods=["GET"])
def get_companies():
    companies = Company.query.all()

    data = [
        {
            "id": c.id,
            "reg_no": c.reg_no,
            "name": c.name,
            "address": c.address,
            "phone": c.phone,
            "tax_id": c.tax_id
        }
        for c in companies
    ]

    return jsonify({
        "success": True,
        "data": data
    })