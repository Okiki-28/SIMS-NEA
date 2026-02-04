from app import db
from app.models.company import Company
from flask import Blueprint, jsonify, request

company_bp = Blueprint("company", __name__, url_prefix="/api/companies")

@company_bp.route("", methods=["GET"])
def get_all_companies():
    companies = Company.query.all()

    data = [
        {
            "id": c.id,
            "reg_no": c.reg_no,
            "name": c.name,
            "address": c.address,
            "phone": c.phone,
            "tax_id": c.tax_id,
            "size": c.size
        }
        for c in companies
    ]

    return jsonify({
        "success": True,
        "data": data
    })

@company_bp.route("", methods=["POST"])
def get_company():
    data = request.get_json()
    company_id = data.get['company_id']

    company = Company.query.get(company_id)
    data = {
        "reg_no": company.reg_no,
        "name": company.name,
        "address": company.address,
        "phone": company.phone,
        "tax_id": company.tax_id,
        "size": company.size
    }

    return jsonify({
        "success": True,
        "data": data
    })