from flask import jsonify

def fail(error="Bad Request", status=400, details=None):
    return jsonify({
        "success": False,
        "error": error,
        "details": details
    }), status