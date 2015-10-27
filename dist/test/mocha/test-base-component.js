
/**test-virtual-tree
 */
var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, html, idescribe, iit, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt, _ref;

_ref = require('./helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

bindings = dc.bindings, see = dc.see, Tag = dc.Tag, Text = dc.Text, List = dc.List, txt = dc.txt, list = dc.list, p = dc.p, div = dc.div, Html = dc.Html, html = dc.html, classFn = dc.classFn, styleFrom = dc.styleFrom, Nothing = dc.Nothing;

a_ = bindings({
  a: 1,
  b: 2
}).a_;

describe("test base component", function() {
  describe('getBaseComponent', function() {
    it('should get baseComponent of List', function() {
      var comp;
      comp = list([1, 2]);
      return expect(comp.baseComponent).to.equal(comp);
    });
    return it('should have correct children', function() {
      var comp;
      comp = p(0);
      return expect(comp.children[0].text).to.equal(0);
    });
  });
  describe('process get baseComponent of Tag', function() {
    it('should getBaseComponent of two tags', function() {
      var d, p1;
      p1 = new Tag('p', {}, []);
      d = new Tag('div', {}, [p1]);
      expect(d.baseComponent).to.equal(d);
      expect(d.children[0]).to.be["instanceof"](Tag);
      d.mount();
      return expect(d.baseComponent.baseComponent).to.equal(d);
    });
    return it('should text.valid to be true', function() {
      var comp;
      comp = txt(1);
      comp.mount();
      return expect(!!comp.valid).to.equal(true);
    });
  });
  describe('process creatDom', function() {
    it('should creatDom of p(1)', function() {
      var comp;
      comp = p(1);
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    it('should creatDom of p(->1)', function() {
      var comp;
      comp = p(function() {
        return 1;
      });
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    it('should creatDom of p(p(p(t=txt(->1))))', function() {
      var comp, t;
      comp = p(p(p(t = txt(function() {
        return 1;
      }))));
      comp.mount();
      return expect(comp.node.innerHTML).to.equal('<p><p>1</p></p>');
    });
    it('should mount Text with text is 0', function() {
      var n;
      n = new Text(0);
      n.mount();
      return expect(n.node.textContent).to.equal('0');
    });
    it('should mount tag', function() {
      p = new Tag('p', {}, []);
      p.mount();
      return expect(p.node.tagName).to.equal('P');
    });
    it('should mount  tag with attribute', function() {
      p = new Tag('p', {
        className: classFn('some class'),
        style: styleFrom("width:1px;")
      }, []);
      p.mount();
      expect(p.node.className).to.equal('some class');
      return expect(p.node.getAttribute('className')).to.equal(null);
    });
    it('process bind as value', function() {
      var comp;
      comp = new Tag('input', {
        type: 'text',
        value: a_
      }, [new Text(a_)]);
      comp.mount();
      return expect(comp.node.value).to.equal('1');
    });
    it('tag shoud mount with multiple children ', function() {
      var comp, t1, t2, t3;
      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3)]);
      expect(comp.children.length).to.equal(3);
      comp.mount();
      return expect(comp.node.childNodes.length).to.equal(3);
    });
    it('tag shoud mount with Nothing child', function() {
      var comp, t1, t2, t3, t4;
      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3), t4 = new Nothing()]);
      expect(comp.children.length).to.equal(4);
      comp.mount();
      return expect(comp.node.childNodes.length).to.equal(3);
    });
    it('should create tag with children', function() {
      var comp;
      comp = new Tag('p', {
        className: classFn('some class'),
        style: styleFrom("width:1px;")
      }, [new Tag('span', {}, [new Text('adf')])]);
      comp.mount();
      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
    });
    it('should mount tag 2', function() {
      var comp;
      comp = new Tag('p', {
        className: classFn('some class'),
        style: styleFrom("width:1px;")
      }, [new Tag('span', {}, [new Text('adf')])]);
      comp.mount();
      return expect(comp.node.className).to.equal('some class');
    });
    it('should mount for tag with children', function() {
      var comp;
      comp = new Tag('p', {
        className: classFn('some class'),
        style: styleFrom("width:1px;")
      }, [new Tag('span', {}, [new Text('adf')]), new Text(function() {})]);
      comp.mount();
      return expect(comp.node.className).to.equal('some class');
    });
    return it('should mount list with children', function() {
      var comp;
      comp = new List([
        new Tag('span', {}, [new Text('adf')]), new Text(function() {
          return void 0;
        })
      ]);
      comp.mount();
      return expect(comp.node[0].tagName).to.equal('SPAN');
    });
  });
  return describe('process Html', function() {
    it('should mount html', function() {
      var comp, demoNode, s;
      comp = new Html(s = '<div>1</div><p>2</p>');
      comp.mount(demoNode = newDemoNode());
      return expect(demoNode.innerHTML).to.equal(s);
    });
    it('should mount html component with transform', function() {
      var comp, demoNode, s;
      comp = new Html(s = '<div>1</div><p>2</p>', function(text) {
        return text + 'a';
      });
      comp.mount(demoNode = newDemoNode());
      return expect(demoNode.innerHTML).to.equal(s + 'a');
    });
    return it('should mount html component with reative function', function() {
      var comp, demoNode, s, str;
      str = see(s = '<div>1</div><p>2</p>');
      comp = new Html(str, function(text) {
        return text + 'a';
      });
      comp.mount(demoNode = newDemoNode());
      str('x');
      comp.update();
      expect(demoNode.innerHTML).to.equal('xa');
      comp.update();
      return expect(demoNode.innerHTML).to.equal('xa');
    });
  });
});
