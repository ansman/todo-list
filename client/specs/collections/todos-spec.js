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
  });
});
