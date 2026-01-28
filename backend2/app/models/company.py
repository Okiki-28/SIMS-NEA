from app import db

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
        autoincrement=True
    )