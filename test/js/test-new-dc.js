var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, getters, html, idescribe, iit, isComponent, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt;

({expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper'));

({newDemoNode} = require('./helper'));

({bindings, see, Tag, Text, List, txt, list, p, div, Html, html, classFn, styleFrom, Nothing, isComponent, getters} = dc);

import React from '../../lib/backend/React';

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
    it('dc() chaining call', function() {
      var comp, d, v;
      v = at('x y');
      d = {x, y};
      return comp = dc.div(v).with(d);
    });
    return iit('dc.react should be an backend', function() {
      debugger;
      var dr;
      dr = dc.react(); 
      return expect(dr).to.be.instanceof(React);
    });
  });
});
