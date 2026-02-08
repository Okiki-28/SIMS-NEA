from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

import os 
from dotenv import load_dotenv, find_dotenv

db = SQLAlchemy()
migrate = Migrate()

def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config.update(
        SESSION_COOKIE_SAMESITE="Lax",   # often OK for localhost dev
        SESSION_COOKIE_SECURE=False      # must be False on HTTP
    )

    dotenv_path = find_dotenv()
    load_dotenv(dotenv_path)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or "dev-only-change-me"

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, 
         resources={r"/api/*": {"origins": "http://127.0.0.1:3000"}},
         supports_credentials=True)

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