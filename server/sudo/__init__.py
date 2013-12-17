from flask import Flask

from sudo import config, db, routes

app = Flask(__name__)

def setup_api(app):
    config.load_config(app)
    db.init_db(app)
    routes.setup_routes(app)
