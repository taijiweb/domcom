var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, html, idescribe, iit, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

newDemoNode = require('./helper').newDemoNode;

bindings = dc.bindings, see = dc.see, Tag = dc.Tag, Text = dc.Text, List = dc.List, txt = dc.txt, list = dc.list, p = dc.p, div = dc.div, Html = dc.Html, html = dc.html, classFn = dc.classFn, styleFrom = dc.styleFrom, Nothing = dc.Nothing;

a_ = bindings({
  a: 1,
  b: 2
}).a_;

describe("test base component", function() {
  afterEach(function() {
    return dc.reset();
  });
  describe('update baseComponent', function() {
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
    it('should get baseComponent of two tags', function() {
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
    it('should mount pre with property', function() {
      var comp;
      comp = new Tag('pre', {
        attr_space: ''
      }, []);
      comp.mount();
      expect(comp.node.tagName).to.equal('PRE');
      return expect(comp.node.getAttribute('space')).to.equal('');
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
    it('should process Html.node.component', function() {
      var comp, demoNode, str;
      str = see('');
      comp = html(str);
      comp.mount(demoNode = newDemoNode());
      expect(demoNode.innerHTML).to.equal('<div></div>');
      return expect(comp.node.component).to.equal(comp);
    });
    it('should mount html component', function() {
      var comp, demoNode, s;
      comp = new Html(s = '<div>1</div><p>2</p>');
      comp.mount(demoNode = newDemoNode());
      return expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p></div>');
    });
    it('should mount html component with transform', function() {
      var comp, demoNode, s;
      comp = new Html(s = '<div>1</div><p>2</p>', function(text) {
        return text + 'a';
      });
      comp.mount(demoNode = newDemoNode());
      return expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p>a</div>');
    });
    it('should mount html component with reactive function', function() {
      var comp, demoNode, str;
      str = see('<div>1</div><p>2</p>');
      comp = new Html(str, function(text) {
        return text + 'a';
      });
      comp.mount(demoNode = newDemoNode());
      expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p>a</div>');
      str('x');
      comp.render();
      expect(demoNode.innerHTML).to.equal('<div>xa</div>', 'update 1');
      comp.render();
      return expect(demoNode.innerHTML).to.equal('<div>xa</div>', 'update 2');
    });
    it('should Html.bind', function() {
      var comp, demoNode, str, x;
      str = see('');
      comp = html(str);
      comp.mount(demoNode = newDemoNode());
      x = 1;
      comp.bind('click', function() {
        return x = 2;
      });
      comp.node.onclick({
        type: 'click'
      });
      return expect(x).to.equal(2);
    });
    return it('should Html.text setter', function() {
      var comp, str;
      str = see('');
      comp = html(str);
      comp.mount();
      comp.text = 'x';
      comp.render();
      return expect(comp.node.innerHTML).to.equal('x');
    });
  });
});
