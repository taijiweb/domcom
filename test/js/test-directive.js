/**test-directive
*/
var $hide, $show, Component, a, a$, bindings, ddescribe, div, duplex, each, expect, func, idescribe, if_, iit, input, list, ndescribe, nit, p, see, select, span, text;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({Component, list, func, if_, each, a, div, p, span, text, select, input, $show, $hide, bindings, duplex, see} = dc);

dc.directives(dc.builtinDirectives);

({a$} = bindings({
  a: 1
}));

describe('directives', function() {
  describe('model ', function() {
    it('should process model  directive', function() {
      var comp;
      comp = text({
        $model: a$
      });
      comp.mount();
      comp.node.value = '2';
      comp.node.onchange({
        type: 'change'
      });
      return expect(a$()).to.equal('2');
    });
    return it('should process event property of component with model directive', function() {
      var comp, m, modelValue, x;
      x = 0;
      modelValue = duplex(m = {}, 'x');
      comp = input({
        $model: modelValue,
        onmouseenter: function() {
          return x = 1;
        }
      });
      comp.mount();
      comp.node.onmouseenter({
        type: 'mouseenter'
      });
      return expect(x).to.equal(1);
    });
  });
  describe('$show', function() {
    it('should process $show directive', function() {
      var comp;
      comp = div({
        $show: true
      });
      comp.mount();
      return expect(comp.node.style.display).to.equal('block');
    });
    it('should process $show directive with non block display', function() {
      var comp;
      comp = div({
        style: {
          display: "inline"
        },
        $show: true
      });
      comp.mount();
      return expect(comp.node.style.display).to.equal('inline');
    });
    it('should process $show directive with false value', function() {
      var comp;
      comp = div({
        $show: false
      }, div(1));
      comp.mount();
      return expect(comp.node.style.display).to.equal('none');
    });
    it('should process $show directive with function value', function() {
      var comp, showing;
      showing = see(true);
      comp = div({
        $show: showing
      });
      expect(comp.style.display.invalidate).to.be.defined;
      comp.mount();
      expect(comp.node.style.display).to.equal('block', 1);
      showing(false);
      expect(comp.hasActiveStyle).to.equal(true);
      comp.render();
      return expect(comp.node.style.display).to.equal('none', 2);
    });
    it('should process hide directive', function() {
      var comp;
      comp = div({
        $hide: true
      }, div(1));
      comp.mount();
      expect(comp.node.style.display).to.equal('none');
      comp = div({
        $hide: false
      }, div(1));
      comp.mount();
      return expect(comp.node.style.display).to.equal('block');
    });
    return it('should process show directive with true or false value', function() {
      var comp;
      comp = $show(false)(div(div(1)));
      comp.mount();
      expect(comp.node.style.display).to.equal('none');
      comp = $show(true)(div(div(1)));
      comp.mount();
      return expect(comp.node.style.display).to.equal('block');
    });
  });
  return ndescribe('select options', function() {
    return it('should constructor select with options', function() {
      var comp;
      comp = select({
        $options: [[1, 2]]
      });
      comp.mount();
      expect(comp.node.innerHTML).to.match(/<option>1/);
      return expect(comp.node.innerHTML).to.equal('<option>1</option><option>2</option>');
    });
  });
});
