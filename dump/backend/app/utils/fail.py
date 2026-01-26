from flask import jsonify

def fail(error="Bad Request", details=None, status=400):
    payload = {
        "success": False,
        "error": error,
        "details": details
    }
    return jsonify(payload), status