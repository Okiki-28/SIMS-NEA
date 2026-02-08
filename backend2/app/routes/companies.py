from app import db
from app.models.company import Company
from flask import Blueprint, jsonify, request

from app.utils.company_reg_encrypt import decrypt_reg_no

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
    payload = request.get_json()
    company_reg_no = decrypt_reg_no(payload.get('company_reg_no'))

    company = Company.query.filter_by(reg_no = company_reg_no).first()
    data = {
        "company_name": company.name,
        "company_reg_no": company.reg_no,
        "company_address": company.address,
        "company_tel": company.phone,
        "company_tax": company.tax_id,
        "company_size": company.size,
        "company_threshold": company.threshold
    }

    return data