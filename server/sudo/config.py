# -*- coding: utf-8 -*-

def load_config(app):
    app.config.update(DATABASE_NAME="sudo",
                      DATABASE_USER="sudo",
                      DATABASE_PASSWORD="p4ssw0rd",
                      DEBUG=True)
