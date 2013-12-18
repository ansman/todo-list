define("views/todos", ["lib/view", "views/todo", "text!templates/todos.html"], function(View, TodoView, template) {
  "use strict";

  return View.extend({
    id: "todos",
    template: _.template(template),

    initialize: function() {
      _.bindAll(this,
                "getRenderedItemViewFor",
                "renderItem",
                "updateItemCount",
                "collectionUpdated");
      this.collection.fetch();

      // Cache the result from this function
      this.getRenderedItemViewFor = _.memoize(this.getRenderedItemViewFor);

      this.listenTo(this.collection, "sync", this.collectionUpdated);
    },

    onRender: function() {
      this.$itemsContainer = this.$("ul").empty();
    },

    collectionUpdated: function() {
      this.updateItemCount();
      this.collection.each(this.renderItem);
    },

    renderItem: function(model) {
      var view = this.getRenderedItemViewFor(model);
      this.$itemsContainer.append(view.el);
    },

    getRenderedItemViewFor: function(model) {
      var view = new TodoView({model: model});
      view.on("change:completed", this.updateItemCount);
      return view.render();
    },

    updateItemCount: function() {
      this.$(".item-count .count").text(this.collection.todosLeft());
    }
  });
});
