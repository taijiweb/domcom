var Component, List, Tag, Text, a, bindings, button, classFn, controls, div, duplex, each, expect, extendAttrs, flow, func, idescribe, if_, iit, input, li, list, ndescribe, nit, p, see, span, styleFrom, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

bindings = dc.bindings, duplex = dc.duplex, flow = dc.flow, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, extendAttrs = dc.extendAttrs, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input, each = dc.each;

controls = require('domcom/demo/demo-controls');

describe('demo', function() {
  describe('sum', function() {
    return it('should construct and create components', function() {
      var a$, a_, b$, b_, comp, sum, x, y, z, _ref1;
      _ref1 = bindings({
        a: 3,
        b: 2
      }), a$ = _ref1.a$, b$ = _ref1.b$, a_ = _ref1.a_, b_ = _ref1.b_;
      x = text(a$);
      y = text(b$);
      z = p(txt(sum = flow.add(a_, b_)));
      expect(sum()).to.equal(5, 'sum 1');
      a_(1);
      expect(sum()).to.equal(3, 'sum 2');
      comp = list(x, y, z);
      comp.mount('#demo');
      expect(z.node.innerHTML).to.equal('3', 'mount');
      x.node.value = '3';
      y.node.value = '4';
      x.node.onchange();
      y.node.onchange();
      expect(a_()).to.equal('3', 'a_');
      expect(b_()).to.equal('4', 'b_');
      expect(sum()).to.equal('34', 'sum');
      expect(!!comp.valid).to.equal(false, 'comp.valid');
      expect(!!z.valid).to.equal(false, 'z.valid');
      comp.update();
      return expect(z.node.innerHTML).to.equal('34', 'update');
    });
  });
  describe('combobox', function() {
    it('should process event property of child component', function() {
      var c0, comp, x;
      x = 0;
      comp = div({}, c0 = input({
        onmouseenter: function() {
          return x = 1;
        }
      }), div({}, 'wawa'));
      comp.mount();
      c0.node.onmouseenter();
      return expect(x).to.equal(1);
    });
    return it('should process event property of child component with model directive', function() {
      var c0, comp, x;
      x = 0;
      comp = div({}, c0 = input({
        $model: duplex({}, 'x'),
        onmouseenter: function() {
          return x = 1;
        }
      }), div({}, 'wawa'));
      comp.mount();
      c0.node.onmouseenter();
      return expect(x).to.equal(1);
    });
  });
  describe('text model', function() {
    it('should text model by value', function() {
      var a$, attrs, comp, m, text1, text2;
      a$ = bindings(m = {
        a: 1
      }).a$;
      attrs = {
        onchange: function() {
          return comp.update();
        }
      };
      comp = list(text1 = text(attrs, a$), text2 = text(attrs, a$));
      comp.mount();
      text1.node.value = 3;
      text1.node.onchange();
      expect(m.a).to.equal('3', 'm.a');
      return expect(text2.node.value).to.equal('3', 'text2.node.value');
    });
    return it('should text model by value and onchange', function() {
      var a$, attrs, comp, m, text1, text2;
      a$ = bindings(m = {
        a: 1
      }).a$;
      attrs = {
        value: a$,
        onchange: function() {
          a$(this.value);
          return comp.update();
        }
      };
      comp = list(text1 = text(attrs), text2 = text(attrs));
      comp.mount();
      text1.node.value = 3;
      text1.node.onchange();
      expect(m.a).to.equal('3', 'm.a');
      return expect(text2.node.value).to.equal('3', 'text2.node.value');
    });
  });
  describe('combo', function() {
    return it('should combobox', function() {
      var attrs, comp, input1, item, items, opts, showingItems, value;
      showingItems = see(false);
      comp = null;
      value = see('');
      opts = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = [1, 2];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          _results.push((function(item) {
            return span({
              style: {
                display: 'block',
                border: "1px solid blue",
                "min-width": "40px"
              },
              onclick: (function() {
                value(item);
                return comp.update();
              })
            }, item);
          })(item));
        }
        return _results;
      })();
      attrs = extendAttrs(attrs, {
        onmouseleave: (function() {
          showingItems(false);
          return comp.update();
        })
      });
      comp = div(attrs, input1 = input({
        $model: value,
        onmouseenter: (function() {
          showingItems(true);
          return comp.update();
        })
      }), items = div({
        style: {
          display: flow(showingItems, function() {
            if (showingItems()) {
              return 'block';
            } else {
              return 'none';
            }
          })
        }
      }, opts));
      comp.mount();
      expect(input1.node.value).to.equal('');
      expect(showingItems()).to.equal(false);
      expect(items.node.style.display).to.equal('none');
      input1.node.onmouseenter();
      expect(items.node.style.display).to.equal('block');
      opts[1].node.onclick();
      return expect(input1.node.value).to.equal('2');
    });
  });
  describe('controls', function() {
    return it('should mount controls and others', function() {
      var comp;
      comp = controls();
      comp.mount('#demo');
      expect(comp.node.length).to.equal(2);
      return comp.unmount();
    });
  });
  describe('mount/unmount', function() {
    return it('should mount/unmount sub component', function() {
      var buttons, comp, div1;
      div1 = div('toggle me');
      buttons = list(div({
        onclick: (function() {
          return div1.mount();
        })
      }, 'mount', div({
        onclick: (function() {
          return div1.unmount();
        })
      }, 'unmount')));
      comp = list(buttons, div1);
      div1.mount();
      div1.unmount();
      comp.mount();
      return comp.unmount();
    });
  });
  return describe('todomvc', function() {
    var makeTodo;
    it('should process class', function() {
      var comp;
      comp = a({
        className: {
          selected: 1
        },
        href: "#/"
      });
      comp.mount('#demo');
      return expect(comp.node.className).to.equal('selected');
    });
    it('should construct and create components', function() {
      var comp;
      comp = li(a({
        className: {
          selected: 1
        },
        href: "#/"
      }, "All"));
      comp.mount('#demo');
      expect(comp.children[0].node.className).to.equal('selected');
      return expect(comp.children[0].node.href).to.match(/:\/\//);
    });
    makeTodo = function(todos, status) {
      var getTodos, todoItems;
      status.hash = 'all';
      getTodos = function() {
        if (status.hash === 'active') {
          return todos.filter(function(todo) {
            return todo && !todo.completed;
          });
        } else if (status.hash === 'completed') {
          return todos.filter(function(todo) {
            return todo && todo.completed;
          });
        } else {
          return todos;
        }
      };
      return todoItems = each(getTodos, function(todo, index) {
        return p(txt(function() {
          return todo.title;
        }), ', ', txt(function() {
          if (todo.completed) {
            return 'completed';
          } else {
            return 'uncompleted';
          }
        }));
      });
    };
    it('should mount getTodos and Each with empty todos correctly', function() {
      var comp, status, todos;
      todos = [];
      comp = makeTodo(todos, status = {
        hash: 'all'
      });
      comp.mount();
      return expect(comp.node.length).to.equal(0);
    });
    it('should invalidate children to listComponent', function() {
      var child0, comp, status, todos;
      todos = [
        {
          title: 'do this'
        }
      ];
      comp = makeTodo(todos, status = {
        hash: 'all'
      });
      expect(comp.listComponent.invalidIndexes).to.be.undefined;
      comp.getContentComponent();
      child0 = comp.cacheChildren[0];
      status.hash = 'completed';
      child0.transfornValid = true;
      comp.getContentComponent();
      child0.valid = true;
      status.hash = 'all';
      return comp.getContentComponent();
    });
    it('should process getTodos and Each correctly', function() {
      var child0, comp, status, todos;
      todos = [
        {
          title: 'do this'
        }
      ];
      comp = makeTodo(todos, status = {
        hash: 'all'
      });
      comp.mount();
      expect(comp.node.length).to.equal(1);
      status.hash = 'completed';
      comp.update();
      expect(comp.node.length).to.equal(0);
      status.hash = 'all';
      comp.getContentComponent();
      child0 = comp.listComponent.children[0];
      comp.update();
      return expect(comp.node.length).to.equal(1);
    });
    return it('should todoEditArea', function() {
      var comp, footer, section, todoEditArea, todoItems, ul;
      section = dc.section, ul = dc.ul, footer = dc.footer;
      todoItems = each([1, 2], function(todo, index) {
        return li(1);
      });
      comp = todoEditArea = section({
        id: "main"
      }, ul({
        id: "todo-list"
      }, todoItems), footer({
        id: "footer"
      }));
      comp.mount();
      return comp.update();
    });
  });
});
