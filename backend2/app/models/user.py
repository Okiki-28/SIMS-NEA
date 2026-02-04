from app import db
from app.utils.hash_password import hash_password
from app.models.enum import UserRole, SecurityQuestion


class User(db.Model):

    __tablename__ = "users"
    
    id = db.Column(
        db.Integer,
        autoincrement = True,
        primary_key = True
    )
    first_name = db.Column(
        db.String(35),
        nullable = False
    )
    last_name = db.Column(
        db.String(35),
        nullable = False
    )
    email = db.Column(
        db.String(100),
        nullable = False,
        unique=True
    )
    tel = db.Column(
        db.String(20)
    )
    password_hash = db.Column(
        db.String(255),
        nullable = False
    )
    salt_hex = db.Column(
        db.String(64),
        nullable = False
    )
    role = db.Column(
        db.String(20),
        default = "Admin",
        nullable = False
    )
    created_at = db.Column(
        db.DateTime(timezone=True), 
        server_default=db.func.now()
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no", ondelete="CASCADE"),
        nullable = False
    )
    security_question = db.Column(
        db.String(50),
        nullable = False
    )
    security_response = db.Column(
        db.String(255),
        nullable = False
    )

    company = db.relationship("Company", backref="users")