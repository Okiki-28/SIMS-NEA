from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.category import Category
from flask import Blueprint, jsonify, request

from app.utils.fail import fail
from app.utils.ok import ok
from app.utils.check_product_status import checkProductStatus
from app.utils.low_stock import isLowStock, isAlmostLowStock
from app.utils.validate_user import validate_user

from app.routes.categories import get_categories_count

from sqlalchemy import func

product_bp = Blueprint("product", __name__, url_prefix="/api/products")

@product_bp.route("/get-all", methods=["POST"])
def get_all_products():
    payload = request.get_json()
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    products = Product.query.filter(Product.company_reg_no == company_reg_no)

    data = [{
        "id": prod.id,
        "name": prod.name,
        "category": prod.category.name,
        "quantity": prod.quantity,
        "unit_price": prod.unit_price,
        "supplier": prod.supplier.name,
        "status": checkProductStatus(prod.quantity, prod.reorder_level),
        "reorder_level": prod.reorder_level
    } for prod in products]

    return data

@product_bp.route("/get", methods=["POST"])
def get_product():
    payload = request.get_json()
    product_id = payload.get("product_id")
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    product = Product.query.filter_by(id=product_id, company_reg_no=company_reg_no).first()

    data = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "quantity": product.quantity,
        "price": product.unit_price,
        "reorder_level": product.reorder_level,
        "category": product.category.name,
        "category_id": product.category.id,
        "supplier_id": product.supplier.id,
        "supplier": product.supplier.name
    }

    return data

@product_bp.route("/get-some", methods=["POST"])
def get_some_product():
    payload = request.get_json()
    product_ids = payload.get("cart")
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    all_products = Product.query.filter(Product.id.in_(product_ids), Product.company_reg_no == company_reg_no)

    data = [{
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "quantity": product.quantity,
        "unit_price": product.unit_price,
        "reorder_level": product.reorder_level,
        "category": product.category.name,
        "category_id": product.category.id,
        "supplier_id": product.supplier.id,
        "supplier": product.supplier.name
    } for product in all_products]

    return data

@product_bp.route("/add", methods=["POST"])
def add_product():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    product_name = payload.get("name")
    product_description = payload.get("description") or ""
    product_quantity = payload.get("quantity") or 0
    product_price = payload.get("price")
    product_reorder_level = payload.get("reorder_level")
    product_supplier_id = payload.get("supplier_id")
    product_category_id = payload.get("category_id")



    product = Product(
        name = product_name,
        description = product_description,
        quantity = product_quantity,
        unit_price = product_price,
        reorder_level = product_reorder_level,
        category_id = product_category_id,
        supplier_id = product_supplier_id,
        company_reg_no = company_reg_no
    )

    
    category = Category.query.filter_by(id=product_category_id, company_reg_no=company_reg_no).first()
    if not category:
        return fail()
    
    supplier = Supplier.query.filter_by(id=product_supplier_id, company_reg_no=company_reg_no).first()
    if not supplier:
        return fail()
    category.number_of_items = (category.number_of_items or 0) + 1

    db.session.add(product)
    db.session.commit()

    return ok(message=f"Product {product_name} has been added")

@product_bp.route("/<int:id>", methods=["DELETE"])
def delete_product(id):
    payload = request.get_json()
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    product = Product.query.get(id)

    if not product:
        return fail()
    
    
    product.category.number_of_items -= 1

    
    db.session.delete(product)
    db.session.commit()

    return ok()

@product_bp.route("/edit", methods=["POST"])
def edit_product():
    payload = request.get_json()
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    product_id = payload.get("id")

    if not product_id:
        return fail(details="No product id")

    product = Product.query.filter_by(id=product_id, company_reg_no=company_reg_no).first()

    product.name = payload.get("name", product.name)
    product.description = payload.get("description", product.description)
    product.quantity = payload.get("quantity", product.quantity)
    product.unit_price = payload.get("price", product.unit_price)
    product.reorder_level = payload.get("reorder_level", product.reorder_level)
    product.supplier_id = payload.get("supplier_id", product.supplier_id)
    product.category_id = payload.get("category_id", product.category_id)

    db.session.commit()
    return ok(message=f"{product.name} has been updated")

@product_bp.route("/get-total-count", methods=["POST"])
def get_total_count():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    total_count = get_total_count(company_reg_no)
    
    return jsonify(total_count)


@product_bp.route("/get-low-stock-count", methods=["POST"])
def get_low_stock_count_route():
    payload = request.get_json()
    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    low_stock_count = get_low_stock_count(company_reg_no)
    

    return jsonify(low_stock_count)

def get_low_stock_count(company_reg_no):
    low_stock_count = db.session.query(Product)\
    .filter((Product.company_reg_no == company_reg_no) & (Product.quantity <= Product.reorder_level))\
    .count()

    product_count = db.session.query(Product)\
    .filter((Product.company_reg_no == company_reg_no))\
    .count()

    data = {
        "low_stock_count": low_stock_count,
        "product_count": product_count
    }

    return data

def get_total_count(company_reg_no):
    product_count = db.session.query(func.sum(Product.quantity))\
    .filter(Product.company_reg_no == company_reg_no)\
    .scalar() or 0

    categories_count = get_categories_count(company_reg_no)

    data = {
        "product_count": product_count,
        "categories_count": categories_count
    }

    return data