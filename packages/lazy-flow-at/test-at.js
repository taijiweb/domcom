var ddescribe, expect, flow, idescribe, iit, ndescribe, nit, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

flow = require('./index');

describe('lazy-flow-at', function() {
  it('should process flow.at', function() {
    var called, m, path1;
    m = {};
    path1 = flow.at(m, 'x.y');
    expect(path1()).to.equal(void 0);
    called = false;
    path1.onInvalidate(function() {
      return called = true;
    });
    path1(1);
    expect(called).to.equal(true);
    expect(path1()).to.equal(1);
    expect(m.x.y).to.equal(1);
    called = false;
    m.x = {};
    expect(called).to.equal(true);
    return expect(m.x.y).to.equal(void 0);
  });
  return it('should process flow.at without root', function() {
    var path1, root;
    window.x = void 0;
    path1 = flow.at('x.y');
    expect(path1()).to.equal(void 0);
    path1(1);
    expect(path1()).to.equal(1);
    if (typeof window !== 'undefined') {
      root = window;
    } else {
      root = global;
    }
    return expect(root.x.y).to.equal(1);
  });
});
