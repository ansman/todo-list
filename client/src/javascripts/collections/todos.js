define("collections/todos", ["lib/collection"], function(Collection) {
  "use strict";

  return Collection.extend({
    todosLeft: function() {
      return this.where({completed: false}).length;
    }
  });
});
