# -*- coding: utf-8 -*-

import psycopg2
from flask import g

def init_db(app):
    app.teardown_appcontext(close_db)

def get_db(app):
    if not hasattr(g, "db_connection"):
        g.db_connection = _connect_db(app)
    return g.db_connection

def _connect_db(app):
    connection = psycopg2.connect(database=app.config["DATABASE_NAME"],
                                  user=app.config["DATABASE_USER"],
                                  password=app.config["DATABASE_PASSWORD"])
    return connection

def close_db(error):
    if hasattr(g, "db_connection"):
        g.db_connection.close()

def reset(app):
    with app.app_context():
        db = get_db(app)
        with app.open_resource("schema.sql", mode="r") as f:
            db.cursor().execute(f.read())
        db.commit()
