define("collections/todos", ["lib/collection"], function(Collection) {
  "use strict";

  return Collection.extend({
    url: '/todos',

    todosLeft: function() {
      return this.where({completed: false}).length;
    },

    markAllAsComplete: function() {
      var that = this;

      this.each(function(model) {
        model.set({completed: true});
      });

      this.sync("update", this, {
        data: JSON.stringify({completed: true}),
        contentType: "application/json",
        success: function(response) {
          that.set(response, {parse: true});
        }
      });
    }
  });
});
