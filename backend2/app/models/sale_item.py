from app import db
from sqlalchemy import Numeric
from app.models.product import Product

class Sale_item(db.Model):

    __tablename__ = "sale_item"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    sale_id = db.Column(
        db.Integer,
        db.ForeignKey("sale.id", ondelete="CASCADE")
    )
    product_id = db.Column(
        db.Integer,
        db.ForeignKey("product.id")
    )
    quantity = db.Column(
        db.Integer
    )
    sale_price = db.Column(
        Numeric(10, 2)
    )
    status = db.Column(
        db.Boolean,
        default = True,
        nullable = False
    )

    def profit(self):
        """Profit from a single sale item: (sale_price - unit_price) * quantity"""
        product = Product.query.get(self.product_id)
        if not product:
            return 0
        return float((self.sale_price - product.unit_price) * self.quantity)

    sale = db.relationship("Sale", foreign_keys=[sale_id], backref="sale_items")
    product = db.relationship("Product", foreign_keys=[product_id], backref="sale_items")