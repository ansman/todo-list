define('specs/collections/todos-spec.js', ['collections/todos'], function(Todos) {
  "use strict";

  describe('collections/todos', function() {
    describe("todosLeft", function() {
      it("returns the number of todos left, duh", function() {
        var todos = new Todos([{
          id: 1,
          completed: false
        }, {
          id: 2,
          completed: false
        }, {
          id: 3,
          completed: false
        }, {
          id: 4,
          completed: true
        }]);

        expect(todos.todosLeft()).toBe(3);
      });
    });

    describe("markAllAsComplete", function() {
      it("marks all todos as complete", function() {
        var collection = new Todos([{
          id: 1,
          completed: false
        }, {
          id: 2,
          completed: true
        }, {
          id: 3,
          completed: false
        }, {
          id: 4,
          completed: false
        }]);

        spyOn(collection, 'sync');
        collection.markAllAsComplete();
        expect(collection.where({completed: false})).toEqual([]);
        expect(collection.sync).toHaveBeenCalled();
      });
    });
  });
});
