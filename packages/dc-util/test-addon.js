var ddescribe, div, expect, getCommonRoot, getComponentsBetween, idescribe, iit, list, ndescribe, nit, p, _ref, _ref1;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

p = dc.p, list = dc.list, div = dc.div;

_ref1 = require('dc-util/addon'), getCommonRoot = _ref1.getCommonRoot, getComponentsBetween = _ref1.getComponentsBetween;

describe("dc-util/addon", function() {
  describe("getCommonRoot", function() {
    it('should getCommonRoot of two same component', function() {
      var comp;
      comp = p();
      return expect(getCommonRoot(comp, comp)[0]).to.equal(comp);
    });
    it('should getCommonRoot of two component', function() {
      var c1, c2, comp;
      comp = list(c1 = p(), c2 = p());
      return expect(getCommonRoot(c1, c2)[0]).to.equal(comp);
    });
    it('should getCommonRoot of two component in different level', function() {
      var c1, c2, comp;
      comp = div(c1 = p(), list(p(), c2 = p()));
      return expect(getCommonRoot(c1, c2)[0]).to.equal(comp);
    });
    return it('should getCommonRoot of two component in different level', function() {
      var c1, c2, comp, comp1;
      comp = div(comp1 = div(c1 = p(), div(p(), c2 = p())), p());
      return expect(getCommonRoot(c1, c2)[0]).to.equal(comp1);
    });
  });
  return describe("getComponentsBetween", function() {
    it('should getComponentsBetween of two same component', function() {
      var comp;
      comp = p();
      return expect(getComponentsBetween(comp, comp)).to.deep.equal([comp]);
    });
    it('should getComponentsBetween of two component', function() {
      var c1, c2, comp;
      comp = list(c1 = p(), c2 = p());
      return expect(getComponentsBetween(c1, c2)).to.deep.equal([comp]);
    });
    it('should getComponentsBetween of two component in different level', function() {
      var c1, c2, c4, comp, lst;
      comp = div(c1 = p(), c4 = list(p(), c2 = p()));
      lst = getComponentsBetween(c1, c2);
      return expect(lst).to.deep.equal([comp]);
    });
    it('should getComponentsBetween of two component in different level 2', function() {
      var c1, c2, c4, comp, comp1;
      comp = div(comp1 = div(c1 = p(), c4 = div(p(), c2 = p())), p());
      return expect(getComponentsBetween(c1, c2)).to.deep.equal([comp1]);
    });
    it('start is not first leaf', function() {
      var c1, c2, c4, comp, comp1;
      comp = div(comp1 = div(p(), c1 = p(), c4 = div(p(), c2 = p())), p());
      return expect(getComponentsBetween(c1, c2)).to.deep.equal([c1, c4]);
    });
    it('start is not first leaf with mid brother', function() {
      var c1, c2, c3, c4, comp, comp1;
      comp = div(comp1 = div(p(), c1 = p(), c3 = p(), c4 = div(p(), c2 = p())), p());
      return expect(getComponentsBetween(c1, c2)).to.deep.equal([c1, c3, c4]);
    });
    it('start is first leaf with left top', function() {
      var c1, c2, c4, c5, comp, comp1;
      comp = div(comp1 = div(c4 = div(c5 = p(), c2 = p()), c1 = p(), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c4, c1]);
    });
    it('start is not first leaf with left top 2', function() {
      var c1, c2, c4, c5, comp, comp1;
      comp = div(comp1 = div(p(), c4 = div(c5 = p(), c2 = p()), c1 = p(), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c4, c1]);
    });
    it('more complicated', function() {
      var c1, c2, c4, c5, c6, comp, comp1;
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2 = p()), c1 = p(), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c1]);
    });
    it('more complicated 2', function() {
      var c1, c2, c4, c5, c6, comp, comp1;
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2 = p()), div(c6 = p(), c1 = p(), p()), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c6, c1]);
    });
    it('more complicated 3', function() {
      var c1, c2, c4, c5, c6, c7, comp, comp1;
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2 = p()), c7 = p(), div(c6 = p(), c1 = p(), p()), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c7, c6, c1]);
    });
    it('more complicated 4', function() {
      var c1, c2, c4, c5, c6, c7, c8, comp, comp1;
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2 = p()), c7 = p(), div(c8 = p(), div(c6 = p(), c1 = p(), p())), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c7, c8, c6, c1]);
    });
    it('more complicated 5', function() {
      var c1, c2, c3, c5, c6, c7, c8, c9, comp, comp1;
      comp = div(comp1 = div(p(), div(div(c3 = p(), c5 = p(), c2 = p()), c9 = p()), c7 = p(), div(c8 = p(), div(c6 = p(), c1 = p(), p())), p()));
      return expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c9, c7, c8, c6, c1]);
    });
    it('more complicated 6', function() {
      var c1, c11, c2, c3, c5, c6, c7, c8, c9, comp, comp1;
      comp = div(comp1 = div(p(23), c11 = div(div(c3 = p(3), c5 = p(5), c2 = p(2)), c9 = p(9)), c7 = p(7), div(c8 = p(8), div(c6 = p(6), c1 = p(1), p(21))), p(22)));
      comp.mount();
      expect(getComponentsBetween(c3, c1)).to.deep.equal([c11, c7, c8, c6, c1]);
      return comp.unmount();
    });
    return it('more complicated 7', function() {
      var c1, c11, c12, c2, c3, c5, c6, c7, c8, c9, comp, comp1;
      comp = div(comp1 = div(p(23), c11 = div(div(c3 = p(3), c5 = p(5), c2 = p(2)), c9 = p(9)), c7 = p(7), c12 = div(c8 = p(8), div(c6 = p(6), p(21), c1 = p(1))), p(22)));
      comp.mount();
      expect(getComponentsBetween(c3, c1)).to.deep.equal([c11, c7, c12]);
      return comp.unmount();
    });
  });
});
