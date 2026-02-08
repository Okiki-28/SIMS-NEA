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

    # Computed properties
    @property
    def no_of_items(self):
        """Total quantity of all items in this sale"""
        return sum(item.quantity for item in self.sale_items if item.status)
    
    @property
    def total_amount(self):
        """Total sale amount"""
        return sum(
            item.quantity * item.sale_price 
            for item in self.sale_items 
            if item.status
        )