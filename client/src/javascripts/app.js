define("app", ["routers/todos", "collections/todos", "backbone"], function(TodosRouter, TodosCollection, Backbone) {
  "use strict";
  var methodMap = {
    "create": "POST",
    "read": "GET",
    "update": "PUT",
    "delete": "DELETE"
  };

  function buildURL(endpoint) {
      return "http://localhost:4000" + endpoint;
  }

  Backbone.sync = function(method, model, options) {
    var verb = methodMap[method]
      , endpoint = _.result(model, "url")
      , data = null;

    options = options || {};

    if (method in ["create", "update"]) data = model.toJSON();

    return $.ajax({
      complete: options.complete,
      contentType: "application/json",
      data: data,
      dataType: "json",
      error: options.error,
      success: options.success,
      type: verb,
      url: buildURL(endpoint)
    });
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
