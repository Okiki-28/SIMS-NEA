from app.routes.auth import auth_bp
from app.routes.users import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)