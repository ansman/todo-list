define("lib/dragger", ["backbone", "underscore"], function(Backbone, _) {
  var Dragger = function(options) {
    this.$root = options.$root;
    this.handleSelector = options.handleSelector;
    this.itemSelector = options.itemSelector;

    _.bindAll(this, 'startDragging', 'stopDragging', 'dragOver');
  };

  _.extend(Dragger.prototype, Backbone.Events, {
    setup: function() {
      var that = this;

      this.$root
        .on("mousedown", this.handleSelector, function() {
          that.handle = true;
        })
        .on("mouseup", this.handleSelector, function() {
          that.handle = false;
        })
        .on("dragstart", this.itemSelector, this.startDragging)
        .on("dragend drop", this.itemSelector, this.stopDragging)
        .on("dragend drop", this.stopDragging)
        .on("dragover dragenter", this.itemSelector, this.dragOver)
        .on("dragover dragenter", this.dragOver);

      return this;
    },

    startDragging: function(ev) {
      if (!this.handle) return false;

      var $item = $(ev.target)
        , that = this
        , dt = ev.originalEvent.dataTransfer;

      dt.effectAllowed = 'move';
      dt.setData('Text', 'dummy');
      this.handle = false;

      // This cannot be done directly since the browser will copy the look of
      // the element as it looks when this function returns
      _.defer(function() {
        that.$root.addClass("reordering");
        $item.addClass("dragging");
      });
    },

    stopDragging: function(ev) {
      var $item = this.$root.find(".dragging");
      if ($item.length === 0) return;
      $item.removeClass("dragging");
      this.$root.removeClass("reordering");
      this.trigger("item-dropped", $item);
      return false;
    },

    dragOver: function(ev) {
      ev.preventDefault();

      var $target = $(ev.target).closest(this.itemSelector);

      if ($target.length === 0) return;

      var $item = this.$root.find(".dragging");

      if ($item.index() > $target.index())
        $item.insertBefore($target);
      else
        $item.insertAfter($target);

      return false;
    }
  });

  return Dragger;
});
