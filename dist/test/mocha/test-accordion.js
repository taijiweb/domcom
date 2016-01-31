var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, case_, ddescribe, div, each, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

describe('accordion', function() {
  it('should update accordionGroup', function() {
    var comp, s;
    comp = accordionGroup({}, 'group head', each([1], function(item) {
      return txt(1);
    }), {});
    comp.mount();
    expect(comp.node.innerHTML).to.equal(s = '<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div>');
    comp.update();
    return expect(comp.node.innerHTML).to.equal(s);
  });
  it('should update accordion group 2', function() {
    var comp;
    comp = accordionGroup({}, 'group head', new Tag('span', {}, [
      each([1], function(item) {
        return txt(1);
      })
    ]), {});
    comp.mount();
    return expect(comp.node.innerHTML).to.equal('<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div>');
  });
  it('should mount accordion', function() {
    var comp;
    comp = accordion({}, [
      [
        {}, 'group head', new Tag('span', {}, [
          each([1], function(item) {
            return txt(1);
          })
        ]), {}
      ]
    ], {});
    comp.mount();
    return expect(comp.node.innerHTML).to.equal('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
  });
  it('should update accordion', function() {
    var comp, s;
    comp = accordion({}, [[{}, 'group head', txt(1), {}]], {});
    comp.mount();
    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div></div>');
    comp.update();
    return expect(comp.node.innerHTML).to.equal(s);
  });
  return it('should update accordion 2', function() {
    var comp, s;
    comp = accordion({}, [
      [
        {}, 'group head', new Tag('span', {}, [
          each([1], function(item) {
            return txt(1);
          })
        ]), {}
      ]
    ], {});
    comp.mount();
    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
    comp.update();
    return expect(comp.node.innerHTML).to.equal(s);
  });
});
