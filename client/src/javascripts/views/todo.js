define("views/todo", ["lib/view", "text!templates/todo.html", "underscore"], function(View, template, _) {
  "use strict";

  return View.extend({
    template: _.template(template),
    className: "todo",
    tagName: "li",

    events: {
      "change input": "updateModel"
    },

    initialize: function() {
      _.bindAll(this, "updateCompleted", "updateTitle");
      this.listenTo(this.model, "change:completed", this.updateCompleted);
      this.listenTo(this.model, "change:title", this.updateTitle);
    },

    onRender: function() {
      this.$completed = this.$("input[name=completed]");
      this.$title = this.$("input[name=title]");

      this.updateCompleted();
      this.updateTitle();
    },

    updateCompleted: function() {
      this.$completed.prop({checked: this.model.get("completed")});
    },

    updateTitle: function() {
      this.$title.val(this.model.get("title"));
    },

    updateModel: function() {
      var title = this.$title.val();

      if (!title) {
        this.updateTitle();
        return;
      }

      this.model.save({
        completed: this.$completed.prop("checked"),
        title: title
      });
      this.trigger("change:completed");
    }
  });
});
