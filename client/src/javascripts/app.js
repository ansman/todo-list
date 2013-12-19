define("app", ["routers/todos", "collections/todos", "backbone", "jquery", "underscore", "config"], function(TodosRouter, TodosCollection, Backbone, $, _, config) {
  "use strict";

  Backbone.ajax = function(options) {
    return $.ajax(_.extend({}, options, {
      url: config.apiURL + options.url
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
      Backbone.history.start({pushState: true});
    }
  };
});
