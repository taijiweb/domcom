var Component, List, Tag, Text, a, button, classFn, div, duplex, expect, func, idescribe, if_, iit, input, li, list, model, ndescribe, nit, p, see, show, span, styleFrom, text, txt, _ref;

_ref = require('./helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, model = dc.model, show = dc.show, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

describe("component event", function() {
  describe('beforeMount', function() {
    it('component shoud call listeners before mounting', function() {
      var comp, x;
      x = 0;
      comp = p();
      comp.on('beforeMount', function() {
        return x = 1;
      });
      comp.mount();
      return expect(x).to.equal(1);
    });
    it('component shoud call listeners before mounting if_', function() {
      var comp, x;
      x = 0;
      comp = if_(1, 2, 3);
      comp.on('beforeMount', function() {
        return x = 1;
      });
      comp.mount();
      return expect(x).to.equal(1);
    });
    it('component shoud call then_.listeners before updating if_', function() {
      var comp, t, x;
      x = see(0);
      comp = if_(x, t = txt(1), txt(2));
      t.on('beforeMount', function() {
        return x(1);
      });
      comp.mount();
      expect(x()).to.equal(0);
      x(1);
      comp.update();
      return expect(x()).to.equal(1);
    });
    return it('component shoud not call embeded listeners before updating if_', function() {
      var comp, t, x;
      x = see(0);
      comp = if_(x, p(t = txt(1)), txt(2));
      t.on('beforeMount', function() {
        return x(1);
      });
      comp.mount();
      expect(x()).to.equal(0);
      x(1);
      comp.update();
      return expect(x()).to.equal(1);
    });
  });
  return describe('afterUnmount callback', function() {
    it('component shoud call listeners after mounting', function() {
      var comp, x;
      x = see(0);
      comp = p();
      comp.on('beforeMount', function() {
        return x(1);
      });
      comp.on('afterUnmount', function() {
        return x(2);
      });
      comp.mount();
      expect(x()).to.equal(1);
      comp.unmount();
      return expect(x()).to.equal(2);
    });
    it('component shoud call listeners before mounting if_', function() {
      var comp, x, y;
      x = 0;
      y = 0;
      comp = if_(1, 2, 3);
      comp.on('beforeMount', function() {
        return x = 1;
      });
      comp.on('afterMount', function() {
        return y = 2;
      });
      comp.mount();
      expect(x).to.equal(1);
      comp.unmount();
      return expect(y).to.equal(2);
    });
    it('component shoud NOT call then_.listeners["beforeMount"] before updating if_', function() {
      var comp, t, t2, x, y;
      x = see(0);
      y = 0;
      comp = if_(x, t = txt(1), t2 = txt(2));
      t.on('beforeMount', function() {
        return x(1);
      });
      t2.on('afterUnmount', function() {
        return y = 2;
      });
      comp.mount();
      expect(x()).to.equal(0, 'mount');
      x(1);
      comp.update();
      expect(x()).to.equal(1);
      return expect(y).to.equal(0);
    });
    return it('component shoud NOT call embeded mountCallback before updating if_', function() {
      var comp, t, t2, x, y;
      x = see(0);
      y = 0;
      comp = if_(x, p(t = txt(1)), p(t2 = txt(2)));
      t.on('beforeMount', function() {
        return x(1);
      });
      t2.on('afterMount', function() {
        return y = 2;
      });
      comp.mount();
      expect(x()).to.equal(0);
      x(1);
      comp.update();
      expect(x()).to.equal(1);
      return expect(y).to.equal(0);
    });
  });
});
