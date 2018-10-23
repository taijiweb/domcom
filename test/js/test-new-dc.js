var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, html, idescribe, iit, isComponent, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt;

({expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper'));

({newDemoNode} = require('./helper'));

({bindings, see, Tag, Text, List, txt, list, p, div, Html, html, classFn, styleFrom, Nothing, isComponent} = dc);

({a_} = bindings({
  a: 1,
  b: 2
}));

describe("test-base-component", function() {
  afterEach(function() {
    return dc.reset();
  });
  return describe('update baseComponent', function() {
    it('should dc generate a component', function() {
      var comp;
      comp = dc();
      return expect(isComponent(comp)).to.be.true;
    });
    return it('dc() chaining call', function() {
      var comp;
      return comp = dc.div(at('x y')).data({x, y});
    });
  });
});
