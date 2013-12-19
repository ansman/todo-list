define("views/todos",
       ["lib/view", "views/todo", "views/new-todo", "text!templates/todos.html", "lib/dragger"],
       function(View, TodoView, NewTodoView, template, Dragger) {
  "use strict";

  return View.extend({
    id: "todos",
    template: _.template(template),

    events: {
      "submit .new-todo": "createTodo",
      "click .mark-all": "markAllAsComplete"
    },

    initialize: function() {
      _.bindAll(this,
                "getRenderedItemViewFor",
                "renderItem",
                "updateItemCount",
                "collectionUpdated",
                "handleCollectionError",
                "saveOrder");

      // Cache the result from this function
      this.getRenderedItemViewFor = _.memoize(this.getRenderedItemViewFor,
                                              function(model) {
                                                return model.cid;
                                              });

      this.listenTo(this.collection, "add remove", this.collectionUpdated);
      this.listenTo(this.collection, "error", this.handleCollectionError);
      this.collection.fetch();

      this.newTodoView = new NewTodoView({collection: this.collection});
      this.addSubview(this.newTodoView);
    },

    onRender: function() {
      this.$itemsContainer = this.$("ul").empty();
      this.renderNewTodoView();

      this.dragger = new Dragger({
        $root: this.$itemsContainer,
        handleSelector: ".dragger",
        itemSelector: ".todo"
      });

      this.dragger
        .setup()
        .on("item-dropped", this.saveOrder);
    },

    renderNewTodoView: function() {
      this.$(".new-todo").replaceWith(this.newTodoView.render().el);
    },

    collectionUpdated: function() {
      this.updateItemCount();
      this.collection.each(this.renderItem);
    },

    handleCollectionError: function(model, resp) {
      // TODO: Improve error handling
      alert("Something went wrong :(");
      if (window.console && console.error) console.error(resp);
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

    markAllAsComplete: function() {
      this.collection.markAllAsComplete();
      this.updateItemCount();
    },

    saveOrder: function($item) {
      var model = this.collection.get($item.data("todoID"))
        , that = this;
      if (!model) return;

      // The new order should be the order of the element the item was dropped on
      var newOrder = this.collection.at($item.index()).get("order");

      if (newOrder === model.get("order")) return;

      model.save({order: newOrder}, {
        success: function() { that.collection.fetch(); }
      });
    }
  });
});
