define("app", ["routers/todos", "collections/todos", "backbone", "jquery", "underscore"], function(TodosRouter, TodosCollection, Backbone, $, _) {
  "use strict";

  Backbone.ajax = function(options) {
    return $.ajax(_.extend({}, options, {
      url: "http://localhost:4000" + options.url
    }));
  };

  return {
    collections: {
      todos: new TodosCollection()
    },

    start: function($container) {
      var router = new TodosRouter({
        $container: $container,
        collection: this.collections.todos
      });
      Backbone.history.start();
    }
  };
});
