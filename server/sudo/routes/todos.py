# -*- coding: utf-8 -*-

from flask import json, request, abort
from functools import wraps

from sudo.db import get_db
from sudo.models import todos

def setup_routes(app):
    def parse_json(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            try:
                data = json.loads(request.data)
            except ValueError:
                abort(400, "Could not decode the request body")
            return f(*args, data=data, **kwargs)
        return wrapper

    def with_db(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            db = get_db(app)
            return f(*args, db=db, **kwargs)
        return wrapper

    @app.route("/todos", methods=["GET"])
    @with_db
    def get_todos(db):
        ts = todos.get_all_todos(db)
        ts = map(convert, ts)
        return json.dumps(ts)

    @app.route("/todos", methods=["POST"])
    @parse_json
    @with_db
    def create_todo(data, db):
        todo = todos.create_todo(db, data)
        todo = convert(todo)
        return json.dumps(todo), 201

    @app.route("/todos/<int:todo_id>", methods=["GET"])
    @with_db
    def get_todo(todo_id, db):
        todo = todos.get_todo(db, todo_id)
        if todo is None:
            abort(404)
        todo = convert(todo)
        return json.dumps(todo)

    @app.route("/todos/<int:todo_id>", methods=["PUT"])
    @parse_json
    @with_db
    def update_todo(todo_id, data, db):
        todo = todos.update_todo(db, todo_id, data)
        if not todo:
            abort(404)
        todo = convert(todo)
        return json.dumps(todo)

    @app.route("/todos", methods=["PUT"])
    @parse_json
    @with_db
    def update_all_todos(db, data):
        todos.set_completed_status(db, bool(data.get("completed")))
        ts = todos.get_all_todos(db)
        ts = map(convert, ts)
        return json.dumps(ts)

def convert(todo):
    c = dict(todo)
    c["update_time"] = todo["update_time"].isoformat()
    c["create_time"] = todo["create_time"].isoformat()
    return c
