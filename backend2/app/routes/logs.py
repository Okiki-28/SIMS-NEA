from app import db
from app.models.log import Log
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

from decimal import Decimal

log_bp = Blueprint("log", __name__, url_prefix="/logs")

def convert_decimals(obj):
    if isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

def add_log(user_id, action, message, company_reg_no, **kwargs):

    log = Log(
        company_reg_no = company_reg_no,
        user_id = user_id,
        action = action,
        message = message,
        info = convert_decimals(kwargs)
    )

    db.session.add(log)
    db.session.commit()

@log_bp.route("", methods=["GET"])
def get_log():
    logs = Log.query.all()
    data = [
        {
            "id": l.id,
            "company_reg_no": l.company_reg_no,
            "timestamp": l.time,
            "user": l.user.first_name + " " + l.user.last_name,
            "user_id": l.user_id,
            "action": l.action,
            "message": l.message,
            "info": l.info or None
        } for l in logs ]

    return jsonify(data)

@log_bp.route("/clear1902", methods=["GET"])
def clear_all_logs():
    logs = Log.query.all()

    for log in logs:
        db.session.delete(log)

    db.session.commit()

    return ok()