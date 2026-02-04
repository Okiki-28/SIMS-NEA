from app import db

class Product(db.Model):

    __tablename__ = "product"
    id = db.Column(
        db.Integer,
        autoincrement=True,  # Fixed: lowercase
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
        # db.ForeignKey("Supplier.id", ondelete="CASCADE")  # Added FK constraint
    )
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("Category.id", ondelete="CASCADE"),  # Fixed: lowercase table name
        nullable=False
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no", ondelete="CASCADE"),
        nullable=False
    )

    company = db.relationship("Company", backref="products")
    category = db.relationship("Category", backref="products")
    # supplier = db.relationship("Supplier", backref="products")  # Added relationship