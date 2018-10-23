var Component, List, Tag, Text, a, bindings, button, classFn, ddescribe, div, duplex, expect, flow, func, idescribe, if_, iit, input, li, list, ndescribe, newDemoNode, nit, p, span, styleFrom, text, txt;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({newDemoNode} = require('./helper'));

({bindings, duplex, flow, classFn, styleFrom, Tag, Text, List, Component, list, func, if_, txt, a, p, span, text, li, div, button, input} = dc);

describe("test-component", function() {
  afterEach(function() {
    return dc.reset();
  });
  describe('construct component', function() {
    it('component shoud have children', function() {
      var comp;
      comp = p({}, [1, 2]);
      return expect(comp.children.length).to.equal(2);
    });
    it('should construct component', function() {
      var d, p1;
      p1 = new Tag('p', {}, []);
      d = new Tag('div', {}, [p1]);
      return expect(d.children[0]).to.equal(p1);
    });
    it('tag shoud have children 1', function() {
      var comp;
      comp = new Tag('span', {}, [new Text('adf')]);
      return expect(comp.children[0].text).to.equal('adf');
    });
    return it('tag shoud have children 2', function() {
      var comp, span1;
      span1 = new Tag('span', {}, [new Text('adf')]);
      comp = new Tag('div', {
        className: classFn('some class'),
        style: styleFrom("width:1px;")
      }, [span1]);
      return expect(comp.children[0]).to.equal(span1);
    });
  });
  describe('component.create', function() {
    it('should create tag', function() {
      var comp;
      comp = p();
      comp.mount();
      expect(comp.node.tagName).to.equal('P');
      return expect(comp.node.innerHTML).to.equal('');
    });
    it('should mount tag 1', function() {
      var comp;
      comp = new Tag('div', {}, []);
      comp.mount();
      return expect(comp.node.tagName).to.equal('DIV');
    });
    it('should correctly create TextNode with 0 as content', function() {
      var comp;
      comp = txt(0);
      comp.mount();
      return expect(comp.node.textContent).to.equal('0');
    });
    it('should correctly create tag with 0 as content', function() {
      var comp;
      comp = p(0);
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('0');
    });
    it('should mount Text with flow value', function() {
      var a_, b_, comp;
      ({a_, b_} = bindings({
        a: 1,
        b: 2
      }));
      comp = txt(flow.add(a_, b_));
      comp.mount('#demo');
      return expect(comp.node.textContent).to.equal('3', 'mount');
    });
    it('should not run event hanlder while creating tag', function() {
      var comp, spy;
      spy = sinon.spy();
      comp = p({
        onclick: spy
      });
      comp.mount();
      expect(spy.called).to.equal(false);
      comp.node.onclick({
        type: 'click'
      });
      return expect(spy.called).to.equal(true);
    });
    it('should process event name without on', function() {
      var comp, spy;
      spy = sinon.spy();
      comp = p({
        onclick: spy
      });
      comp.mount();
      expect(spy.called).to.equal(false);
      comp.node.onclick({
        type: 'click'
      });
      return expect(spy.called).to.equal(true);
    });
    it('should not run event hanlder while rendering tag', function() {
      var comp, spy;
      spy = sinon.spy();
      comp = p({
        onclick: spy
      });
      comp.mount();
      expect(spy.called).to.equal(false);
      comp.node.onclick({
        type: 'click'
      });
      return expect(spy.called).to.equal(true);
    });
    it('should not run event hanlder while rendering button tag', function() {
      var comp, spy;
      spy = sinon.spy();
      comp = button({
        id: "search-ok",
        type: "submit",
        onclick: spy
      });
      comp.mount();
      expect(spy.called).to.equal(false);
      comp.node.onclick({
        type: 'click'
      });
      return expect(spy.called).to.equal(true);
    });
    it('should not run event hanlder while rendering div > button tag', function() {
      var comp, spy;
      spy = sinon.spy();
      comp = div(button({
        id: "search-ok",
        type: "submit",
        onclick: spy
      }));
      comp.mount();
      expect(spy.called).to.equal(false);
      comp.children[0].node.onclick({
        type: 'click'
      });
      return expect(spy.called).to.equal(true);
    });
    it('should create tag with attribute', function() {
      var comp, elm;
      comp = p({
        className: 'some class',
        style: "width:1px;"
      }, []);
      comp.mount();
      elm = comp.node;
      expect(elm.className).to.equal('some class');
      return expect(elm.getAttribute('className')).to.equal(null);
    });
    it('should process function value of text', function() {
      var a_, comp, elm;
      ({a_} = bindings({
        a: 1
      }));
      comp = text(a_);
      elm = comp.mount();
      elm = comp.node;
      return expect(elm.value).to.equal('1');
    });
    it('component shoud have children 2', function() {
      var comp;
      comp = span('adf');
      return expect(comp.children[0].text).to.equal('adf');
    });
    it('should create tag with children', function() {
      var comp, span1;
      comp = p({
        className: 'some class',
        style: "width:1px;"
      }, span1 = span(['adf']));
      expect(comp.children[0]).to.equal(span1);
      comp.mount();
      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
    });
    it('should mount tag 2', function() {
      var comp, elm;
      comp = p({
        className: 'some class',
        style: "width:1px;"
      }, [span(['adf'])]);
      elm = comp.mount('#demo');
      expect(comp.parentNode.id).to.equal('demo');
      return expect(comp.node.parentNode.id).to.equal('demo');
    });
    it('should mount tag with undefined as child', function() {
      var comp;
      comp = p({
        className: 'some class',
        style: "width:1px;"
      }, span(['adf']), txt(function() {}));
      comp.mount('#demo');
      expect(comp.parentNode.id).to.equal('demo');
      return expect(comp.node.parentNode.id).to.equal('demo');
    });
    return it('should mount list with undefined as child', function() {
      var comp, elm;
      comp = list(span(['adf']), txt(function() {
        return void 0;
      }));
      elm = comp.mount('#demo');
      expect(comp.parentNode.id).to.equal('demo');
      return expect(comp.node[0].parentNode.id).to.equal('demo');
    });
  });
  return describe('component update', function() {
    it('should render tag 1', function() {
      var comp, count;
      count = 1;
      comp = new Tag('p', {}, [
        new Text(function() {
          return count;
        })
      ]);
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      ++count;
      comp.render();
      expect(comp.node.innerHTML).to.equal('2', 'update 2');
      ++count;
      comp.render();
      expect(comp.node.innerHTML).to.equal('3', 'update 3');
      comp.tagName = 'div';
      comp.render();
      return expect(comp.node.innerHTML).to.equal('3', 'update 4');
    });
    it('should update bidirectional bind', function() {
      var a$, comp;
      ({a$} = bindings({
        a: 1
      }));
      comp = new Tag('input', {
        value: a$
      }, []);
      comp.mount();
      return expect(comp.node.value).to.equal("1");
    });
    it('should render tag 2', function() {
      var comp, count;
      count = 1;
      comp = p(txt(function() {
        return count;
      }));
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      ++count;
      comp.render();
      expect(comp.node.innerHTML).to.equal('2');
      ++count;
      comp.render();
      return expect(comp.node.innerHTML).to.equal('3');
    });
    it('should process text with bind', function() {
      var a_, b_, comp;
      ({a_, b_} = bindings({
        a: 1,
        b: 2
      }));
      comp = p(txt(flow.add(a_, b_)));
      comp.mount('#demo');
      expect(comp.node.innerHTML).to.equal('3', 'mount');
      a_(3);
      b_(4);
      expect(a_()).to.equal(3, 'a_');
      expect(b_()).to.equal(4, 'b_');
      comp.render();
      return expect(comp.node.innerHTML).to.equal('7', 'update');
    });
    it('should process bidirectional bind', function() {
      var a$, comp;
      ({a$} = bindings({
        a: 1
      }));
      comp = text(a$);
      comp.mount('#demo');
      expect(comp.node.value).to.equal('1');
      comp.node.value = '2';
      comp.node.onchange({
        type: 'change'
      });
      return expect(a$()).to.equal('2');
    });
    it('should render div(2) component', function() {
      var comp;
      comp = div(2);
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('2');
    });
    it('should execute component.unmount', function() {
      var comp;
      comp = div(2);
      comp.mount();
      return comp.unmount();
    });
    it('should execute component.remove', function() {
      var comp;
      comp = div(1);
      comp.mount(newDemoNode('replace-demo3'));
      comp.unmount();
      return expect(document.getElementById('replace-demo3').innerHTML).to.equal('');
    });
    it('should execute remove child component', function() {
      var comp1, comp3;
      comp1 = div(comp3 = div(3));
      comp1.mount(newDemoNode('replace-demo4'));
      comp3.unmount();
      return expect(document.getElementById('replace-demo4').innerHTML).to.equal('<div></div>');
    });
    it('should execute component.replace', function() {
      var comp1, comp2;
      comp1 = div(1);
      comp1.mount(newDemoNode('replace-demo'));
      comp2 = div(2);
      comp2.replace(comp1);
      dc.render(true);
      return expect(document.getElementById('replace-demo').innerHTML).to.equal('<div>2</div>');
    });
    it('should execute replace child component', function() {
      var comp1, comp2, comp3;
      comp1 = div(comp3 = div(3));
      comp1.mount(newDemoNode('replace-demo2'));
      expect(document.getElementById('replace-demo2').innerHTML).to.equal('<div><div>3</div></div>');
      comp2 = div(2);
      comp2.replace(comp3);
      dc.render(true);
      return expect(document.getElementById('replace-demo2').innerHTML).to.equal('<div><div>2</div></div>');
    });
    return it('p(->12) ', function() {
      var comp;
      comp = p(function() {
        return 12;
      });
      comp.mount();
      expect(comp.node.innerHTML).to.equal('12');
      comp.render();
      expect(comp.node.innerHTML).to.equal('12');
      comp.render();
      return expect(comp.node.innerHTML).to.equal('12');
    });
  });
});
