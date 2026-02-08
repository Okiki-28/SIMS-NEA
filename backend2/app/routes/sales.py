from app import db
from app.models.sale import Sale
from app.models.sale_item import Sale_item
from app.models.product import Product

from flask import Blueprint, jsonify, request

from app.utils.company_reg_encrypt import decrypt_reg_no
from app.utils.fail import fail
from app.utils.ok import ok
from decimal import Decimal

from sqlalchemy import func, and_, Numeric, cast

from datetime import datetime, timedelta, timezone

from decimal import Decimal

sale_bp = Blueprint("Sales", __name__, url_prefix="/api/sales")

@sale_bp.route("/add", methods=["POST"])
def add_new_sale():
    data = request.get_json()

    company_reg_no = decrypt_reg_no(data.get("company_reg"))
    user_id = data.get('user_id')
    items = data.get('items') #Product id, quantity, and price

    # if not isinstance(items, list):
    #     return fail(details=f"{type(items)}")

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
def get_recent_sales():
    data = request.get_json()

    company_reg_no = decrypt_reg_no(data.get("company_reg_no"))

    one_month_ago = datetime.now(timezone.utc) - timedelta(days=30)

    total_sales = (
        db.session.query(func.sum(Sale_item.quantity * cast(Sale_item.sale_price, Numeric(10, 2))))
        .join(Sale_item.sale)
        .filter(
            Sale.date >= one_month_ago,
            Sale.company_reg_no == company_reg_no,
            Sale_item.status == True  # Only count active items
        )
        .scalar()
        or 0
    )

    return jsonify(total_sales=str(total_sales))

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