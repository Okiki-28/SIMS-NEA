import hashlib

def hash_security_response(response, salt):

    h = hashlib.sha256()                 
    h.update(salt + response.stript().lower().encode())
    return h.hexdigest()
