define('views/todo', ['lib/view', 'text!templates/todo.html'], function(View, template) {
  "use strict";

  return View.extend({
    template: _.template(template),
    className: 'todo',
    tagName: 'li'
  });
});
