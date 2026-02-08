from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.category import Category
from flask import Blueprint, jsonify, request

from app.utils.fail import fail
from app.utils.ok import ok
from app.utils.company_reg_encrypt import encrypt_reg_no, decrypt_reg_no
from app.utils.check_product_status import checkProductStatus
from app.utils.low_stock import isLowStock, isAlmostLowStock

from sqlalchemy import func

product_bp = Blueprint("product", __name__, url_prefix="/api/products")

@product_bp.route("/get-all", methods=["POST"])
def get_all_products():
    data = request.get_json()
    company_reg_no = decrypt_reg_no(data.get("company_reg"))
    
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
    data = request.get_json()
    product_id = data.get("product_id")
    company_reg_no = decrypt_reg_no(data.get("company_reg_no"))

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
    data = request.get_json()
    product_ids = data.get("cart")
    company_reg_no = decrypt_reg_no(data.get("company_reg"))

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
    data = request.get_json()

    company_reg_no = decrypt_reg_no(data.get("company_reg_no"))
    product_name = data.get("name")
    product_description = data.get("description") or ""
    product_quantity = data.get("quantity") or 0
    product_price = data.get("price")
    product_reorder_level = data.get("reorder_level")
    product_supplier_id = data.get("supplier_id")
    product_category_id = data.get("category_id")


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
    product_id = payload.get("id")
    company_reg_no = decrypt_reg_no(payload.get("company_reg_no"))

    if not product_id:
        return fail(details="No product id")
    if not company_reg_no:
        return fail(details="No company reg no")

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

@product_bp.route("/low-Stock-count", methods=["POST"])
def get_low_stock_count():
    data = request.get_json()

    company_reg_no = data.get("company_reg_no")
    all_products = Product.query(Product.company_reg_no == company_reg_no)
    low_stock_count = 0

    for p in all_products:
        if p.quantity < p.reorder_level:
            low_stock_count += 1
    
    return ok(data=low_stock_count)

@product_bp.route("/get-total-count", methods=["POST"])
def get_total_count():
    payload = request.get_json()

    company_reg_no = decrypt_reg_no(payload.get("company_reg_no"))
    product_count = db.session.query(func.sum(Product.quantity))\
    .filter(Product.company_reg_no == company_reg_no)\
    .scalar() or 0

    data = {
        "product_count": product_count
    }
    return jsonify(data)

@product_bp.route("/get-low-stock-count", methods=["POST"])
def get_low_Stock_Count():
    payload = request.get_json()
    company_reg_no = decrypt_reg_no(payload.get("company_reg_no"))

    low_stock_count = db.session.query(Product)\
    .filter((Product.company_reg_no == company_reg_no) & (Product.quantity <= Product.reorder_level))\
    .count()

    data = {
        "low_stock_count": low_stock_count
    }

    return jsonify(data)