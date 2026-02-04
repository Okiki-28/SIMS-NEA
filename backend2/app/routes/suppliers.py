from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from flask import Blueprint, jsonify, request

from app.utils.fail import fail

supplier_bp = Blueprint("supplier", __name__, url_prefix="/api/suppliers")