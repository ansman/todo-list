define('lib/view', ['backbone'], function(Backbone) {
  "use strict";

  return Backbone.View.extend({
    render: function() {
      if (this.template) this.el.innerHTML = this.template(this.serializeData());
      this.onRender();
      return this;
    },

    serializeData: function() {
      return {
        model: this.model,
        collection: this.collection
      };
    },

    onRender: function() {},
  });
});
