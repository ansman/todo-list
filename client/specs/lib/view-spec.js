define('specs/lib/view-spec.js', ['lib/view'], function(View) {
  "use strict";

  describe('lib/view', function() {
    describe("closing", function() {
      it("closes subviews recursivly", function() {
        var view1 = new View()
          , view2 = new View()
          , view3 = new View();

        spyOn(view2, 'close').andCallThrough();
        spyOn(view3, 'close').andCallThrough();

        view1.addSubview(view2);
        view2.addSubview(view3);

        view1.close();

        expect(view2.close).toHaveBeenCalled();
        expect(view3.close).toHaveBeenCalled();
      });

      it("doesn't close the same view twice", function() {
        var view1 = new View()
          , view2 = new View();

        spyOn(view2, 'close').andCallThrough();

        view1.addSubview(view2);
        view1.addSubview(view2);
        view1.addSubview(view2);

        view1.close();

        expect(view2.close.callCount).toBe(1);
      });
    });

    it("calls onClose when closing a view", function() {
      var view = new View();
      spyOn(view, 'onClose');
      view.close();
      expect(view.onClose).toHaveBeenCalled();
    });

    it("removes the element from the DOM", function() {
      var view = new View();
      spyOn(view, 'remove');
      view.close();
      expect(view.remove).toHaveBeenCalled();
    });
  });
});
