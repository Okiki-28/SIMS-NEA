from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.category import Category
from flask import Blueprint, jsonify, request

from app.utils.fail import fail
from app.utils.ok import ok

product_bp = Blueprint("product", __name__, url_prefix="/api/products")

@product_bp.route("", methods=["POST"])
def get_all_products():
    data = request.get_json()
    user_id = data.get("user_id")

    user = User.query.get(user_id)
    if not user or not user.company:
        return fail(details="Company not found")
    
    products = Product.query.filter(Product.company.id == user.company.id)

    data = [{
        "name": prod.name
    } for prod in products]

    return jsonify({
        "success": True,
        "data": data
    })

@product_bp.route("", methods=["POST"])
def get_product():
    data = request.get_json()
    product_id = data.get("product_id")

    product = Product.query.get(product_id)

    data = {
        "name": product.name,
        "description": product.description,
        "quantity": product.quantity,
        "price": product.unit_price,
        "reorder_level": product.reorder_level,
        "category": product.category.name,
    }

    return jsonify({
        "success": True,
        "data": data
    })

@product_bp.route("/add", methods=["POST"])
def add_product():
    data = request.get_json()

    company_reg_no = data.get("company_reg_no")
    product_name = data.get("name")
    product_description = data.get("description") or ""
    product_quantity = data.get("quantity") or 0
    product_price = data.get("price")
    product_reorder_level = data.get("reorder_level")
    product_supplier_name = data.get("supplier")
    product_category_name = data.get("category")

    product_category = Category.query(Category.name == product_category_name).first()
    supplier_category = Supplier.query(Supplier.name == product_supplier_name).first()

    product = Product(
        name = product_name,
        description = product_description,
        quantity = product_quantity,
        unit_price = product_price,
        reorder_level = product_reorder_level,
        category_id = product_category.id,
        supplier_id = supplier_category.id
    )

    db.session.add(product)
    db.session.commit()

    return ok(message=f"Product {product_name} has been added")

@product_bp.route("/low_Stock_count", methods=["POST"])
def get_low_stock_count():
    data = request.get_json()

    company_reg_no = data.get("company_reg_no")
    all_products = Product.query(Product.company_reg_no == company_reg_no)
    low_stock_count = 0

    for p in all_products:
        if p.quantity < p.reorder_level:
            low_stock_count += 1
    
    return ok(data=low_stock_count)