define("views/todos", ["lib/view", "views/todo", "views/new-todo", "text!templates/todos.html"], function(View, TodoView, NewTodoView, template) {
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

      this.newTodoView = new NewTodoView({collection: this.collection});
      this.addSubview(this.newTodoView);
    },

    onRender: function() {
      this.$itemsContainer = this.$("ul").empty();
      this.renderNewTodoView();
    },

    renderNewTodoView: function() {
      this.$(".new-todo").replaceWith(this.newTodoView.render().el);
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
  });
});
