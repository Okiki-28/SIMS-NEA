from .users import users_bp
from .auth import auth_bp
from .hello import hello_bp

def register_routes(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(hello_bp)