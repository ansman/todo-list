define('views/todos', ['lib/view', 'views/todo', 'text!templates/todos.html'], function(View, TodoView, template) {
  "use strict";

  return View.extend({
    id: "todos",
    template: _.template(template),

    initialize: function() {
      _.bindAll(this, 'getRenderedItemViewFor', 'renderItem');
      this.getRenderedItemViewFor = _.memoize(this.getRenderedItemViewFor);
    },

    onRender: function() {
      this.$itemsContainer = this.$('ul')
        .empty();
      this.collection.each(this.renderItem);
      this.updateItemCount();
    },

    renderItem: function(model) {
      var view = this.getRenderedItemViewFor(model);
      this.$itemsContainer.append(view.el);
    },

    getRenderedItemViewFor: function(model) {
      var view = new TodoView({model: model});
      return view.render();
    },

    updateItemCount: function() {
      this.$('.item-count .count').text(this.collection.todosLeft());
    }
  });
});
