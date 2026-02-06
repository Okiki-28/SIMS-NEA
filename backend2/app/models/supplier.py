from app import db

class Supplier(db.Model):

    __tablename__ = "supplier"

    id = db.Column(
        db.Integer,
        autoincrement = True,
        primary_key = True
    )
    name = db.Column(
        db.String("30"),
        nullable = False
    )
    phone = db.Column(
        db.String(20)
    )
    email = db.Column(
        db.String(100)
    )
    address = db.Column(
        db.String(150)
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no", ondelete="CASCADE"),
        nullable=False
    )

    # Fix: Use capitalized class names, not table names
    company = db.relationship("Company", foreign_keys=[company_reg_no], backref="suppliers")