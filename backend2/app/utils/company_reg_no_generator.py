import os
from app.models.company import Company
from app import db

def generate_Company_reg_no(company_name):

    while True:
        key = os.urandom(4)
        prefix = (company_name[0]).upper()+(company_name[-1]).upper()
        company_reg_no = prefix+key.hex()
        
        companyRegAlreadyExists = db.session.query(Company.reg_no).filter(Company.reg_no == company_reg_no).first()  


        if not companyRegAlreadyExists:
            break
    return company_reg_no