from flask import jsonify

def ok(data=None, message="Ok", status=200):
    return jsonify({
        "success": True,
        "message": message,
        "data": data
    }), status