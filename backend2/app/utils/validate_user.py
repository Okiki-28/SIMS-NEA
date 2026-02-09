from app.models.user import User

def validate_user(company_reg_no, user_id):
    user = User.query.filter_by(id = user_id).first()
    if not user:
        return False
    return user.company_reg_no == company_reg_no