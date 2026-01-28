from app import db
from app.models.company import Company
from flask import Blueprint, jsonify

company_bp = Blueprint("company", __name__, url_prefix="/api/companies")

@company_bp.route("", methods=["GET"])
def get_companies():
    companies = Company.query.all()

    data = [
        {
            "id": c.id,
            "reg_no": c.reg_no,
            "name": c.name,
            "address": c.address,
            "phone": c.phone,
            "tax_id": c.tax_id,
            "reg_no": c.reg_no
        }
        for c in companies
    ]

    return jsonify({
        "success": True,
        "data": data
    })