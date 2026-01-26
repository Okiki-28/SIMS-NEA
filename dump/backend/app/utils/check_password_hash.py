from passwordHashGenerator import passwordHashGenerator

def checkPasswordHash(passwordHash, password):
    return passwordHash == passwordHashGenerator(password)