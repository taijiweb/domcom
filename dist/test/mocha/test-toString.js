var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, ddescribe, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

flow = dc.flow, bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

describe('toString', function() {
  it('should toString list of if(tag)', function() {
    var comp, pIf, t1, x;
    x = 0;
    comp = list(t1 = text({
      onchange: function() {
        x = parseInt(this.value);
        return dc.update();
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
  it('should case.toString', function() {
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
  return it('should flow.add(a_, b_).toString', function() {
    var a_, b_, r, _ref1;
    _ref1 = bindings({
      a: 1,
      b: 2
    }), a_ = _ref1.a_, b_ = _ref1.b_;
    r = flow.add(a_, b_);
    return expect(r.toString()).to.equal('flow: [m[a],m[b]] --> fn:binaryFn(x(), y())');
  });
});
