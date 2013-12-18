define('lib/view', ['backbone', 'underscore'], function(Backbone, _) {
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

    addSubview: function(view) {
      this._subviews = this._subviews || {};
      this._subviews[view.cid] = view;
    },

    close: function() {
      this.onClose();
      this._closeSubviews();
      this.remove();
    },

    _closeSubviews: function() {
      _.invoke(this._subviews, 'close');
    },

    onClose: function() {},
    onRender: function() {}
  });
});
