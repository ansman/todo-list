define("views/new-todo", ["lib/view", "text!templates/new-todo.html", "jquery"], function(View, template, $) {
  return View.extend({
    template: _.template(template),
    className: "new-todo",
    tagName: "form",

    events: {
      "submit": "createTodo"
    },

    onRender: function() {
      this.$title = this.$("input[name=title]");
    },

    createTodo: function(ev) {
      // Important or the page will reload!
      ev.preventDefault();

      var title = $.trim(this.$title.val());
      if (!title) return;

      this.collection.create({title: title, completed: false});
      this.$title.val('');
    }
  });
});

