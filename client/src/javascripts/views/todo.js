define("views/todo", ["lib/view", "text!templates/todo.html", "underscore"], function(View, template, _) {
  "use strict";

  return View.extend({
    template: _.template(template),
    className: "todo",
    tagName: "li",

    events: {
      "change input": "updateModel"
    },

    attributes: {
      draggable: "true"
    },

    initialize: function() {
      _.bindAll(this, "updateCompleted", "updateTitle", "setElementID");
      this.listenTo(this.model, "change:completed", this.updateCompleted);
      this.listenTo(this.model, "change:title", this.updateTitle);

      // New models will not have an ID until the are persisted
      if (this.model.id)
        this.setElementID();
      else
        this.listenToOnce(this.model, "change:id", this.setElementID);
    },

    setElementID: function() {
      this.$el.data({todoID: this.model.id});
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
