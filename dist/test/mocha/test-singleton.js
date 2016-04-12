var Component, If, Tag, Text, TransformComponent, a, case_, div, expect, flow, forceCase, forceIf, func, idescribe, if_, iit, list, ndescribe, newDemoNode, nit, p, pick, see, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

newDemoNode = require('./helper').newDemoNode;

see = dc.see, flow = dc.flow, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, forceIf = dc.forceIf, If = dc.If, case_ = dc.case_, forceCase = dc.forceCase, func = dc.func, pick = dc.pick, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

describe('singleton component: If, Case, Func, Pick, ...', function() {
  afterEach(function() {
    return dc.reset();
  });
  describe('If', function() {
    it('should optimize if_', function() {
      var t, x;
      t = txt(1);
      x = 0;
      expect(if_((function() {
        return x;
      }), t, t)).to.equal(t);
      expect(if_(0, 1, t)).to.equal(t);
      return expect(if_(1, t, 0)).to.equal(t);
    });
    it('should NOT optimize forceIf', function() {
      var comp, t;
      t = txt(1);
      comp = forceIf(0, 1, t);
      expect(comp).to.not.equal(t);
      return expect(comp.else_).to.equal(t);
    });
    it('should compute if_((-> x), p(t), t).family', function() {
      var t, x;
      t = txt(1);
      x = 0;
      return expect(if_((function() {
        return x;
      }), p(t), t).family[t.dcid]).to.equal(true);
    });
    it('should construct if_(x, p(t1), list(p(t2), t1))', function() {
      var t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      return if_(x, p(t1), list(t2, p(t1)));
    });
    it('should render if_(see something, txt(1), txt(2))', function() {
      var comp, x;
      x = see(0);
      comp = if_(x, txt(1), txt(2));
      comp.mount();
      expect(comp.node.textContent).to.equal('2', 'mount');
      comp.render();
      expect(comp.node.textContent).to.equal('2', 'update');
      x(1);
      comp.render();
      expect(comp.node.textContent).to.equal('1', 'update x 1');
      x(0);
      comp.render();
      return expect(comp.node.textContent).to.equal('2', 'update x 0');
    });
    it('should render forceIf(0, txt(1), txt(2))', function() {
      var comp;
      comp = forceIf(0, txt(1), txt(2));
      comp.mount();
      expect(comp.node.textContent).to.equal('2', 'mount');
      comp.render();
      expect(comp.node.textContent).to.equal('2', 'update');
      comp.test = 1;
      comp.render();
      expect(comp.node.textContent).to.equal('1', 'update x 1');
      comp.test = 0;
      comp.render();
      return expect(comp.node.textContent).to.equal('2', 'update x 0');
    });
    it('should render if_(x, list(t1, t2), list(t2, t1))', function() {
      var comp, demoNode, t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      comp = if_(x, list(t1, t2), list(t2, t1));
      comp.mount(demoNode = newDemoNode('if-ref'));
      expect(comp.node[0].textContent).to.equal('2', 'mount');
      expect(demoNode.innerHTML).to.equal('21', 'mount');
      x(1);
      comp.render();
      expect(comp.node[0].textContent).to.equal('1', 'update x 1');
      return expect(demoNode.innerHTML).to.equal('12', 'mount');
    });
    it('should render if_(x, list(t2, t1), t1)', function() {
      var comp, demoNode, lst, t1, t2, x;
      x = see(1);
      t1 = txt(1);
      t2 = txt(2);
      comp = if_(x, lst = list(t2, t1), t1);
      comp.mount(demoNode = newDemoNode('if-ref'));
      expect(demoNode.innerHTML).to.equal('21', 'mount');
      x(0);
      comp.render();
      return expect(demoNode.innerHTML).to.equal('1', 'update');
    });
    it('should render if_(x, t1, list(t2, t1))', function() {
      var comp, demoNode, lst, t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      comp = if_(x, t1, lst = list(t2, t1));
      comp.mount(demoNode = newDemoNode('if-ref'));
      expect(demoNode.innerHTML).to.equal('21', 'mount');
      comp.render();
      expect(demoNode.innerHTML).to.equal('21', 'update');
      x(1);
      comp.render();
      expect(demoNode.innerHTML).to.equal('1', 'update x 1');
      x(0);
      comp.render();
      return expect(demoNode.innerHTML).to.equal('21', 'update x 0');
    });
    it('should render if_(x, p(t1), list(p(t2), t1))', function() {
      var comp, demoNode, t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      comp = if_(x, p(t1), list(p(t2), t1));
      comp.mount(demoNode = newDemoNode('if-ref'));
      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'mount');
      x(1);
      comp.render();
      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
      x(0);
      comp.render();
      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'update x 0');
      x(1);
      comp.render();
      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
    });
    it('should render if_(x, p(t1), div(t2))', function() {
      var comp, demoNode, t1, x;
      x = see(0);
      t1 = txt(1);
      comp = if_(x, p(t1), div(t1));
      comp.mount(demoNode = newDemoNode('if-ref'));
      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'mount');
      x(1);
      comp.render();
      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
      x(0);
      comp.render();
      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'update x 0');
      x(1);
      comp.render();
      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
    });
    it('should render p(if_(x, p(t1), list(p(t2), t1)))', function() {
      var comp, if1, p1, t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      comp = p(if1 = if_(x, p1 = p(t1), list(p(t2), t1)));
      comp.mount();
      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'mount');
      comp.render();
      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update');
      x(1);
      comp.render();
      expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1');
      x(0);
      comp.render();
      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update x 0');
      x(1);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
    });
    it('should render if_(x, p(t1), p list(p(t2), t1))', function() {
      var comp, p1, p2, t1, t2, x;
      x = see(0);
      t1 = txt(1);
      t2 = txt(2);
      comp = if_(x, p1 = p(t1), p2 = p(list(p(t2), t1)));
      comp.mount();
      expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'mount');
      x(1);
      comp.render();
      expect(comp.node.innerHTML).to.equal('1', 'update x 1');
      x(0);
      comp.render();
      return expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'mount');
    });
    it('should render if_(x, div(1), div(2))', function() {
      var comp, x;
      x = see(0);
      comp = if_(x, div(1), div(2));
      comp.mount();
      expect(comp.node.tagName).to.equal('DIV', 'tagName');
      expect(comp.node.innerHTML).to.equal('2', 'mount');
      x(1);
      comp.render();
      expect(comp.node.innerHTML).to.equal('1', 'first update');
      x(0);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('2', 'second update');
    });
    it('should create and update if_ with attrs', function() {
      var c1, comp, x;
      x = see(0);
      comp = if_({
        "class": 'main',
        fakeProp: x
      }, x, c1 = p(1), p(2));
      expect(comp).to.be["instanceof"](Tag);
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties before mounting');
      comp.mount();
      expect(comp.node.tagName).to.equal('DIV');
      expect(comp.node.fakeProp).to.equal(0, 'mount fakeProp');
      expect(comp.node.childNodes[0].innerHTML).to.equal('2', 'mount innerHTML');
      expect(comp.node.childNodes[0].tagName).to.equal('P', 'mount C1 tagName');
      expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties after mounting');
      x(1);
      expect(comp.props.fakeProp).to.equal(x, 'see invalidate fakeProp');
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
      comp.render();
      expect(comp.node.fakeProp).to.equal(1, 'update fakeProp');
      expect(comp.node.childNodes[0].innerHTML).to.equal('1', 'update innerHTML');
      return expect(comp.node.childNodes[0]).to.equal(c1.node);
    });
    it('should create and render if followed by other node ', function() {
      var comp, demo2Node, p1, p2, p3, pIf, x;
      demo2Node = document.getElementById('demo2');
      demo2Node.innerHTML = '';
      x = see(0);
      comp = list(pIf = if_(x, p1 = p(1), p2 = p(2)), p3 = p(3));
      comp.mount(demo2Node);
      expect(pIf.node.innerHTML).to.equal('2');
      expect(demo2Node.innerHTML).to.equal('<p>2</p><p>3</p>');
      x(1);
      comp.render();
      expect(pIf.node.innerHTML).to.equal('1', 'pif update');
      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>3</p>', 'demo2Node update');
      return expect(comp.node[0].innerHTML).to.equal('1', 'comp update');
    });
    it('should create and render embedded if', function() {
      var c0, c1, c2, comp, demo2Node, x;
      demo2Node = document.getElementById('demo2');
      demo2Node.innerHTML = '';
      x = see(0);
      comp = list(txt(x), c0 = if_(x, c1 = p(1), c2 = p(2)));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('0<p>2</p>');
      expect(comp.parentNode).to.equal(demo2Node);
      expect(comp.node[1].innerHTML).to.equal('2');
      expect(c0.parentNode).to.equal(comp.parentNode);
      x(1);
      comp.render();
      expect(c0.parentNode).to.equal(comp.parentNode);
      expect(c0.node.innerHTML).to.equal('1');
      expect(c2.node.innerHTML).to.equal('2');
      expect(c0.node).to.equal(c1.node);
      return expect(comp.node[1]).to.equal(c1.node);
    });
    it('should process embedded if 2-1', function() {
      var comp, pIf, t1, x;
      x = see(0);
      comp = list(t1 = text(1), pIf = if_(x, div(1), div(2)));
      comp.mount();
      expect(pIf.node.innerHTML).to.equal('2');
      x(1);
      comp.render();
      expect(pIf.node.innerHTML).to.equal('1');
      x(0);
      comp.render();
      return expect(pIf.node.innerHTML).to.equal('2');
    });
    it('should process embedded if 2-2', function() {
      var comp, pIf, t1, x;
      x = see(0);
      pIf = if_(x, div(1), div(2));
      comp = list(t1 = text(x), pIf);
      comp.mount();
      expect(pIf.node.innerHTML).to.equal('2');
      x(1);
      comp.render();
      expect(pIf.node.innerHTML).to.equal('1');
      x(0);
      comp.render();
      return expect(pIf.node.innerHTML).to.equal('2');
    });
    it('should process embedded if 2-3', function() {
      var comp, pIf, x;
      x = see(0);
      comp = list(window.t1 = txt(x), pIf = if_(x, txt(1), txt(2)));
      comp.mount();
      expect(pIf.node.textContent).to.equal('2');
      x(1);
      comp.render();
      expect(pIf.node.textContent).to.equal('1');
      x(0);
      comp.render();
      return expect(pIf.node.textContent).to.equal('2');
    });
    it('should process event in embedded if 2-4', function() {
      var comp, pIf, t1, x;
      x = see(0);
      pIf = if_(x, div(1), div(2));
      comp = list(t1 = text({
        onchange: function() {
          x(parseInt(this.value));
          return comp.render();
        }
      }, x), pIf);
      comp.mount();
      expect(pIf.node.innerHTML).to.equal('2');
      t1.node.value = 1;
      t1.node.onchange({
        type: 'change'
      });
      expect(pIf.node.innerHTML).to.equal('1');
      t1.node.value = 0;
      t1.node.onchange({
        type: 'change'
      });
      return expect(pIf.node.innerHTML).to.equal('2');
    });
    it('should process event in embedded if 2-5', function() {
      var comp, pIf, t1, x;
      x = see(0);
      comp = list(t1 = text({
        onchange: function() {
          x(parseInt(this.value));
          return comp.render();
        }
      }, 1), pIf = if_(x, div(1), div(2)));
      comp.mount();
      expect(pIf.node.innerHTML).to.equal('2');
      t1.node.value = 1;
      t1.node.onchange({
        type: 'change'
      });
      expect(pIf.node.innerHTML).to.equal('1');
      t1.node.value = 0;
      t1.node.onchange({
        type: 'change'
      });
      return expect(pIf.node.innerHTML).to.equal('2');
    });
    it('should process event in embedded if 2-6', function() {
      var comp, pIf, t1, x;
      x = see(0);
      comp = list(t1 = text({
        onchange: function() {
          x(parseInt(this.value));
          return comp.render();
        }
      }, x), pIf = if_(x, div(1), div(2)));
      comp.mount();
      expect(pIf.node.innerHTML).to.equal('2');
      t1.node.value = 1;
      t1.node.onchange({
        type: 'change'
      });
      expect(pIf.node.innerHTML).to.equal('1');
      t1.node.value = 0;
      t1.node.onchange({
        type: 'change'
      });
      return expect(pIf.node.innerHTML).to.equal('2');
    });
    return it('should process two list with same children', function() {
      var comp, demoNode, t1, t2, t3, t4, x;
      x = see(1);
      t1 = txt(1);
      t2 = txt(2);
      t3 = txt(3);
      t4 = txt(4);
      comp = if_(x, list(t1, t2, t3, t4), list(t4, t1, t2, t3));
      comp.mount(demoNode = newDemoNode('list'));
      expect(demoNode.innerHTML).to.equal('1234');
      x(0);
      comp.render();
      expect(demoNode.innerHTML).to.equal('4123');
      x(1);
      comp.render();
      return expect(demoNode.innerHTML).to.equal('1234');
    });
  });
  describe('Case', function() {
    it('should create and render case_', function() {
      var comp, x;
      x = see(0);
      comp = case_(x, {
        1: p('a'),
        2: p('b'),
        3: p('c')
      }, 'others');
      comp.mount();
      expect(comp.node).to.be["instanceof"](window.Text);
      expect(comp.node.textContent).to.equal('others');
      x(1);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('a');
    });
    it('should create and render forceCase', function() {
      var comp;
      comp = forceCase(0, {
        1: p('a'),
        2: p('b'),
        3: p('c')
      }, 'others');
      comp.mount();
      expect(comp.node).to.be["instanceof"](window.Text);
      expect(comp.node.textContent).to.equal('others');
      comp.test = 1;
      comp.render();
      return expect(comp.node.innerHTML).to.equal('a');
    });
    return it('should create and render array case_', function() {
      var comp, x;
      x = see(3);
      comp = case_(x, [p('a'), p('b'), p('c')], 'others');
      comp.mount();
      expect(comp.node).to.be["instanceof"](window.Text);
      expect(comp.node.textContent).to.equal('others');
      x(1);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('b');
    });
  });
  describe('Func', function() {
    it('func(->12) ', function() {
      var comp;
      comp = func(function() {
        return 12;
      });
      comp.mount();
      expect(comp.node.textContent).to.equal('12');
      comp.render();
      expect(comp.node.textContent).to.equal('12');
      comp.render();
      return expect(comp.node.textContent).to.equal('12');
    });
    it('p(-> a))', function() {
      var comp;
      a = see(1);
      comp = p(a);
      comp.mount();
      a(2);
      comp.render();
      expect(comp.node.innerHTML).to.equal('2', 'update a 2');
      a(3);
      comp.render();
      a(4);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('4', 'update a 4');
    });
    it('should  create func component', function() {
      var comp, x;
      x = see(1);
      comp = func(x);
      comp.mount();
      expect(comp.node).to.be["instanceof"](window.Text);
      return expect(comp.node.textContent).to.equal('1');
    });
    it('should create and  render func', function() {
      var comp, x;
      x = see(0);
      comp = func(flow(x, function() {
        return {
          1: p(1),
          2: p(2),
          3: p(3)
        }[x()] || 'others';
      }));
      comp.mount();
      expect(comp.node).to.be["instanceof"](window.Text);
      expect(comp.node.textContent).to.equal('others');
      x(1);
      comp.render();
      expect(comp.node.innerHTML).to.equal('1');
      x(2);
      comp.render();
      return expect(comp.node.innerHTML).to.equal('2');
    });
    it('should create and update func with  attrs', function() {
      var comp, x;
      x = see(1);
      comp = func({
        "class": 'main',
        fakeProp: x
      }, x);
      comp.mount();
      expect(comp.node.tagName).to.equal('DIV');
      expect(comp.node.fakeProp).to.equal(1);
      expect(comp.node).to.be["instanceof"](Element);
      expect(comp.node.childNodes[0].textContent).to.equal('1');
      x(2);
      comp.render();
      expect(comp.node.fakeProp).to.equal(2);
      return expect(comp.node.childNodes[0].textContent).to.equal('2');
    });
    it('should process tag with function', function() {
      var comp;
      comp = p(txt(function() {
        return 1;
      }));
      expect(comp.children[0]).to.be["instanceof"](Text);
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    return it('should create and update func with a closure variable', function() {
      var comp, x;
      x = see(1);
      comp = func(function() {
        return txt(x);
      });
      comp.mount();
      expect(comp.node.textContent).to.equal('1');
      x(2);
      comp.render();
      return expect(comp.node.textContent).to.equal('2');
    });
  });
  return describe('Pick', function() {
    it('pick(host)', function() {
      var comp, host, x;
      host = {
        content: 1
      };
      comp = pick(host);
      x = 0;
      comp.onSetContent = function(value) {
        return x = 'called';
      };
      comp.mount();
      expect(comp.node.textContent).to.equal('1');
      host.content = 2;
      expect(x).to.equal('called');
      comp.render();
      return expect(comp.node.textContent).to.equal('2');
    });
    it('pick(host, "content", 1) by setContent', function() {
      var comp, host, x;
      host = {
        content: 1
      };
      comp = pick(host);
      x = 0;
      comp.onSetContent = function(value) {
        return x = 'called';
      };
      comp.mount();
      expect(comp.node.textContent).to.equal('1');
      comp.setContent(2);
      expect(x).to.equal('called');
      comp.render();
      return expect(comp.node.textContent).to.equal('2');
    });
    it('pick(host, "activeContent", 1)', function() {
      var comp, host, x;
      host = {};
      comp = pick(host, "activeContent", 1);
      x = 0;
      comp.onSetContent = function(value) {
        return x = 'called';
      };
      comp.mount();
      expect(comp.node.textContent).to.equal('1');
      host.activeContent = 2;
      expect(x).to.equal('called');
      comp.render();
      return expect(comp.node.textContent).to.equal('2');
    });
    return it('pick(host, "activeContent", 1) by setContent', function() {
      var comp, host, x;
      host = {};
      comp = pick(host, "activeContent", 1);
      x = 0;
      comp.onSetContent = function(value) {
        return x = 'called';
      };
      comp.mount();
      expect(comp.node.textContent).to.equal('1');
      comp.setContent(2);
      expect(x).to.equal('called');
      comp.render();
      return expect(comp.node.textContent).to.equal('2');
    });
  });
});
