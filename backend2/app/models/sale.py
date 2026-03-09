from app import db

class Sale(db.Model):

    __tablename__ = "sale"

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False  # Should a sale always have a user?
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no"),
        nullable=False
    )
    date = db.Column(
        db.DateTime(timezone=True), 
        server_default=db.func.now(),
        nullable=False
    )

    # Relationships
    user = db.relationship("User", foreign_keys=[user_id], backref="sales")
    company = db.relationship("Company", foreign_keys=[company_reg_no], backref="sales")

    def total_revenue(self):
        """Total revenue from all items in this sale"""
        return float(sum(item.sale_price * item.quantity for item in self.items if item.status))

    def total_profit(self):
        """Total profit from all items in this sale"""
        return float(sum(item.profit() for item in self.items if item.status))

    def total_cost(self):
        """Total cost of goods sold in this sale"""
        return float(self.total_revenue() - self.total_profit())