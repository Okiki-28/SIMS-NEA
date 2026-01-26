from app import db
from flask_sqlalchemy import SQLAlchemy
from app.models.enums import UserRole
from datetime import datetime
from app.utils.companyIdGenerator import generateCompanyId

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer, 
        primary_key=True
    )
    full_name = db.Column(
        db.String(100), 
        nullable=False
    )
    password_hash = db.Column(
        db.String(100), 
        nullable=False
    )
    role = db.Column(
        db.Enum(UserRole, name="user_role_enum"),
        nullable=False,
        default=UserRole.Staff #Helper function to choose default
    )
    created_at = db.Column(
        db.String(25),
        default=str(datetime.now())
    )
    company_id = db.Column(
        db.String(50),
        nullable=False,
        foreign_key=True,
        default=generateCompanyId()
    )