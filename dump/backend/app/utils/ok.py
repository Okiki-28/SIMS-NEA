from flask import jsonify

def ok(data=None, message="OK", status=200):
    payload = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(payload), status