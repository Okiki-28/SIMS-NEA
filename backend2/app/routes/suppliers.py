from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from flask import Blueprint, jsonify, request

from app.utils.ok import ok
from app.utils.fail import fail
from app.utils.validate_user import validate_user

supplier_bp = Blueprint("supplier", __name__, url_prefix="/api/suppliers")

@supplier_bp.route("", methods=["POST"])
def get_all_suppliers():
    payload = request.get_json()
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    suppliers = Supplier.query.filter_by(company_reg_no = company_reg_no).all()

    data_list = [
        {
            "id": s.id,
            "name": s.name,
            "address": s.address,
            "phone": s.phone
        }
        for s in suppliers
    ]

    return data_list

@supplier_bp.route("/add", methods=["POST"])
def add_supplier():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    name = payload.get("name")
    phone = payload.get("phone")
    email = payload.get("email")
    address = payload.get("address")

    supplier = Supplier(
        name = name,
        phone = phone,
        email = email,
        address = address,
        company_reg_no = company_reg_no
    )

    db.session.add(supplier)
    db.session.commit()

    return ok()

@supplier_bp.route("/<int:id>", methods=["DELETE"])
def delete_category(id):
    payload = request.get_json()

    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    category = Supplier.query.get(id)
    
    if not category:
        return fail()
    
    db.session.delete(category)
    db.session.commit()

    return ok()