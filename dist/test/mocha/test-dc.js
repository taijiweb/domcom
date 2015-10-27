
/**test-component
 */
var expect, idescribe, iit, isComponent, ndescribe, nit, rinterval, rtimeout, _ref;

_ref = require('./helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, rtimeout = _ref.rtimeout, rinterval = _ref.rinterval;

isComponent = dc.isComponent;

describe("test dc", function() {
  return describe('dc(document)', function() {
    it('dc(document) should be Component', function() {
      return expect(!isComponent(dc(document))).to.equal(true);
    });
    it('should cache DomComponent', function() {
      return expect(dc(document)).to.equal(dc(document));
    });
    return it('dc(document).bind should be a function', function() {
      var x;
      x = 0;
      return dc(document).bind('onclick', function() {
        return x = 1;
      });
    });
  });
});
