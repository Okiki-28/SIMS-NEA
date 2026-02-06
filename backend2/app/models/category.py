from app import db

class Category(db.Model):

    __tablename__ = "category"

    id = db.Column(
        db.Integer,
        autoincrement = True,
        primary_key = True
    )
    name = db.Column(
        db.String("30"),
        nullable = False
    )
    number_of_items = db.Column(
        db.Integer,
        default = 0,
        autoincrement = True
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no", ondelete="CASCADE"),
        nullable=False
    )

    # Fix: Use capitalized class names, not table names
    company = db.relationship("Company", foreign_keys=[company_reg_no], backref="categories")