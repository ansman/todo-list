import os
from urlparse import urlparse

def load_config(app):
    uri = os.environ.get("DATABASE", "postgresql://sudo:p4ssw0rd@localhost:5432/sudo")
    uri = urlparse(uri)

    app.config.update(DATABASE_HOST=uri.hostname,
                      DATABASE_PORT=uri.port,
                      DATABASE_USER=uri.username,
                      DATABASE_PASSWORD=uri.password,
                      DATABASE_NAME=uri.path[1:])
