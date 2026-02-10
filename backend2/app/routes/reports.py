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
    all_categories = Category.query.all()
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

    all_categories = Category.query.all()
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
