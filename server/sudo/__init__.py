from flask import Flask

from sudo import config, db, routes

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, HEAD'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

def setup_api(app):
    config.load_config(app)
    db.init_db(app)
    routes.setup_routes(app)
