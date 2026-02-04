from app import db

class Supplier(db.Model):

    __tablename__ = "Supplier"

    id = db.Column(
        db.Integer,
        autoincrement = True,
        primary_key = True
    )
    name = db.Column(
        db.String("30"),
        nullable = False
    )