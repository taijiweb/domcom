var Component, Tag, Text, TransformComponent, a, case_, clone, ddescribe, div, each, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, see, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

see = dc.see, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, clone = dc.clone, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

describe('Component.refs, clone', function() {
  afterEach(function() {
    return dc.reset();
  });
  describe('refs', function() {
    it('should throw error while constucting conflicted component list(t, t))', function() {
      var t;
      t = txt(1);
      return expect(function() {
        return list(t, t);
      }).to["throw"](Error);
    });
    it('should throw error while constucting conflicted component list(t, p(t)))', function() {
      var t;
      t = txt(1);
      return expect(function() {
        return list(t, p(t));
      }).to["throw"](Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(1, t, 0))', function() {
      var t;
      t = txt(1);
      return expect(function() {
        return list(p(t), if_(1, t, 0));
      }).to["throw"](Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(0, 2, t))', function() {
      var t;
      t = txt(1);
      return expect(function() {
        return list(p(t), if_(0, 2, t));
      }).to["throw"](Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(-> x, t, t))', function() {
      var t, x;
      t = txt(1);
      x = 0;
      return expect(function() {
        return list(p(t), if_((function() {
          return x;
        }), t, t));
      }).to["throw"](Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(-> x, p(t), t))', function() {
      var t, x;
      t = txt(1);
      x = 0;
      return expect(function() {
        return list(p(t), if_((function() {
          return x;
        }), p(t), t));
      }).to["throw"](Error);
    });
    return it('should updateBaseComponent of if_((-> x), t=txt(1), t)', function() {
      var comp, t, x;
      x = see(0);
      comp = if_(x, t = txt(1), t);
      comp.mount();
      return dc.update();
    });
  });
  return describe('Clone', function() {
    it('should not clone node event handler', function() {
      var node, node2;
      node = document.createElement('p');
      node.value = 1;
      node.fakeProp = 2;
      node.onclick = function() {};
      node2 = node.cloneNode();
      expect(node2.onclick).to.equal(null);
      expect(node2.value).to.equal(void 0);
      return expect(node2.fakeProp).to.equal(void 0);
    });
    it('should clone TextNode', function() {
      var node, node2;
      node = document.createTextNode('afd');
      node.value = 1;
      node.fakeProp = 2;
      node.onclick = function() {};
      node2 = node.cloneNode();
      expect(node2.onclick).to.equal(void 0);
      expect(node2.textContent).to.equal('afd');
      expect(node2.value).to.equal(void 0);
      return expect(node2.fakeProp).to.equal(void 0);
    });
    it('should process text clone component ', function() {
      var comp, t1;
      comp = list(t1 = txt(1), clone(t1));
      comp.mount('#demo');
      dc.update();
      return expect(comp.node[1].textContent).to.equal('1');
    });
    it('should process tag clone component ', function() {
      var c1, c2, comp;
      comp = list(c1 = p(1), c2 = clone(c1));
      comp.mount('#demo');
      dc.update();
      return expect(comp.node[1].innerHTML).to.equal('1');
    });
    return it('should process if_ clone component ', function() {
      var c1, c2, comp, lstComp, x;
      x = see(0);
      lstComp = list(c1 = p(2), c2 = clone(c1));
      comp = if_(x, c1 = p(3), lstComp);
      comp.mount('#demo');
      x(1);
      dc.update();
      return expect(comp.node.innerHTML).to.equal('3');
    });
  });
});
