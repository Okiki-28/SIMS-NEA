import hmac
from app.utils.hash_security_response import hash_security_Response

def check_security_response(response, hash_answer, security_salt__hex):
    salt = bytes.fromhex(security_salt__hex)
    hmac.compare_digest(hash_answer, hash_security_Response(response, salt))