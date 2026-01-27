import hashlib

def hash_password(password, salt):

    h = hashlib.sha256()                 
    h.update(salt + password.encode())
    return h.hexdigest()
