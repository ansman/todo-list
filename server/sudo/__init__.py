from flask import Flask

from sudo import config, db, routes, response

app = Flask(__name__)
app.response_class = response.Response

def setup_api(app):
    config.load_config(app)
    db.init_db(app)
    routes.setup_routes(app)
