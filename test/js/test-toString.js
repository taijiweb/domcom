var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, ddescribe, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt;

({expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper'));

({flow, bindings, Component, TransformComponent, Tag, Text, txt, list, func, if_, case_, func, each, accordionGroup, accordion, a, p, span, text, div} = dc);

describe('toString', function() {
  it('should toString list of if(tag)', function() {
    var comp, pIf, t1, x;
    x = 0;
    comp = list(t1 = text({
      onchange: function() {
        x = parseInt(this.node.value);
        return comp.render();
      }
    }, x), pIf = if_((function() {
      return x;
    }), div(1), div(2)));
    return expect(comp.toString()).to.match(/<List>\n  <input type="text" value=0>/);
  });
  it('should toString  tag with props', function() {
    var comp, x;
    x = 0;
    comp = div({
      value: 1
    }, 1);
    return expect(comp.toString()).to.equal('<div value=1>1</div>');
  });
  nit('should case.toString', function() {
    var comp;
    comp = case_((function() {
      return x;
    }), {
      1: p(1),
      2: p(2),
      3: p(3)
    }, 'others');
    return expect(comp.toString()).to.equal('<Case renew: fn:x>\n  1: <p>1</p>\n  2: <p>2</p>\n  3: <p>3</p>\n  "others"\n</Case>');
  });
  return nit('should flow.add(a_, b_).toString', function() {
    var a_, b_, r;
    ({a_, b_} = bindings({
      a: 1,
      b: 2
    }));
    r = flow.add(a_, b_);
    return expect(r.toString()).to.equal('flow: [m[a],m[b]] --> fn:binaryFn(x(), y())');
  });
});
