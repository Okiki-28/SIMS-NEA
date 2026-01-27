import os
from app.models.company import Company
from app import db

def generate_Company_reg_no(company_name):

    while True:
        key = os.urandom(4)
        prefix = (company_name[0]).upper()+(company_name[-1]).upper()
        company_id = prefix+key.hex()
        
        companyRegAlreadyExists = db.session.query(Company.id).filter(Company.id == company_id).first()  


        if not companyRegAlreadyExists:
            break
    return company_id