var Component, List, Tag, Text, TransformComponent, a, accordion, accordionGroup, all, bind, case_, div, each, every, expect, func, idescribe, if_, iit, isComponent, list, nItems, ndescribe, newDemoNode, nit, p, pour, see, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

newDemoNode = require('./helper').newDemoNode;

isComponent = dc.isComponent, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, List = dc.List, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div, all = dc.all, every = dc.every, nItems = dc.nItems, bind = dc.bind, pour = dc.pour, see = dc.see;

describe('list, each', function() {
  describe('List', function() {
    it('all of item in list should be  component', function() {
      var comp;
      comp = list([1, 2]);
      return expect(!!isComponent(comp.children[0])).to.equal(true);
    });
    it('should create list component', function() {
      var comp;
      comp = list([span(['adf'])]);
      comp.mount();
      return expect(comp.node[0].tagName).to.equal('SPAN');
    });
    it('component list should have length', function() {
      var lst;
      lst = list([1, 2]);
      return expect(lst.children.length).to.equal(2);
    });
    it('list can be constructructed  from mulitple argumnents', function() {
      var lst;
      lst = list(1, 2);
      return expect(lst.children.length).to.equal(2);
    });
    it('should create list', function() {
      var lst;
      lst = list(1, 2);
      lst.mount();
      expect(lst.node[0].textContent).to.equal('1');
      return expect(lst.node[1].textContent).to.equal('2');
    });
    it('should create list with attrs', function() {
      var comp, x;
      x = 2;
      comp = list({
        "class": 'main',
        fakeProp: function() {
          return x;
        }
      }, 1, txt(function() {
        return x;
      }));
      comp.mount();
      expect(comp.node.tagName).to.equal('DIV');
      expect(comp.node.childNodes[0].textContent).to.equal('1');
      expect(comp.node.childNodes[1].textContent).to.equal('2');
      x = 3;
      comp.update();
      expect(comp.node.fakeProp).to.equal(3);
      return expect(comp.node.childNodes[1].textContent).to.equal('3', 'textContent update');
    });
    it('list(txt(->12))', function() {
      var comp;
      comp = list(txt(function() {
        return 12;
      }));
      comp.mount();
      return expect(comp.node.textContent).to.equal('12');
    });
    it('list setChildren after mounting', function() {
      var comp;
      comp = new List([txt(1)]);
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      return expect(function() {
        var t2;
        return comp.setChildren(1, t2 = txt(2));
      }).not.to["throw"]();
    });
    it('list setChildren: similar to splitter', function() {
      var comp, t2, t3;
      comp = new List([txt(1), t3 = txt(3)]);
      comp.setChildren(1, t2 = txt(2), t3);
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      expect(comp.node[1].textContent).to.equal('2');
      return expect(comp.node[2].textContent).to.equal('3');
    });
    it('list(p(txt(->12))) ', function() {
      var comp;
      comp = list(p(txt(function() {
        return 12;
      })));
      comp.mount();
      comp.update();
      return expect(comp.node.innerHTML).to.equal('12');
    });
    it('list(p(->12)) ', function() {
      var comp;
      comp = list(p(function() {
        return 12;
      }));
      comp.mount();
      comp.update();
      return expect(comp.node.innerHTML).to.equal('12');
    });
    return it('list(txt(1)) ', function() {
      var comp, demoNode;
      comp = new List([txt(1)]);
      comp.mount(demoNode = newDemoNode('list'));
      comp.update();
      comp.setLength(0);
      comp.update();
      return expect(demoNode.innerHTML).to.equal('');
    });
  });
  describe('every, all, nItems', function() {
    it('every ', function() {
      var comp, demoNode;
      comp = every([1, 2], function(item) {
        return item;
      });
      comp.mount(demoNode = newDemoNode('list'));
      comp.update();
      return expect(comp.node.length).to.equal(2);
    });
    it('all ', function() {
      var comp, demoNode;
      comp = all({
        a: 1,
        b: 2
      }, function(key, value) {
        return list(key, value);
      });
      comp.mount(demoNode = newDemoNode('list'));
      comp.update();
      return expect(comp.node.length).to.equal(2);
    });
    return it('nItems ', function() {
      var comp, demoNode;
      comp = nItems(2, function(index) {
        return index;
      });
      comp.mount(demoNode = newDemoNode('list'));
      comp.update();
      return expect(comp.node.length).to.equal(2);
    });
  });
  return describe('Each', function() {
    it('should create empty each component', function() {
      var comp, lst;
      comp = each(lst = [], function(item, i) {
        return p(item);
      });
      comp.mount();
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node.length).to.equal(0);
      comp.update();
      return expect(comp.node.length).to.equal(0);
    });
    it('should create each component with single item', function() {
      var comp, lst;
      comp = each(lst = [1], function(item, i) {
        return p(item);
      });
      comp.mount();
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node.length).to.equal(1);
      expect(comp.node[0].innerHTML).to.equal('1');
      comp.update();
      expect(comp.node.length).to.equal(1);
      return expect(comp.node[0].innerHTML).to.equal('1');
    });
    it('should set childrenNextNode correctly', function() {
      var comp, each1, lst;
      lst = [1, 2];
      comp = list((each1 = each(lst, function(item) {
        return p(item);
      })), 'some other thing');
      comp.mount();
      expect(each1.listComponent.childrenNextNode).to.equal(comp.node[1]);
      lst.push(3);
      comp.render();
      return expect(each1.listComponent.children[2].nextNode).to.equal(comp.node[1]);
    });
    it('should create each component with two item', function() {
      var comp, lst;
      comp = each(lst = ['each', 'simple'], function(item, i) {
        return p(item);
      });
      comp.mount();
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node[0]).to.be["instanceof"](Element);
      return expect(comp.node[1].innerHTML).to.equal('simple');
    });
    it('should mount and render each component', function() {
      var comp, demoNode, lst;
      document.getElementById('demo').innerHTML = '';
      comp = each(lst = ['each', 'simple'], function(item, i) {
        return p(item);
      });
      comp.mount(demoNode = newDemoNode("each"));
      expect(comp.node[0].innerHTML).to.equal('each');
      expect(comp.node[1].innerHTML).to.equal('simple');
      lst.setItem(0, 3);
      comp.update();
      expect(comp.node[0].innerHTML).to.equal('3', 'update node 0');
      lst.setItem(1, 4);
      comp.update();
      expect(comp.node[1].innerHTML).to.equal('4', 'update node 1');
      expect(demoNode.innerHTML).to.equal('<p>3</p><p>4</p>', 'update innerHTML');
      lst.setItem(2, 5);
      comp.update();
      expect(comp.node[2].innerHTML).to.equal('5', 'update list[2] = 5');
      lst.setLength(0);
      comp.update();
      expect(comp.listComponent.children.length).to.equal(0, 'comp.listComponent.children.length = 0');
      return expect(comp.node.length).to.equal(0, 'node.length');
    });
    it('should process binding on item', function() {
      var comp, lst;
      document.getElementById('demo').innerHTML = '';
      comp = each(lst = [
        {
          text: 'a'
        }, {
          text: 'b'
        }
      ], (function(item, i) {
        return p(txt(bind(item, 'text')));
      }));
      comp.mount("#demo");
      expect(comp.node[0].textContent).to.equal('a');
      expect(comp.node[1].textContent).to.equal('b');
      lst[0].text = 'c';
      comp.update();
      expect(comp.node[0].textContent).to.equal('c', 'update c');
      lst[1].text = 'd';
      comp.update();
      expect(comp.node[1].textContent).to.equal('d', 'update d');
      lst.setItem(2, {
        text: 'e'
      });
      comp.update();
      expect(comp.node[2].textContent).to.equal('e');
      lst.setLength(0);
      comp.update();
      return expect(comp.node.length).to.equal(0);
    });
    it('should process items in template function', function() {
      var comp, lst;
      comp = each(lst = ['a', 'b'], (function(item, i, items, eachComponent) {
        return p(txt(function() {
          return items[i];
        }));
      }));
      comp.mount();
      lst.setItem(0, 'c');
      comp.update();
      return expect(comp.node[0].textContent).to.equal('c');
    });
    it('should process tag with each', function() {
      var comp, each1, text1, x;
      x = 1;
      text1 = null;
      comp = new Tag('div', {}, [
        each1 = each([1], pour(function(item) {
          return text1 = txt(x);
        }))
      ]);
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      x = 2;
      comp.update();
      expect(text1.node.textContent).to.equal('2', 'update, 2');
      expect(each1.node[0].textContent).to.equal('2');
      return expect(comp.node.innerHTML).to.equal('2');
    });
    it('should create and update renew function as list of Each', function() {
      var comp, x;
      x = 1;
      comp = each((function() {
        return [x];
      }), function(item) {
        return txt(item);
      });
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      x = 2;
      comp.update();
      return expect(comp.node[0].textContent).to.equal('2', 'update 2');
    });
    it('should create and update deeper embedded each', function() {
      var comp, each1, span1, x;
      x = 1;
      comp = div({}, span1 = new Tag('span', {}, [
        each1 = each((function() {
          return [x];
        }), function(item) {
          return txt(item);
        })
      ]));
      comp.mount();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x = 2;
      comp.update();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      return expect(comp.node.innerHTML).to.equal('<span>2</span>');
    });
    it('should create and update embedded each in 3 layer', function() {
      var comp, each1, span1, x;
      x = see(1);
      comp = div({}, div({}, span1 = new Tag('span', {}, [
        each1 = each([1], function(item) {
          return txt(x);
        })
      ])));
      comp.mount();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x(2);
      comp.update();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
    });
    it('should create and update embedded each in 3  layer', function() {
      var comp, each1, span1, x;
      x = 1;
      comp = div({}, div({}, span1 = new Tag('span', {}, [
        each1 = each((function() {
          return [x];
        }), function(item) {
          return txt(item);
        })
      ])));
      comp.mount();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x = 2;
      comp.update();
      expect(each1.listComponent.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
    });
    it('should process each under each', function() {
      var comp, each1, each2, x;
      x = 1;
      each2 = null;
      comp = div({}, each1 = each([1], function() {
        return each2 = each((function() {
          return [x];
        }), function(item) {
          return item;
        });
      }));
      comp.mount();
      expect(each1.listComponent.parentNode).to.equal(comp.node);
      expect(each1.node[0][0].textContent).to.equal('1');
      expect(each2.node[0].textContent).to.equal('1');
      x = 2;
      comp.update();
      expect(each1.listComponent.parentNode).to.equal(comp.node);
      expect(each2.node[0].textContent).to.equal('2');
      return expect(comp.node.innerHTML).to.equal('2');
    });
    it('should mount and update each', function() {
      var comp;
      comp = new Tag('span', {}, [
        each([1], function(item) {
          return txt(1);
        })
      ]);
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      comp.update();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    it('should push and setLength of each', function() {
      var comp, lst;
      lst = [1, 2, 3, 4, 5, 6];
      comp = each(lst, function(item) {
        return txt(item);
      });
      comp.mount();
      lst.push(7);
      comp.update();
      expect(comp.node.length).to.equal(7, 'push 7');
      lst.setLength(4);
      comp.update();
      return expect(comp.node.length).to.equal(4, 'setLength 4');
    });
    it('should update each with component as the item of list 1', function() {
      var comp, s;
      comp = each([txt(1)], function(item) {
        return item;
      });
      comp.mount();
      expect(comp.node[0].textContent).to.equal(s = '1');
      comp.update();
      return expect(comp.node[0].textContent).to.equal('1');
    });
    it('should update each with component as the item of list 2', function() {
      var comp, s;
      comp = div(each([txt(1)], function(item) {
        return item;
      }));
      comp.mount();
      expect(comp.node.innerHTML).to.equal(s = '1');
      comp.update();
      return expect(comp.node.innerHTML).to.equal('1');
    });
    it('should update each with component as the item of list 3', function() {
      var comp, s;
      comp = div(div(each([txt(1)], function(item) {
        return item;
      })));
      comp.mount();
      expect(comp.node.innerHTML).to.equal(s = '<div>1</div>');
      comp.update();
      return expect(comp.node.innerHTML).to.equal('<div>1</div>');
    });
    return it('should always attach and detach each in multiple iteration', function() {
      var comp, lst4, showingEach$;
      showingEach$ = see(true);
      lst4 = [1, 2];
      comp = if_(showingEach$, each(lst4, function(item) {
        return div(item);
      }));
      comp.mount();
      showingEach$(false);
      comp.render();
      showingEach$(true);
      comp.render();
      expect(comp.node.parentNode).to.equal(document.body);
      showingEach$(false);
      comp.render();
      return expect(comp.node.parentNode).not.to.equal(document.body);
    });
  });
});
