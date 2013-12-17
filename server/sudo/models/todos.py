from psycopg2.extras import DictCursor

from sudo import date_provider

def get_all_todos(db):
    cursor = db.cursor(cursor_factory=DictCursor)
    cursor.execute('''
        SELECT
            "id",
            "completed",
            "title",
            "create_time",
            "update_time"
        FROM todos
        ORDER BY id
    ''')
    todos = cursor.fetchall()
    cursor.close()
    return map(convert_todo, todos)

def create_todo(db, data):
    now = date_provider.now()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO todos
        ("completed", "title", "create_time", "update_time")
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (bool(data.get('completed')), data['title'], now, now))
    return cursor.fetchone()[0]

def get_todo(db, todo_id):
    cursor = db.cursor(cursor_factory=DictCursor)
    cursor.execute('''
        SELECT
            "id",
            "completed",
            "title",
            "create_time",
            "update_time"
        FROM todos
        WHERE id = %s
    ''', (todo_id, ))
    todo = cursor.fetchone()
    cursor.close()
    return convert_todo(todo)

def update_todo(db, todo_id, data):
    now = date_provider.now()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE todos
        SET
            "completed" = %s,
            "title" = %s,
            "update_time" = %s
        WHERE id = %s
    ''', (bool(data.get('completed')), data['title'], now, todo_id))

def set_completed_status(db, completed):
    cursor = db.cursor()
    cursor.execute('''
        UPDATE todos
        SET
            "completed" = %s,
            "update_time" = %s
        WHERE "completed" != %s
    ''', (completed, date_provider.now(), completed))

def convert_todo(todo):
    if not todo:
        return todo
    return {
        "id": todo['id'],
        "completed": todo['completed'],
        "title": todo['title'],
        "create_time": todo['create_time'],
        "update_time": todo['update_time']
    }
