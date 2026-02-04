from app import db
from app.models.user import User
from app.models.company import Company
from app.models.product import Product
from flask import Blueprint, jsonify, request

from app.utils.fail import fail

category_bp = Blueprint("category", __name__, url_prefix="/api/categories")