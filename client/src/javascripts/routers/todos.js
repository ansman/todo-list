define("routers/todos", ["backbone", "collections/todos", "views/todos"], function(Backbone, TodosCollection, TodosView) {
  return Backbone.Router.extend({
    routes: {
      "": "main"
    },

    initialize: function(options) {
      this.$container = options.$container;
      this.collection = options.collection;
    },

    main: function() {
      var view = new TodosView({collection: this.collection});
      this.$container.html(view.render().el);
    }
  });
});
