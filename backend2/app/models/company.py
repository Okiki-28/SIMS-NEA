from app import db

class Company(db.Model):

    __tablename__ = "company"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    reg_no = db.Column(
        db.Integer,
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
        db.Integer
    )
    tax_id = db.Column(
        db.Integer
    )
    size = db.Column(
        db.Integer,
        auto_increment=True
    )