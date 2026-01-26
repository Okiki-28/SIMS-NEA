from flask import Blueprint, jsonify
from app import db

hello_bp = Blueprint("hello", __name__)

@hello_bp.route("/api/hello", methods=["GET"])
def hello_api():
    return jsonify({
        "message": "api is active",
        "status": "success"
    })
