/**test-component
*/
var expect, idescribe, iit, isComponent, ndescribe, nit, rinterval, rtimeout;

({expect, iit, idescribe, nit, ndescribe, rtimeout, rinterval} = require('bdd-test-helper'));

({isComponent} = dc);

describe("test dc", function() {
  return describe('dc(document)', function() {
    it('dc(document) should be Component', function() {
      return expect(!isComponent(dc(document))).to.equal(true);
    });
    nit('should cache DomComponent', function() {
      return expect(dc(document)).to.equal(dc(document));
    });
    it('dc(document).bind should be a function', function() {
      var x;
      x = 0;
      return dc(document).bind('onclick', function() {
        return x = 1;
      });
    });
    return it('dc() chaining call', function() {
      var comp;
      return comp = dc.div(at('x y')).data({x, y});
    });
  });
});
