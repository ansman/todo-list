define("views/todos", ["lib/view", "views/todo", "text!templates/todos.html", "jquery"], function(View, TodoView, template, $) {
  "use strict";

  return View.extend({
    id: "todos",
    template: _.template(template),

    events: {
      "submit .new-todo": "createTodo"
    },

    initialize: function() {
      _.bindAll(this,
                "getRenderedItemViewFor",
                "renderItem",
                "updateItemCount",
                "collectionUpdated");
      this.collection.fetch();

      // Cache the result from this function
      this.getRenderedItemViewFor = _.memoize(this.getRenderedItemViewFor,
                                              function(model) {
                                                return model.cid;
                                              });

      this.listenTo(this.collection, "sync", this.collectionUpdated);
    },

    onRender: function() {
      this.$itemsContainer = this.$("ul").empty();
      this.$title = this.$(".new-todo input[name=title]");
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
      this.addSubview(view);
      // The view will trigger this when the user toggles the checkbox
      view.on("change:completed", this.updateItemCount);
      return view.render();
    },

    updateItemCount: function() {
      this.$(".item-count .count").text(this.collection.todosLeft());
    },

    createTodo: function(ev) {
      // Important or the page will reload!
      ev.preventDefault();

      var title = $.trim(this.$title.val());
      if (!title) return;

      var attributes = {title: title, completed: false};
      this.collection.create(attributes, {
        success: this.collectionUpdated
      });

      this.$title.val('');
    }
  });
});
