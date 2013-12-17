define('views/todos', ['lib/view', 'views/todo', 'text!templates/todos.html'], function(View, TodoView, template) {
  "use strict";

  return View.extend({
    id: "todos",
    template: _.template(template)
  });
});
