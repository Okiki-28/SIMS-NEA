from app.routes.auth import auth_bp
from app.routes.users import user_bp
from app.routes.companies import company_bp
from app.routes.products import product_bp
from app.routes.suppliers import supplier_bp
from app.routes.categories import category_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(supplier_bp)
    app.register_blueprint(category_bp)