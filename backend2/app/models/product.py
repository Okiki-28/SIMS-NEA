from app import db

class Product(db.Model):

    __tablename__ = "product"
    id = db.Column(
        db.Integer,
        autoincrement=True,
        primary_key=True
    )
    name = db.Column(
        db.String(40),
        nullable=False
    )
    description = db.Column(
        db.String(750)
    )
    quantity = db.Column(
        db.Integer,
        default=0
    )
    unit_price = db.Column(
        db.Integer,
        nullable=False
    )
    reorder_level = db.Column(
        db.Integer,
        nullable=False
    )
    created_at = db.Column(
        db.DateTime(timezone=True), 
        server_default=db.func.now()
    )
    supplier_id = db.Column(
        db.Integer,
        db.ForeignKey("supplier.id", ondelete="CASCADE"),
        nullable = True
    )
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("category.id", ondelete="CASCADE"),
        nullable=False
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no", ondelete="CASCADE"),
        nullable=False
    )

    # Fix: Use capitalized class names, not table names
    company = db.relationship("Company", foreign_keys=[company_reg_no], backref="products")
    category = db.relationship("Category", foreign_keys=[category_id], backref="products")
    supplier = db.relationship("Supplier", foreign_keys=[supplier_id], backref="products")