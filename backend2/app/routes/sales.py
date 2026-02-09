from app import db
from app.models.sale import Sale
from app.models.sale_item import Sale_item
from app.models.product import Product
from app.models.company import Company

from flask import Blueprint, jsonify, request

from app.routes.products import get_low_stock_count, get_total_count
from app.routes.categories import get_categories_count

from app.utils.fail import fail
from app.utils.ok import ok
from app.utils.validate_user import validate_user
from decimal import Decimal

from sqlalchemy import func, and_, Numeric, cast

from datetime import datetime, timedelta, timezone

from decimal import Decimal

sale_bp = Blueprint("Sales", __name__, url_prefix="/api/sales")

@sale_bp.route("/add", methods=["POST"])
def add_new_sale():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get('user_id')
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    items = payload.get('items') #Product id, quantity, and price

    sale = Sale(
        user_id = user_id,
        company_reg_no = company_reg_no
    )

    db.session.add(sale)
    db.session.flush()


    for i in items:
        item = items[i]
        product_id = item["product_id"]
        sale_id = sale.id
        sale_price = Decimal(str(item["price"]))
        quantity = item["quantity"]

        product = Product.query.filter_by(id=product_id, company_reg_no=company_reg_no).first()

        if not product:
            return fail(details="Product does not exist")

        sale_item = Sale_item(
            sale_id = sale_id,
            product_id = product_id,
            quantity = quantity,
            sale_price = sale_price
        )

        product.quantity -= quantity

        db.session.add(sale_item)

    db.session.commit()
    
    return ok()



@sale_bp.route("/get-recent-sales", methods=["POST"])
def get_recent_sales_route():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    recent_Sales = get_recent_sales(company_reg_no)

    return jsonify(recent_Sales)

@sale_bp.route("/get-report", methods=["POST"])
def get_report():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    recent_Sales = get_recent_sales(company_reg_no)

    low_stock = get_low_stock_count(company_reg_no)

    total_Count = get_total_count(company_reg_no)

    categories_count = get_categories_count(company_reg_no)




@sale_bp.route("", methods=["GET"])
def get_all():
    saleItems = Sale_item.query.all()

    data = [
        {
            "id": s.id,
            "sale_id": s.sale_id,
            "product_id": s.product_id,
            "quantity": s.quantity,
            "price": s.sale_price,
            "status": s.status
        }
        for s in saleItems
    ]

    return jsonify({
        "success": True,
        "data": data
    })

@sale_bp.route("get-best-seller", methods=["POST"])
def get_best_seller_route():
    payload = request.get_json()

    company_reg_no = payload.get("company_reg_no")
    user_id = payload.get("user_id")
    
    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    best_seller = get_best_seller(company_reg_no)

    data = {
        "best_seller": best_seller
    }

    return jsonify(data)
    

def get_recent_sales(company_reg_no):
    company = Company.query.filter_by(reg_no = company_reg_no).first()
    company_time_period = company.time_period or 30

    time_period = datetime.now(timezone.utc) - timedelta(days=company_time_period)

    total_sales = (
        db.session.query(func.sum(Sale_item.quantity * cast(Sale_item.sale_price, Numeric(10, 2))))
        .join(Sale_item.sale)
        .filter(
            Sale.date >= time_period,
            Sale.company_reg_no == company_reg_no,
            Sale_item.status == True  # Only count active items
        )
        .scalar()
        or 0
    )

    data = {
        "time_period": company_time_period,
        "total_sales": str(total_sales)
    }

    return data

def get_best_seller(company_reg_no):

    company = Company.query.filter_by(reg_no = company_reg_no).first()
    company_time_period = company.time_period or 30

    time_period = datetime.now(timezone.utc) - timedelta(days=company_time_period)

    best_seller = (
        db.session.query(
            Product.id,
            Product.name,
            func.sum(Sale_item.quantity).label('total_quantity')
        )
        .join(Sale_item, Product.id == Sale_item.product_id)
        .join(Sale, Sale_item.sale_id == Sale.id)
        .filter(
            Sale.date >= time_period,
            Sale.company_reg_no == company_reg_no,
            Sale_item.status == True
        )
        .group_by(Product.id, Product.name)
        .order_by(func.sum(Sale_item.quantity).desc())
        .first()
    )

    if not best_seller:
        return None

    return {
        "product_id": best_seller.id,
        "product_name": best_seller.name,
        "total_quantity": best_seller.total_quantity
    }
    