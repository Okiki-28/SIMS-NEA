import hmac
from app.utils.hash_password import hash_password

def check_hashed_password(password, stored_hash, salt_hex):
    salt = bytes.fromhex(salt_hex)
    hmac.compare_digest(stored_hash, hash_password(password, salt))