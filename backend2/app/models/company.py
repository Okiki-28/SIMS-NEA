from app import db

from sqlalchemy import Numeric

class Company(db.Model):

    __tablename__ = "company"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    reg_no = db.Column(
        db.String(10),
        nullable=False,
        unique=True
    )
    name = db.Column(
        db.String(100),
        nullable=False
    )
    address = db.Column(
        db.String(150),
    )
    phone = db.Column(
        db.String(20)
    )
    tax_id = db.Column(
        db.String(20)
    )
    size = db.Column(
        db.Integer,
        Nullable=False,
        default=0
    )
    threshold = db.Column(
        Numeric(3, 1),
        default=0.2
    )
    time_period = db.Column(
        db.Integer,
        default = 30
    )