from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.category import Category
from flask import Blueprint, jsonify, request

from app.utils.ok import ok
from app.utils.fail import fail
from app.utils.validate_user import validate_user

category_bp = Blueprint("category", __name__, url_prefix="/api/categories")

@category_bp.route("", methods=["POST"])
def get_all_categories():
    data = request.get_json()
    company_reg_no = data.get("company_reg_no")
    user_id = data.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    categories = Category.query.filter_by(company_reg_no=company_reg_no).all()
    data_list = [
        {
            "id": c.id,
            "name": c.name,
            "number of items": c.number_of_items
        }
        for c in categories
    ]

    return data_list

@category_bp.route("/get-categories", methods=["POST"])
def get_categories_count_route():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = data.get("user_id")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    data = get_categories_count(company_reg_no)

    return jsonify(data)
    
@category_bp.route("/add", methods=["POST"])
def add_category():
    data = request.get_json()

    category_name = data.get("name")
    company_reg_no = data.get("company_reg_no")
    user_id = data.get("user_id")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    category = Category(
        name = category_name,
        company_reg_no = company_reg_no
    )

    db.session.add(category)
    db.session.commit()

    return ok()

@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):

    data = request.get_json()  
    user_id = data.get("user_id")
    company_reg_no = data.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    category = Category.query.get(category_id)

    if not category:
        return fail()
    
    db.session.delete(category)
    db.session.commit()

    return ok()

def get_categories_count(company_reg_no):
    categories = Category.query.filter_by(company_reg_no=company_reg_no).count()

    return categories