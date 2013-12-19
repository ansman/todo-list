from psycopg2.extras import DictCursor
from functools import wraps

from sudo import date_provider

def with_cursor(f):
    @wraps(f)
    def wrapper(db, *args, **kwargs):
        cursor = db.cursor(cursor_factory=DictCursor)
        try:
            ret = f(cursor, *args, **kwargs)
            db.commit()
            return ret
        except:
            db.rollback()
            raise
        finally:
            cursor.close()
    return wrapper

@with_cursor
def get_all_todos(cursor):
    cursor.execute("""
        SELECT
            "id",
            "completed",
            "order",
            "title",
            "create_time",
            "update_time"
        FROM todos
        ORDER BY "order"
    """)
    todos = cursor.fetchall()
    return map(convert_todo, todos)

@with_cursor
def create_todo(cursor, data):
    now = date_provider.now()
    cursor.execute('SELECT MAX("order") AS max_order FROM todos');
    row = cursor.fetchone()
    max_order = row["max_order"] or 0

    cursor.execute("""
        INSERT INTO todos
        ("completed", "title", "create_time", "update_time", "order")
        VALUES (%s, %s, %s, %s, %s)
        RETURNING
            "id",
            "completed",
            "order",
            "title",
            "create_time",
            "update_time"
    """, (bool(data.get("completed")), data["title"], now, now, max_order+1))
    todo = cursor.fetchone()
    return convert_todo(todo)

@with_cursor
def get_todo(cursor, todo_id):
    cursor.execute("""
        SELECT
            "id",
            "completed",
            "order",
            "title",
            "create_time",
            "update_time"
        FROM todos
        WHERE id = %s
    """, (todo_id, ))
    todo = cursor.fetchone()
    return convert_todo(todo)

@with_cursor
def update_todo(cursor, todo_id, data):
    now = date_provider.now()

    cursor.execute('SELECT "order" FROM todos WHERE "id" = %s', (todo_id,))
    old_todo = cursor.fetchone()
    if not old_todo:
        return None

    old_order = old_todo["order"]
    new_order = int(data.get("order", old_order))

    _shift_todos(cursor, old_order, new_order)
    cursor.execute("""
        UPDATE todos
        SET
            "completed" = %s,
            "title" = %s,
            "update_time" = %s,
            "order" = %s
        WHERE "id" = %s
        RETURNING
            "id",
            "completed",
            "order",
            "title",
            "create_time",
            "update_time"
    """, (bool(data.get("completed")), data["title"], now, new_order, todo_id))
    todo = cursor.fetchone()
    return convert_todo(todo)

def _shift_todos(cursor, old_order, new_order):
    diff = old_order - new_order
    if diff != 0:
        cursor.execute("""
            UPDATE todos
            SET
                "order" = "order" + %s
            WHERE
                "order" >= %s AND
                "order" <= %s
        """, (
            diff/abs(diff),
            min(new_order, old_order),
            max(new_order, old_order)
        ))


@with_cursor
def set_completed_status(cursor, completed):
    cursor.execute("""
        UPDATE todos
        SET
            "completed" = %s,
            "update_time" = %s
        WHERE "completed" != %s
    """, (completed, date_provider.now(), completed))

def convert_todo(todo):
    if not todo:
        return todo
    return {
        "id": todo["id"],
        "completed": todo["completed"],
        "order": todo["order"],
        "title": todo["title"],
        "create_time": todo["create_time"],
        "update_time": todo["update_time"]
    }
