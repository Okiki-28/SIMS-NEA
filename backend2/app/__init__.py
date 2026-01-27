from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "dev-only-change-me"

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    from werkzeug.exceptions import HTTPException
    from app.utils.fail import fail

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return fail(error=e.name, status=e.code, details=e.description)

    # @app.errorhandler(Exception)
    # def handle_any_exception(e):
    #     return fail(error="Internal server Error", status=500)

    from app.routes import register_routes
    register_routes(app)

    return app