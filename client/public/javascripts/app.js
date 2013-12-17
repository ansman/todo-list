define('app', ['views/todos', 'collections/todos'], function(TodosView, TodosCollection) {
  "use strict";

  return {
    collections: {
      todos: new TodosCollection()
    },

    start: function(container) {
      var view = new TodosView({
        collection: this.collections.todos
      });
      container.append(view.render().el);
    }
  };
});
