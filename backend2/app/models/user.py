from app import db
from app.utils.hash_password import hash_password
from app.models.enum import UserRole, SecurityQuestion


class User(db.Model):

    __tablename__ = "users"
    
    id = db.Column(
        db.Integer,
        auto_increment = True,
        primary_key = True
    )
    full_name = db.Column(
        db.String(100),
        nullable = False
    )
    email = db.Column(
        db.String(100),
        nullable = False,
        unique=True
    )
    tel = db.Column(
        db.Integer
    )
    password_hash = db.Column(
        db.String(255),
        nullable = False
    )
    role = db.Column(
        db.Enum(UserRole, name="user_role_enum"),
        default = UserRole.Admin,
        nullable = False
    )
    created_at = db.Column(
        db.String(100),
        default = db.TIMESTAMP(timezone=True)
    )
    company_id = db.Column(
        db.Integer,
        db.ForeignKey("company.id", ondelete="CASCADE"),
        nullable = False
    )
    security_question = db.Column(
        db.Enum(SecurityQuestion, "user_security_question"),
        nullable = False
    )
    security_response = db.Column(
        db.String(255),
        nullable = False
    )