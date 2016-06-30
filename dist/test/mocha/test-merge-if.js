var Component, If, List, Tag, Text, a, div, expect, flow, func, idescribe, if_, iit, list, mergeIf, ndescribe, newDemoNode, nit, p, see, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

newDemoNode = require('./helper').newDemoNode;

see = dc.see, flow = dc.flow, Component = dc.Component, Tag = dc.Tag, Text = dc.Text, List = dc.List, If = dc.If, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, mergeIf = dc.mergeIf, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

describe('domcom/test-merge-if', function() {
  afterEach(function() {
    return dc.reset();
  });
  it('should construct mergeIf(x, t1, t2)', function() {
    var comp, t1, t2, x;
    x = see(0);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, t1, t2);
    expect(comp.isText).to.equal(true);
    comp.mount();
    expect(comp.node.textContent).to.equal('2');
    x(1);
    comp.render();
    return expect(comp.node.textContent).to.equal('1');
  });
  it('should render mergeIf(x, list(t1, t2), list(t2, t1))', function() {
    var comp, demoNode, t1, t2, x;
    x = see(0);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, list(t1, t2), list(t2, t1));
    expect(comp.isList).to.equal(true);
    comp.mount(demoNode = newDemoNode('if-ref'));
    expect(comp.node[0].textContent).to.equal('2', 'mount');
    expect(demoNode.innerHTML).to.equal('21', 'mount');
    x(1);
    comp.render();
    expect(comp.node[0].textContent).to.equal('1', 'update x 1');
    return expect(demoNode.innerHTML).to.equal('12', 'update');
  });
  it('should render if_(x, list(t2, t1), new List([t1]))', function() {
    var comp, demoNode, lst, t1, t2, x;
    x = see(1);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, lst = list(t2, t1), new List([t1]));
    expect(comp.isList).to.equal(true);
    comp.mount(demoNode = newDemoNode('if-ref'));
    expect(demoNode.innerHTML).to.equal('21', 'mount');
    x(0);
    comp.render();
    dc.clean();
    return expect(demoNode.innerHTML).to.equal('1');
  });
  it('should render mergeIf(x, new List([t1]), list(t2, t1))', function() {
    var comp, demoNode, lst, t1, t2, x;
    x = see(1);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, new List([t1]), lst = list(t2, t1));
    expect(comp.isList).to.equal(true);
    comp.mount(demoNode = newDemoNode('if-ref'));
    expect(demoNode.innerHTML).to.equal('1', 'mount');
    x(0);
    comp.render();
    return expect(demoNode.innerHTML).to.equal('21');
  });
  it('should render mergeIf(x, p(t1), p(t2))', function() {
    var comp, demoNode, t1, t2, x;
    x = see(0);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, p(t1), p(t2));
    expect(comp.isTag).to.equal(true);
    comp.mount(demoNode = newDemoNode('if-ref'));
    expect(demoNode.innerHTML).to.equal('<p>2</p>', 'mount');
    x(1);
    comp.render();
    dc.clean();
    return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
  });
  it('should also render mergeIf(x, p(t1), p(t2, t1))', function() {
    var comp, demoNode, t1, t2, x;
    x = see(0);
    t1 = txt(1);
    t2 = txt(2);
    comp = mergeIf(x, p(t1), p(t2, t1));
    expect(comp.isTag).to.equal(true);
    comp.mount(demoNode = newDemoNode('if-ref'));
    expect(demoNode.innerHTML).to.equal('<p>21</p>', 'mount');
    x(1);
    comp.render();
    dc.clean();
    expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
    x(0);
    comp.render();
    dc.clean();
    expect(demoNode.innerHTML).to.equal('<p>21</p>', 'update x 0');
    x(1);
    comp.render();
    dc.clean();
    return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
  });
  it('should render mergeIf(x, p(t1), div(t2))', function() {
    var comp, t1, x;
    x = see(0);
    t1 = txt(1);
    comp = mergeIf(x, p(t1), div(t1));
    return expect(comp instanceof If).to.equal(true);
  });
  it('should render mergeIf(x, div(1), div(2))', function() {
    var comp, x;
    x = see(0);
    comp = mergeIf(x, div(1), div(2));
    comp.mount();
    expect(comp.isTag).to.equal(true);
    expect(comp.children[0].isText).to.equal(true);
    expect(comp.node.tagName).to.equal('DIV', 'tagName');
    expect(comp.node.innerHTML).to.equal('2', 'mount');
    x(1);
    comp.render();
    return expect(comp.node.innerHTML).to.equal('1', 'first update');
  });
  it('should render mergeIf(x, div(1), div(p(2)))', function() {
    var comp, x;
    x = see(0);
    comp = mergeIf(x, div(1), div(p(2)));
    comp.mount();
    expect(comp.isTag).to.equal(true);
    expect(comp.children[0] instanceof If).to.equal(true);
    expect(comp.node.tagName).to.equal('DIV', 'tagName');
    return expect(comp.node.innerHTML).to.equal('<p>2</p>', 'mount');
  });
  it('should render mergeIf(x, div({class}, 1), div({class}, 2))', function() {
    var comp, x;
    x = see(0);
    comp = mergeIf(x, div({
      "class": 'a'
    }, 1), div({
      "class": 'b'
    }, 2));
    comp.mount();
    expect(comp.isTag).to.equal(true);
    expect(comp.node.className).to.equal('b');
    x(1);
    comp.render();
    return expect(comp.node.className).to.equal('a');
  });
  it('should render mergeIf(x, div({a:1}, 1), div({b:2}, 2))', function() {
    var comp, x;
    x = see(0);
    comp = mergeIf(x, div({
      a: 1
    }, 1), div({
      b: 2
    }, 2));
    comp.mount();
    expect(comp.isTag).to.equal(true);
    expect(comp.node.a).to.equal('');
    expect(comp.node.b).to.equal(2);
    x(1);
    comp.render();
    expect(comp.node.a).to.equal(1);
    return expect(comp.node.b).to.equal('', 'x 1');
  });
  it('should render mergeIf(x, div({onclick}, 1), div({onclick}, 2))', function() {
    var comp, x;
    x = see(0);
    a = 0;
    comp = mergeIf(x, div({
      onclick: function() {
        return a = 1;
      }
    }, 1), div({
      onclick: function() {
        return a = 2;
      }
    }, 2));
    comp.mount();
    comp.node.onclick({
      type: 'click'
    });
    expect(a).to.equal(2, 'first click');
    x(1);
    comp.render();
    comp.node.onclick({
      type: 'click'
    });
    return expect(a).to.equal(1, 'second click');
  });
  it('should NOT merge If(0, div({onclick}, 1), div({onclick}, 2), true, false, true)', function() {
    var comp;
    a = 0;
    comp = new If(0, div({
      onclick: function() {
        return a = 1;
      }
    }, 1), div({
      onclick: function() {
        return a = 2;
      }
    }, 2), true, false, true);
    comp.mount();
    comp.node.onclick({
      type: 'click'
    });
    expect(a).to.equal(2, 'first click');
    comp.test = 1;
    comp.render();
    comp.node.onclick({
      type: 'click'
    });
    return expect(a).to.equal(1, 'second click');
  });
  return it('should render mergeIf(x, div({style}, 1), div({style}, 2))', function() {
    var comp, x;
    x = see(0);
    comp = mergeIf(x, div({
      style: {
        width: '100px'
      }
    }, 1), div({
      style: {
        width: '200px'
      }
    }, 2));
    comp.mount();
    expect(comp.node.style.width).to.equal('200px');
    x(1);
    comp.render();
    return expect(comp.node.style.width).to.equal('100px');
  });
});
