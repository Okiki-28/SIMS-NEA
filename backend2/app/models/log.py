from app import db

class Log(db.Model):

    __tablename__ = "log"
    id = db.Column(
        db.Integer,
        autoincrement=True,
        primary_key=True
    )
    company_reg_no = db.Column(
        db.String(10),
        db.ForeignKey("company.reg_no"),
        nullable=False
    )
    time = db.Column(
        db.DateTime(timezone=True), 
        server_default=db.func.now(),
        nullable=False
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )
    action = db.Column(
        db.String(16)
    )
    message = db.Column(
        db.String(255)
    )
    info = db.Column(
        db.JSON, 
        nullable=True
    ) 
    user = db.relationship("User", foreign_keys=[user_id], backref="logs")
    company = db.relationship("Company", foreign_keys=[company_reg_no], backref="logs")