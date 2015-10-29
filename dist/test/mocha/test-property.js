var Component, a, attrToPropName, bind, checkbox, classFn, div, duplex, expect, func, hide, idescribe, if_, iit, li, list, model, ndescribe, nit, options, p, see, show, span, splitter, styleFrom, text, util, _ref;

_ref = require('./helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

util = dc.util, bind = dc.bind, duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, attrToPropName = dc.attrToPropName, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, checkbox = dc.checkbox, model = dc.model, show = dc.show, hide = dc.hide, splitter = dc.splitter, options = dc.options;

describe('properties ', function() {
  describe('utilities', function() {
    it('styleFrom ', function() {
      var x;
      x = styleFrom("display:none; zIndex:100; backgroundColor:white;");
      return expect(x).to.deep.equal({
        display: 'none',
        zIndex: '100',
        backgroundColor: 'white'
      });
    });
    return it('attrToPropName ', function() {
      var x;
      x = attrToPropName("background-color");
      return expect(x).to.equal('backgroundColor');
    });
  });
  describe("classFn", function() {
    it('get value of classFn', function() {
      var active, x;
      active = see(true);
      x = classFn([
        'a', {
          b: active
        }
      ]);
      expect(x()).to.equal('a b');
      active(false);
      return expect(x()).to.equal('a');
    });
    it('should compute valid', function() {
      var x;
      x = classFn(['a']);
      expect(x.valid).to.equal(false);
      expect(x()).to.equal('a');
      expect(x.valid).to.equal(true);
      x.extend('a');
      expect(x.valid).to.equal(true);
      expect(x()).to.equal('a');
      x.extend('b');
      expect(x.valid).to.equal(false);
      expect(x()).to.equal('a b');
      x.extend('!b');
      expect(x.valid).to.equal(false);
      return expect(x()).to.equal('a');
    });
    return it('should get class property in component', function() {
      var active, comp;
      active = see(true);
      comp = div({
        "class": {
          a: 1,
          b: active
        }
      });
      expect(comp.className()).to.equal('a b');
      comp.className = classFn({
        a: 1,
        b: active
      });
      expect(comp.className.valid).to.equal(false, 'className.valid 1');
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 1');
      comp.mount();
      expect(comp.className.valid).to.equal(true, 'className.valid 2');
      expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties 2');
      expect(comp.node.className).to.equal('a b');
      active(false);
      expect(comp.className.valid).to.equal(false, 'className.valid 3');
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 3');
      comp.update();
      return expect(comp.node.className).to.equal('a');
    });
  });
  describe('create', function() {
    return it('should create properties', function() {
      var comp;
      comp = p({
        value: bind({
          a: 1
        }, 'a')
      });
      expect(comp.className.valid).to.equal(true, 'className.valid');
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
      comp.mount();
      return expect(comp.node.value).to.equal(1);
    });
  });
  describe('event', function() {
    it('click event ', function() {
      var comp, x;
      x = 1;
      comp = a({
        onclick: function() {
          return x = 2;
        }
      }, 'click me');
      comp.mount('#demo');
      comp.node.click();
      return expect(x).to.equal(2);
    });
    it('multiple handlers for one event', function() {
      var $a, comp, spy1, x;
      $a = duplex(x = {
        a: 1
      }, 'a');
      spy1 = sinon.spy();
      comp = text({
        onchange: spy1,
        $model: $a
      });
      comp.mount();
      comp.node.value = 2;
      comp.node.onchange();
      expect(spy1.called).to.equal(true);
      return expect(x.a).to.equal('2');
    });
    return it('multiple handlers for one event, with bind value', function() {
      var $a, comp, spy1, x;
      $a = duplex(x = {
        a: 1
      }, 'a');
      spy1 = sinon.spy();
      comp = text({
        onchange: spy1
      }, $a);
      comp.mount();
      comp.node.value = 2;
      comp.node.onchange();
      expect(spy1.called).to.equal(true);
      return expect(x.a).to.equal('2');
    });
  });
  describe('style', function() {
    it('should set style property with string value', function() {
      var comp, elm;
      comp = a({
        style: "border:red 1px solid"
      }, 'red 1px solid');
      expect(comp.className.valid).to.equal(true, 'className.valid');
      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
      elm = comp.mount('#demo');
      return expect(comp.node.style.border).to.equal("1px solid red");
    });
    it('should set style property', function() {
      var comp, elm;
      comp = a({
        style: {
          border: "red 1px solid"
        }
      }, 'red 1px solid');
      elm = comp.mount('#demo');
      return expect(comp.node.style.border).to.equal("1px solid red");
    });
    it('value of property of style could be dc expression', function() {
      var comp, elm;
      comp = a({
        style: {
          border: function() {
            return "red 1px solid";
          }
        }
      }, 'red 1px solid');
      elm = comp.mount('#demo');
      return expect(comp.node.style.border).to.equal("1px solid red");
    });
    return nit('change style dynamically', function() {
      var color, comp, handle, i, i0, paddingColor, styleFn;
      paddingColor = function(hexStr) {
        if (!(hexStr.match(/^\d/))) {
          return hexStr;
        }
        while (hexStr.length < 6) {
          hexStr = '0' + hexStr;
        }
        return '#' + hexStr;
      };
      color = see("red");
      i = see(i0 = 0);
      comp = a({
        style: {
          borderWidth: flow(i, function() {
            return i() + "px";
          }),
          borderStyle: "solid",
          borderColor: flow(color, function() {
            return paddingColor(color().toString(16));
          })
        }
      }, 'dynamic property');
      comp.mount('#demo');
      color = 0;
      styleFn = function() {
        color += 0x111111;
        i(i0++);
        comp.render();
        if (i0 === 50) {
          return clearInterval(handle);
        }
      };
      return handle = setInterval(styleFn, 5);
    });
  });
  return it('bidirectional bind checkbox', function() {
    var bb, cbx, model1;
    dc.directives({
      $model: dc.$model
    });
    model1 = {
      a: 1
    };
    bb = duplex(model1, 'a');
    cbx = checkbox({
      $model: bb
    });
    cbx.mount('#demo');
    expect(cbx.node.onchange).to.be.defined;
    cbx.node.checked = true;
    cbx.node.onchange();
    return expect(model1.a).to.equal(true);
  });
});
