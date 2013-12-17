from datetime import datetime
import nose.tools as nt
from flask import json

from sudo import app, db, date_provider
from sudo.models import todos

class Base(object):
    def setup(self):
        date_provider.set_now(datetime(2013, 12, 16, 21, 59, 13))
        db.reset(app)
        self.app = app.test_client()

class TestCreatingTodos(Base):
    def test_creating_todo_returns_the_todo(self):
        data = json.dumps({
            "title": "Do laundry",
        })
        response = self.app.post('/todos', data=data)
        nt.assert_equals(response.status_code, 201)
        data = json.loads(response.data)

        nt.assert_not_equals(data.get('id'), None)
        nt.assert_equals(data.get('completed'), False)
        nt.assert_equals(data.get('title'), "Do laundry")
        nt.assert_equals(data.get('update_time'), '2013-12-16T21:59:13+00:00')
        nt.assert_equals(data.get('create_time'), '2013-12-16T21:59:13+00:00')

    def test_creating_todo_inserts_the_todo(self):
        data = json.dumps({
            "title": "Do laundry",
        })
        response = self.app.post('/todos', data=data)
        nt.assert_equals(response.status_code, 201)
        todo_id = json.loads(response.data).get('id')

        with app.app_context():
            todo = todos.get_todo(db.get_db(app), todo_id)
            nt.assert_not_equals(todo, None)

class TestListingTodos(Base):
    def test_listing_no_todos_gives_empty_list(self):
        response = self.app.get('/todos')
        nt.assert_equals(response.status_code, 200)
        data = json.loads(response.data)
        nt.assert_equals(data, [])

    def test_listing_multiple_todos(self):
        with app.app_context():
            tid1 = todos.create_todo(db.get_db(app), {"title": "Foo"})
            tid2 = todos.create_todo(db.get_db(app), {
                "title": "Bar",
                "completed": True
            })
            tid3 = todos.create_todo(db.get_db(app), {"title": "Baz"})


        response = self.app.get('/todos')
        nt.assert_equals(response.status_code, 200)
        data = json.loads(response.data)

        nt.assert_equals(data, [{
            "id": tid1,
            "title": "Foo",
            "completed": False,
            "update_time": '2013-12-16T21:59:13+00:00',
            "create_time": '2013-12-16T21:59:13+00:00'
        }, {
            "id": tid2,
            "title": "Bar",
            "completed": True,
            "update_time": '2013-12-16T21:59:13+00:00',
            "create_time": '2013-12-16T21:59:13+00:00'
        }, {
            "id": tid3,
            "title": "Baz",
            "completed": False,
            "update_time": '2013-12-16T21:59:13+00:00',
            "create_time": '2013-12-16T21:59:13+00:00'
        }])

class TestGettingTodos(Base):
    def test_getting_missing_todo_gives_404(self):
        response = self.app.get('/todos/4711')
        nt.assert_equals(response.status_code, 404)

    def test_getting_a_single_todo(self):
        with app.app_context():
            todo_id = todos.create_todo(db.get_db(app), {
                "title": "Do laundry",
            })

        response = self.app.get('/todos/{}'.format(todo_id))
        nt.assert_equals(response.status_code, 200)
        data = json.loads(response.data)

        nt.assert_equals(data.get('id'), todo_id)
        nt.assert_equals(data.get('completed'), False)
        nt.assert_equals(data.get('title'), "Do laundry")
        nt.assert_equals(data.get('update_time'), '2013-12-16T21:59:13+00:00')
        nt.assert_equals(data.get('create_time'), '2013-12-16T21:59:13+00:00')

class TestUpdatingTodos(Base):
    def setup(self):
        super(TestUpdatingTodos, self).setup()

        with app.app_context():
            self.todo_id = todos.create_todo(db.get_db(app), {
                "title": "Do laundry"
            })

    def test_updating_missing_gives_404(self):
        data = json.dumps({"title": "Foo", "completed": False})
        response = self.app.put('/todos/4711', data=data)
        nt.assert_equals(response.status_code, 404)

    def test_updating_a_todo_returns_the_updated_todo(self):
        data = json.dumps({
            "title": "Do something else",
            "completed": True
        })
        response = self.app.put('/todos/{}'.format(self.todo_id), data=data)
        nt.assert_equals(response.status_code, 200)
        data = json.loads(response.data)
        nt.assert_equals(data.get('id'), self.todo_id)
        nt.assert_equals(data.get('completed'), True)
        nt.assert_equals(data.get('title'), "Do something else")

    def test_updating_a_todo_actually_updates_it(self):
        data = json.dumps({
            "title": "Do something else",
            "completed": True
        })
        response = self.app.put('/todos/{}'.format(self.todo_id), data=data)
        nt.assert_equals(response.status_code, 200)

        with app.app_context():
            todo = todos.get_todo(db.get_db(app), self.todo_id)

        nt.assert_equals(todo['completed'], True)
        nt.assert_equals(todo['title'], "Do something else")

    def test_updating_a_todo_updates_update_time_but_not_create_time(self):
        data = json.dumps({
            "title": "Do something else",
            "completed": True
        })
        date_provider.add_minutes(10)
        response = self.app.put('/todos/{}'.format(self.todo_id), data=data)
        nt.assert_equals(response.status_code, 200)

        with app.app_context():
            todo = todos.get_todo(db.get_db(app), self.todo_id)

        data = json.loads(response.data)
        nt.assert_equals(data.get('create_time'), '2013-12-16T21:59:13+00:00')
        nt.assert_equals(data.get('update_time'), '2013-12-16T22:09:13+00:00')

class TestMarkingAllCompleted(Base):
    def test_sets_all_todos_to_completed(self):
        with app.app_context():
            tid1 = todos.create_todo(db.get_db(app), {"title": "Foo"})
            tid2 = todos.create_todo(db.get_db(app), {
                "title": "Foo",
                "completed": True
            })
            tid3 = todos.create_todo(db.get_db(app), {"title": "Foo"})

        data = json.dumps({"completed": True})
        response = self.app.put('/todos', data=data)
        nt.assert_equals(response.status_code, 200)
        data = json.loads(response.data)

        data = [(t['id'], t['completed']) for t in data]
        nt.assert_equals(data, [(tid1, True), (tid2, True), (tid3, True)])

    def test_updates_update_time_on_changed(self):
        with app.app_context():
            tid1 = todos.create_todo(db.get_db(app), {"title": "Foo"})
            tid2 = todos.create_todo(db.get_db(app), {
                "title": "Foo",
                "completed": True
            })

        date_provider.add_minutes(10)
        data = json.dumps({"completed": True})
        response = self.app.put('/todos', data=data)
        nt.assert_equals(response.status_code, 200)

        with app.app_context():
            t1 = todos.get_todo(db.get_db(app), tid1)
            t2 = todos.get_todo(db.get_db(app), tid2)

        nt.assert_equals(t1['update_time'].isoformat(), '2013-12-16T22:09:13+00:00')
        nt.assert_equals(t2['update_time'].isoformat(), '2013-12-16T21:59:13+00:00')
