var Component, List, Tag, Text, TransformComponent, a, accordion, accordionGroup, bind, case_, comp, demo2Node, div, dontUnmount, each, every, expect, func, funcEach, idescribe, if_, iit, isComponent, list, ndescribe, newDemoNode, nit, p, pour, see, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

newDemoNode = require('./helper').newDemoNode;

isComponent = dc.isComponent, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, List = dc.List, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, every = dc.every, funcEach = dc.funcEach, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div, bind = dc.bind, pour = dc.pour, see = dc.see;

demo2Node = null;

comp = null;

dontUnmount = false;

describe('group component: List, each', function() {
  beforeEach(function() {
    demo2Node = document.getElementById('demo2');
    return demo2Node.innerHTML = '';
  });
  afterEach(function() {
    dc.reset();
    if (comp && comp.node && !dontUnmount) {
      return comp.unmount();
    }
  });
  describe('List', function() {
    it('all of item in list should be  component', function() {
      comp = list([1, 2]);
      return expect(isComponent(comp.children[0])).to.equal(true);
    });
    it('should create list component', function() {
      comp = list([span(['adf'])]);
      comp.mount();
      expect(comp.node[0].tagName).to.equal('SPAN');
      return comp.unmount();
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
      expect(lst.node[1].textContent).to.equal('2');
      return lst.unmount();
    });
    it('should create list with attrs', function() {
      var x;
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
      dc.update();
      expect(comp.node.fakeProp).to.equal(3);
      expect(comp.node.childNodes[1].textContent).to.equal('3', 'textContent update');
      return comp.unmount();
    });
    it('list(txt(->12))', function() {
      comp = list(txt(function() {
        return 12;
      }));
      comp.mount();
      expect(comp.node.textContent).to.equal('12');
      return comp.unmount();
    });
    it('list setChildren after mounting', function() {
      comp = new List([txt(1)]);
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      expect(function() {
        var t2;
        return comp.setChildren(1, [t2 = txt(2)]);
      }).not.to["throw"]();
      return comp.unmount();
    });
    it('list setChildren: similar to splitter', function() {
      var t2, t3;
      comp = new List([txt(1), t3 = txt(3)]);
      comp.setChildren(1, [t2 = txt(2), t3]);
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      expect(comp.node[1].textContent).to.equal('2');
      expect(comp.node[2].textContent).to.equal('3');
      return comp.unmount();
    });
    it('list(p(txt(->12))) ', function() {
      comp = list(p(txt(function() {
        return 12;
      })));
      comp.mount();
      dc.update();
      expect(comp.node.innerHTML).to.equal('12');
      return comp.unmount();
    });
    it('list(p(->12)) ', function() {
      comp = list(p(function() {
        return 12;
      }));
      comp.mount();
      dc.update();
      expect(comp.node.innerHTML).to.equal('12');
      return comp.unmount();
    });
    it('list(txt(1)) ', function() {
      var demoNode;
      comp = new List([txt(1)]);
      comp.mount(demoNode = newDemoNode('list'));
      dc.update();
      comp.setLength(0);
      dc.update();
      expect(demoNode.innerHTML).to.equal('');
      return comp.unmount();
    });
    return it('list(txt(1), txt(2), txt(3)) and move child', function() {
      var demoNode, t1, t2, t3;
      comp = list(t1 = txt(1), t2 = txt(2), t3 = txt(3));
      comp.mount(demoNode = newDemoNode('list'));
      expect(demoNode.innerHTML).to.equal('123');
      comp.removeChild(0);
      dc.update();
      expect(comp.dcidIndexMap[t1.dcid]).to.equal(void 0, 'dcid 0');
      expect(comp.dcidIndexMap[t2.dcid]).to.equal(0, 'dcid 1');
      expect(comp.dcidIndexMap[t3.dcid]).to.equal(1, 'dcid 2');
      expect(comp.children.length).to.equal(2);
      comp.pushChild(t1);
      dc.update();
      expect(demoNode.innerHTML).to.equal('231');
      return comp.unmount();
    });
  });
  describe('each of array, object', function() {
    it('simple each for array', function() {
      var demoNode;
      comp = every([1, 2], function(item) {
        return item;
      });
      comp.mount(demoNode = newDemoNode('list'));
      dc.update();
      expect(comp.node.length).to.equal(2);
      return comp.unmount();
    });
    it('all key of object 1', function() {
      var demoNode;
      comp = every({
        a: 1,
        b: 2
      }, function(value) {
        return value;
      });
      comp.mount(demoNode = newDemoNode('list'));
      dc.update();
      expect(comp.children.length).to.equal(2);
      return expect(demoNode.innerHTML).to.equal('12');
    });
    it('all key of object 2', function() {
      var demoNode;
      comp = every({}, {
        a: 1,
        b: 2
      }, function(value, key) {
        return list(key, ':', value);
      });
      comp.mount(demoNode = newDemoNode('list'));
      dc.update();
      expect(comp.children.length).to.equal(2);
      return expect(comp.node.innerHTML).to.equal('a:1b:2');
    });
    return it('all key of object 3', function() {
      var demoNode, options;
      options = {
        itemFunc: function(value, key) {
          return list(key, ':', value);
        },
        separatorFunc: function() {
          return ', ';
        }
      };
      comp = every({}, {
        a: 1,
        b: 2
      }, options);
      comp.mount(demoNode = newDemoNode('list'));
      dc.update();
      expect(comp.children.length).to.equal(2);
      return expect(comp.node.innerHTML).to.equal('a:1, b:2');
    });
  });
  describe('each', function() {
    it('should create empty each component', function() {
      var lst;
      demo2Node = document.getElementById('demo2');
      demo2Node.innerHTML = '';
      comp = each(lst = [], function(item, i) {
        return p(item);
      });
      comp.mount(demo2Node);
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node.length).to.equal(0);
      dc.update();
      expect(comp.node.length).to.equal(0);
      return comp.unmount();
    });
    it('should create each component with single item', function() {
      var lst;
      comp = each(lst = [1], function(item, i) {
        return p(item);
      });
      comp.mount();
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node.length).to.equal(1);
      expect(comp.node[0].innerHTML).to.equal('1');
      dc.update();
      expect(comp.node.length).to.equal(1);
      expect(comp.node[0].innerHTML).to.equal('1');
      return comp.unmount();
    });
    it('should set children.nextNode correctly', function() {
      var each1, lst;
      demo2Node = document.getElementById('demo2');
      demo2Node.innerHTML = '';
      lst = [1, 2];
      comp = list((each1 = each(lst, function(item) {
        return p(item);
      })), 'some other thing');
      comp.mount(demo2Node);
      expect(each1.nextNode).to.equal(comp.node[1]);
      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p>some other thing');
      lst.push(3);
      dc.update();
      expect(each1.children[2].node).to.equal(each1.node[2]);
      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p><p>3</p>some other thing');
      comp.unmount();
      return expect(demo2Node.innerHTML).to.equal('');
    });
    it('should create each component with two item', function() {
      var lst;
      comp = each(lst = ['each', 'simple'], function(item, i) {
        return p(item);
      });
      comp.mount();
      expect(comp.node).to.be["instanceof"](Array);
      expect(comp.node[0]).to.be["instanceof"](Element);
      expect(comp.node[1].innerHTML).to.equal('simple');
      return comp.unmount();
    });
    it('should mount and render each component', function() {
      var demoNode, lst;
      dontUnmount = true;
      document.getElementById('demo').innerHTML = '';
      comp = each(lst = ['each', 'simple'], function(item, i) {
        return p(item);
      });
      comp.mount(demoNode = newDemoNode("each"));
      expect(comp.node[0].innerHTML).to.equal('each');
      expect(comp.node[1].innerHTML).to.equal('simple');
      lst.setItem(0, 3);
      dc.update();
      expect(comp.node[0].innerHTML).to.equal('3', 'update node 0');
      lst.setItem(1, 4);
      dc.update();
      expect(comp.node[1].innerHTML).to.equal('4', 'update node 1');
      expect(demoNode.innerHTML).to.equal('<p>3</p><p>4</p>', 'update innerHTML');
      lst.setItem(2, 5);
      dc.update();
      expect(comp.node[2].innerHTML).to.equal('5', 'update list[2] = 5');
      lst.setLength(0);
      dc.update();
      expect(comp.children.length).to.equal(0, 'comp.children.length = 0');
      expect(comp.node.length).to.equal(0, 'node.length');
      return comp.unmount();
    });
    it('should process binding on item', function() {
      var lst;
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
      dc.update();
      expect(comp.node[0].textContent).to.equal('c', 'update c');
      lst[1].text = 'd';
      dc.update();
      expect(comp.node[1].textContent).to.equal('d', 'update d');
      lst.setItem(2, {
        text: 'e'
      });
      dc.update();
      expect(comp.node[2].textContent).to.equal('e');
      lst.setLength(0);
      dc.update();
      expect(comp.node.length).to.equal(0);
      return comp.unmount();
    });
    it('should process items in template function', function() {
      var lst;
      comp = each(lst = ['a', 'b'], {
        itemFunc: function(item, i, listComponent) {
          return p(txt(function() {
            return item;
          }));
        }
      });
      comp.mount();
      lst.setItem(0, 'c');
      dc.update();
      expect(comp.node[0].textContent).to.equal('c');
      return comp.unmount();
    });
    it('should process tag with each', function() {
      var each1, text1, x$;
      dontUnmount = true;
      x$ = see(1);
      text1 = null;
      comp = new Tag('div', {}, [
        each1 = each([1], {
          itemFunc: function(item) {
            return text1 = txt(x$);
          }
        })
      ]);
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      x$(2);
      dc.update();
      expect(text1.node.textContent).to.equal('2', 'update, 2');
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('2');
      return comp.unmount();
    });
    it('should create and update deeper embedded each', function() {
      var each1, listItems, span1, x;
      x = 1;
      comp = div({}, span1 = new Tag('span', {}, [
        each1 = each(listItems = [x], {
          itemFunc: function(item) {
            return txt(item);
          }
        })
      ]));
      comp.mount();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      listItems.setItem(0, 2);
      dc.update();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('<span>2</span>');
      return comp.unmount();
    });
    it('should create and update each where item return a closure variable', function() {
      var x;
      x = see(1);
      comp = each([1], {
        itemFunc: function() {
          return txt(x);
        }
      });
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      x(2);
      dc.update();
      expect(comp.node[0].textContent).to.equal('2');
      return comp.unmount();
    });
    it('should create and update embedded each where item return a closure variable', function() {
      var each1, x;
      x = see(1);
      comp = new Tag('span', {}, [
        each1 = each([1], {
          itemFunc: function(item) {
            return txt(x);
          }
        })
      ]);
      comp.mount();
      expect(each1.parentNode).to.equal(comp.node);
      expect(each1.node[0].textContent).to.equal('1');
      x(2);
      dc.update();
      expect(each1.parentNode).to.equal(comp.node);
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('2');
      return comp.unmount();
    });
    it('should create and update embedded each in 3 layer', function() {
      var each1, span1, x;
      x = see(1);
      comp = div({}, div({}, span1 = new Tag('span', {}, [
        each1 = each([1], {
          itemFunc: function(item) {
            return txt(x);
          }
        })
      ])));
      comp.mount();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x(2);
      dc.update();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
      return comp.unmount();
    });
    it('should mount and update each', function() {
      comp = new Tag('span', {}, [
        each([1], function(item) {
          return txt(1);
        })
      ]);
      comp.mount();
      expect(comp.node.innerHTML).to.equal('1');
      dc.update();
      expect(comp.node.innerHTML).to.equal('1');
      return comp.unmount();
    });
    it('should push and setLength of each', function() {
      var lst;
      lst = [1, 2, 3, 4, 5, 6];
      comp = each(lst, function(item) {
        return txt(item);
      });
      comp.mount();
      lst.push(7);
      dc.update();
      expect(comp.node.length).to.equal(7, 'push 7');
      lst.setLength(4);
      dc.update();
      expect(comp.node.length).to.equal(4, 'setLength 4');
      return comp.unmount();
    });
    it('should update each with component as the item of list 1', function() {
      var s;
      comp = each([txt(1)], function(item) {
        return item;
      });
      comp.mount();
      expect(comp.node[0].textContent).to.equal(s = '1');
      dc.update();
      expect(comp.node[0].textContent).to.equal('1');
      return comp.unmount();
    });
    it('should update each with component as the item of list 2', function() {
      var s;
      comp = div(each([txt(1)], function(item) {
        return item;
      }));
      comp.mount();
      expect(comp.node.innerHTML).to.equal(s = '1');
      dc.update();
      expect(comp.node.innerHTML).to.equal('1');
      return comp.unmount();
    });
    it('should update each with component as the item of list 3', function() {
      var s;
      comp = div(div(each([txt(1)], function(item) {
        return item;
      })));
      comp.mount();
      expect(comp.node.innerHTML).to.equal(s = '<div>1</div>');
      dc.update();
      expect(comp.node.innerHTML).to.equal('<div>1</div>');
      return comp.unmount();
    });
    it('should always attach and detach in multiple iteration 0', function() {
      var showingEach$;
      showingEach$ = see(true);
      comp = if_(showingEach$, txt(1));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('1');
      expect(comp.node.parentNode).to.equal(demo2Node);
      showingEach$(false);
      dc.update();
      expect(comp.node.parentNode).to.equal(void 0);
      expect(demo2Node.innerHTML).to.equal('');
      showingEach$(true);
      dc.update();
      expect(comp.node.parentNode).to.equal(demo2Node);
      expect(demo2Node.innerHTML).to.equal('1');
      showingEach$(false);
      dc.update();
      expect(demo2Node.innerHTML).to.equal('');
      expect(comp.node.parentNode).to.equal(void 0);
      return comp.unmount();
    });
    it('should always attach and detach each in multiple iteration 1', function() {
      var lst4, showingEach$;
      showingEach$ = see(true);
      lst4 = [1, 2];
      comp = if_(showingEach$, each(lst4, function(item) {
        return txt(item);
      }));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('12');
      expect(comp.node.parentNode).to.equal(demo2Node);
      showingEach$(false);
      dc.update();
      expect(comp.node.parentNode).to.equal(void 0);
      expect(demo2Node.innerHTML).to.equal('');
      showingEach$(true);
      dc.update();
      expect(comp.node.parentNode).to.equal(demo2Node);
      expect(demo2Node.innerHTML).to.equal('12');
      showingEach$(false);
      dc.update();
      expect(demo2Node.innerHTML).to.equal('');
      expect(comp.node.parentNode).to.equal(void 0);
      return comp.unmount();
    });
    return it('should always attach and detach each in multiple iteration 2', function() {
      var lst4, showingEach$;
      showingEach$ = see(true);
      lst4 = [1, 2];
      comp = if_(showingEach$, each(lst4, function(item) {
        return div(item);
      }));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('<div>1</div><div>2</div>');
      showingEach$(false);
      dc.update();
      expect(comp.node.parentNode).to.equal(void 0);
      showingEach$(true);
      dc.update();
      expect(comp.node.parentNode).to.equal(demo2Node);
      showingEach$(false);
      dc.update();
      expect(comp.node.parentNode).to.equal(void 0);
      return comp.unmount();
    });
  });
  return describe('funcEach', function() {
    it('should process funcEach', function() {
      var x;
      x = 1;
      comp = funcEach((function() {
        return [x];
      }), {
        itemFunc: function(item) {
          return item;
        }
      });
      comp.mount();
      expect(comp.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(comp.node[0].textContent).to.equal('2', 'after x = 2');
      return comp.unmount();
    });
    it('should create and update funcEach', function() {
      var x;
      dontUnmount = true;
      x = 1;
      comp = funcEach((function() {
        return [x];
      }), {
        itemFunc: function(item) {
          return txt(item);
        }
      });
      comp.mount(demo2Node);
      expect(comp.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(comp.node[0].textContent).to.equal('2', 'update 2');
      expect(comp.isList).to.equal(true);
      expect(demo2Node.innerHTML).to.equal('2', 'innerHTML');
      x = 3;
      dc.update();
      expect(comp.node[0].textContent).to.equal('3', 'update 3');
      expect(demo2Node.innerHTML).to.equal('3', 'innerHTML');
      return comp.unmount();
    });
    it('should process each under each and with function as items 1', function() {
      var each1, each2, x;
      x = 1;
      each2 = null;
      comp = div({}, each1 = each([1], function() {
        return each2 = funcEach((function() {
          return [x];
        }), function(item) {
          return item;
        });
      }));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('<div>1</div>');
      dontUnmount = true;
      expect(each1.parentNode).to.equal(comp.node);
      expect(each1.node[0][0].textContent).to.equal('1');
      expect(each2.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(demo2Node.innerHTML).to.equal('<div>2</div>');
      expect(each1.parentNode).to.equal(comp.node);
      expect(each2.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('2', 'after x = 2');
      return comp.unmount();
    });
    it('should process each under each and with function as items 0', function() {
      var each1, each2, x;
      x = 1;
      each2 = null;
      comp = each1 = each([1], function() {
        return each2 = funcEach((function() {
          return [x];
        }), {
          itemFunc: function(item) {
            return txt(item);
          }
        });
      });
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('1');
      dontUnmount = true;
      expect(each1.parentNode).to.equal(each1.parentNode);
      expect(each1.parentNode).to.equal(demo2Node);
      expect(each1.node[0][0].textContent).to.equal('1');
      expect(each2.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(demo2Node.innerHTML).to.equal('2');
      expect(each1.parentNode).to.equal(each1.parentNode);
      expect(each2.node[0].textContent).to.equal('2');
      expect(demo2Node.innerHTML).to.equal('2', 'after x = 2');
      return comp.unmount();
    });
    it('should create and update embedded each in 3 layer 2', function() {
      var each1, span1, x;
      x = 1;
      comp = div({}, div({}, span1 = new Tag('span', {}, [
        each1 = funcEach((function() {
          return [x];
        }), {
          itemFunc: function(item) {
            return txt(item);
          }
        })
      ])));
      comp.mount();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
      return comp.unmount();
    });
    it('should create and update deeper embedded funcEach', function() {
      var each1, span1, x;
      x = 1;
      comp = div({}, span1 = new Tag('span', {}, [
        each1 = funcEach((function() {
          return [x];
        }), {
          itemFunc: function(item) {
            return txt(item);
          }
        })
      ]));
      comp.mount();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('1');
      x = 2;
      dc.update();
      expect(each1.parentNode).to.equal(span1.node);
      expect(each1.node[0].textContent).to.equal('2');
      expect(comp.node.innerHTML).to.equal('<span>2</span>');
      return comp.unmount();
    });
    return it('should create and update funcEach in list', function() {
      var each1, items;
      dontUnmount = true;
      items = [1, 2];
      comp = list(txt('text'), each1 = funcEach((function() {
        return items;
      }), {
        itemFunc: function(item) {
          return txt(' ' + item);
        }
      }));
      comp.mount(demo2Node);
      expect(demo2Node.innerHTML).to.equal('text 1 2');
      items = [3];
      dc.update();
      expect(demo2Node.innerHTML).to.equal('text 3');
      dc.update();
      return expect(demo2Node.innerHTML).to.equal('text 3');
    });
  });
});
