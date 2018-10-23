var Component, Tag, Text, TransformComponent, a, case_, ddescribe, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, see, span, text, txt;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({see, Component, TransformComponent, Tag, Text, txt, list, func, if_, case_, func, each, a, p, span, text, div, flow} = dc);

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
      }).to.throw(Error);
    });
    it('should throw error while constucting conflicted component list(t, p(t)))', function() {
      var t;
      t = txt(1);
      return expect(function() {
        return list(t, p(t));
      }).to.throw(Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(1, t, 0))', function() {
      var t;
      t = txt(1);
      //if_(1, t, 0) is converted to t for optimization
      return expect(function() {
        return list(p(t), if_(1, t, 0));
      }).to.throw(Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(0, 2, t))', function() {
      var t;
      t = txt(1);
      //if_(0, 2, t)is converted to t for optimization
      return expect(function() {
        return list(p(t), if_(0, 2, t));
      }).to.throw(Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(-> x, t, t))', function() {
      var t, x;
      t = txt(1);
      x = 0;
      // if_(-> x, t, t) is converted to t for optimization
      return expect(function() {
        return list(p(t), if_((function() {
          return x;
        }), t, t));
      }).to.throw(Error);
    });
    it('should throw error while conflicted component in list(p(t), if_(-> x, p(t), t))', function() {
      var t, x;
      t = txt(1);
      x = 0;
      return expect(function() {
        return list(p(t), if_((function() {
          return x;
        }), p(t), t));
      }).to.throw(Error);
    });
    return it('should updateBaseComponent of if_((-> x), t=txt(1), t)', function() {
      var comp, t, x;
      x = see(0);
      comp = if_(x, t = txt(1), t);
      comp.mount();
      return comp.render();
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
    it('should process text clone component bind', function() {
      var comp, t1;
      comp = list(t1 = txt(1), t1.clone());
      comp.mount('#demo');
      comp.render();
      return expect(comp.node[1].textContent).to.equal('1');
    });
    it('should process text clone component with bind', function() {
      var t1, t2;
      t1 = txt(flow.thisBind('x'));
      t2 = t1.clone();
      t1.x = 1;
      t2.x = 2;
      t1.mount('#demo');
      t2.mount('#demo');
      expect(t1.node.textContent).to.equal('1');
      expect(t2.node.textContent).to.equal('2');
      t2.x = 3;
      t2.render();
      return expect(t2.node.textContent).to.equal('3', 3);
    });
    it('should process mount cloned tag ', function() {
      var c1, comp;
      c1 = p(1);
      comp = c1.clone();
      comp.mount('#demo');
      comp.render();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    it('should process tag clone component ', function() {
      var c1, c2, comp;
      c1 = p(1);
      c2 = c1.clone();
      comp = list(c1, c2);
      comp.mount('#demo');
      comp.render();
      return expect(comp.node[1].innerHTML).to.equal('1');
    });
    return it('should process if_ clone component ', function() {
      var c1, c2, comp, lstComp, x;
      x = see(0);
      c1 = p(1);
      c2 = c1.clone();
      lstComp = list(c1, c2);
      comp = if_(x, p(3), lstComp);
      comp.mount('#demo');
      x(1);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('3');
    });
  });
});
