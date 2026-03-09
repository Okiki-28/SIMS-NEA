from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.category import Category
from app.models.sale import Sale
from app.models.sale_item import Sale_item
from flask import Blueprint, jsonify, request

from app.utils.ok import ok
from app.utils.fail import fail
from app.utils.validate_user import validate_user

from app.routes.logs import add_log

from sqlalchemy import func, case

report_bp = Blueprint("report", __name__, url_prefix="/api/reports")

@report_bp.route("bar-chart", methods=["POST"])
def get_bar_chart_data():
    payload = request.get_json()
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")
    
    company = Company.query.filter_by(reg_no=company_reg_no).first()
    threshold = company.threshold + 1
    all_categories = Category.query.filter_by(company_reg_no=company_reg_no).all()
    low_stock_cond = Product.quantity <= (Product.reorder_level*threshold)
    dataList = []
    for cate in all_categories:
        low_stock_cond = Product.quantity <= Product.reorder_level

        in_stock = (
            db.session.query(Product)
            .join(Category)
            .filter(
                Product.company_reg_no == company_reg_no,
                Category.id == cate.id,
                ~low_stock_cond
            )
            .count()
        )

        low_stock = (
            db.session.query(Product)
            .join(Category)
            .filter(
                Product.company_reg_no == company_reg_no,
                Category.id == cate.id,
                low_stock_cond
            )
            .count()
        )

        dataList.append({
            "name": cate.name,
            "in_stock": in_stock,
            "low_stock": low_stock
        })

    return dataList

@report_bp.route("/pie-chart", methods=["POST"])
def get_pie_chart_info():
    payload = request.get_json()
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    all_categories = Category.query.filter_by(company_reg_no=company_reg_no).all()
    dataList = []
    for cate in all_categories:
        value = (Product.query.filter(Product.category_id==cate.id, Product.company_reg_no==company_reg_no).count())

        dataList.append({
            "name": cate.name,
            "value": value
        })

    return dataList

@report_bp.route("/line-chart", methods=["POST"])
def get_line_chart_info():
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            func.date(Sale.date).label("day"),
            func.sum(Sale_item.quantity * Sale_item.sale_price).label("sales"),
            func.count(func.distinct(Sale.id)).label("sales_count"),
        )
        .join(Sale_item, Sale_item.sale_id == Sale.id)
        .filter(
            Sale.company_reg_no == company_reg_no,
            Sale_item.status.is_(True),
        )
        .group_by(func.date(Sale.date))
        .order_by(func.date(Sale.date))
        .all()
    )

    return [
        {
            "date": str(r.day),
            "sales": float(r.sales or 0),
            "sales_count": int(r.sales_count or 0),
        }
        for r in rows
    ]

@report_bp.route("supplier-sale", methods=["POST"])
def get_sales_count_per_supplier():
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            Supplier.name.label("supplier"),
            func.count(Sale_item.id).label("count")
        )
        .join(Product, Product.supplier_id == Supplier.id)
        .join(Sale_item, Sale_item.product_id == Product.id)
        .join(Sale, Sale.id == Sale_item.sale_id)
        .filter(
            Sale.company_reg_no == company_reg_no,
            Sale_item.status.is_(True)   # remove if you don't have status
        )
        .group_by(Supplier.name)
        .order_by(func.count(Sale_item.id).desc())
        .all()
    )

    return [{"name": r.supplier, "value": int(r.count)} for r in rows]

from sqlalchemy import func

@report_bp.route("/category-sale", methods=["POST"])
def get_sales_count_per_category():
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            Category.name.label("category"),
            func.count(Sale_item.id).label("count")
        )
        .join(Product, Product.category_id == Category.id)
        .join(Sale_item, Sale_item.product_id == Product.id)
        .join(Sale, Sale.id == Sale_item.sale_id)
        .filter(
            Sale.company_reg_no == company_reg_no,
            Sale_item.status.is_(True)
        )
        .group_by(Category.name)
        .order_by(func.count(Sale_item.id).desc())
        .all()
    )

    return [{"name": r.category, "value": int(r.count)} for r in rows]


@report_bp.route("/estimated-profit", methods=["POST"])
def get_estimated_profit():
    """
    Estimated profit if all current stock were sold at selling_price.
    Per product: (selling_price - unit_price) * quantity
    """
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            Product.name.label("name"),
            Category.name.label("category"),
            Product.quantity.label("quantity"),
            Product.unit_price.label("unit_price"),
            Product.selling_price.label("selling_price"),
            ((Product.selling_price - Product.unit_price) * Product.quantity).label("estimated_profit")
        )
        .join(Category, Category.id == Product.category_id)
        .filter(Product.company_reg_no == company_reg_no, Product.quantity > 0)
        .all()
    )

    data = [
        {
            "name": r.name,
            "category": r.category,
            "quantity": r.quantity,
            "unit_price": float(r.unit_price),
            "selling_price": float(r.selling_price),
            "estimated_profit": float(r.estimated_profit or 0)
        }
        for r in rows
    ]

    total = sum(d["estimated_profit"] for d in data)

    return jsonify({"total_estimated_profit": total, "breakdown": data})


@report_bp.route("/dead-stock", methods=["POST"])
def get_dead_stock():
    """
    Products that have never been sold or have had no sales
    within a given number of days (default 30).
    """
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")
    days = payload.get("days", 30)

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    from datetime import datetime, timedelta
    cutoff = datetime.now() - timedelta(days=days)

    # Subquery: product IDs that have had a sale since cutoff
    active_product_ids = (
        db.session.query(Sale_item.product_id)
        .join(Sale, Sale.id == Sale_item.sale_id)
        .filter(
            Sale.company_reg_no == company_reg_no,
            Sale.date >= cutoff,
            Sale_item.status.is_(True)
        )
        .distinct()
        .subquery()
    )

    dead = (
        Product.query
        .filter(
            Product.company_reg_no == company_reg_no,
            Product.quantity > 0,
            ~Product.id.in_(active_product_ids)
        )
        .all()
    )

    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "quantity": p.quantity,
            "unit_price": float(p.unit_price),
            "stock_value": float(p.unit_price * p.quantity)
        }
        for p in dead
    ])


@report_bp.route("/stock-value", methods=["POST"])
def get_stock_value():
    """
    Stock value at cost price (unit_price * quantity) per category,
    plus the total across all categories.
    """
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            Category.name.label("category"),
            func.sum(Product.unit_price * Product.quantity).label("cost_value"),
            func.sum(Product.selling_price * Product.quantity).label("selling_value"),
        )
        .join(Product, Product.category_id == Category.id)
        .filter(Product.company_reg_no == company_reg_no)
        .group_by(Category.name)
        .all()
    )

    data = [
        {
            "category": r.category,
            "cost_value": float(r.cost_value or 0),
            "selling_value": float(r.selling_value or 0),
            "potential_profit": float((r.selling_value or 0) - (r.cost_value or 0))
        }
        for r in rows
    ]

    return jsonify({
        "total_cost_value": sum(d["cost_value"] for d in data),
        "total_selling_value": sum(d["selling_value"] for d in data),
        "total_potential_profit": sum(d["potential_profit"] for d in data),
        "breakdown": data
    })

@report_bp.route("/sale-profit", methods=["POST"])
def get_sale_profit():
    """
    Actual profit realised from completed sales.
    Grouped by day, with per-sale breakdown available.
    """
    payload = request.get_json() or {}
    user_id = payload.get("user_id")
    company_reg_no = payload.get("company_reg_no")

    if not validate_user(company_reg_no=company_reg_no, user_id=user_id):
        return fail(details="Invalid request from unknown user")

    rows = (
        db.session.query(
            func.date(Sale.date).label("day"),
            func.sum(Sale_item.sale_price * Sale_item.quantity).label("revenue"),
            func.sum(Product.unit_price * Sale_item.quantity).label("cost"),
            func.sum(
                (Sale_item.sale_price - Product.unit_price) * Sale_item.quantity
            ).label("profit"),
            func.count(func.distinct(Sale.id)).label("sales_count"),
        )
        .join(Sale_item, Sale_item.sale_id == Sale.id)
        .join(Product, Product.id == Sale_item.product_id)
        .filter(
            Sale.company_reg_no == company_reg_no,
            Sale_item.status.is_(True)
        )
        .group_by(func.date(Sale.date))
        .order_by(func.date(Sale.date))
        .all()
    )

    data = [
        {
            "date": str(r.day),
            "revenue": float(r.revenue or 0),
            "cost": float(r.cost or 0),
            "profit": float(r.profit or 0),
            "sales_count": int(r.sales_count or 0),
            "margin_pct": round(
                float(r.profit or 0) / float(r.revenue) * 100, 2
            ) if r.revenue else 0
        }
        for r in rows
    ]

    return jsonify({
        "total_revenue": sum(d["revenue"] for d in data),
        "total_cost": sum(d["cost"] for d in data),
        "total_profit": sum(d["profit"] for d in data),
        "breakdown": data
    }) 