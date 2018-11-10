var bind, bindings, ddescribe, duplex, expect, flow, idescribe, iit, ndescribe, nit, renew, see, seeAttrs, _ref, _ref1, _ref2;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

_ref1 = require('lazy-flow'), see = _ref1.see, bind = _ref1.bind, duplex = _ref1.duplex, renew = _ref1.renew, flow = _ref1.flow;

_ref2 = require('./addon'), bindings = _ref2.bindings, seeAttrs = _ref2.seeAttrs;

describe('reactive flow', function() {
  it('should see', function() {
    var r;
    r = see(1);
    expect(r()).to.equal(1);
    expect(r(2)).to.equal(2);
    return expect(r()).to.equal(2);
  });
  it('should renew', function() {
    var r, x;
    x = 1;
    r = renew((function() {
      return x;
    }), true);
    expect(r()).to.equal(1);
    expect(function() {
      return r(2);
    }).to["throw"]();
    x = 2;
    return expect(r()).to.equal(2);
  });
  it('should flow', function() {
    var r1, r2, r3;
    r1 = see(1);
    r2 = see(2);
    r3 = flow(r1, r2, function() {
      return r1() + r2();
    });
    expect(r3()).to.equal(3);
    r1(2);
    return expect(r3()).to.equal(4);
  });
  it('should flow unary', function() {
    var a_, b_, r, _ref3;
    _ref3 = bindings({
      a: 4,
      b: 2
    }), a_ = _ref3.a_, b_ = _ref3.b_;
    r = flow.neg(a_);
    expect(r()).to.equal(-4, 'neg');
    r = flow.not(a_);
    expect(r()).to.equal(false, 'not');
    r = flow.abs(flow.neg(a_));
    expect(r()).to.equal(4, 'abs neg');
    r = flow.bitnot(a_);
    return expect(r()).to.equal(-5, 'bitnot');
  });
  it('should flow binary', function() {
    var a_, b_, r, _ref3;
    _ref3 = bindings({
      a: 4,
      b: 2
    }), a_ = _ref3.a_, b_ = _ref3.b_;
    r = flow.add(a_, b_);
    expect(r()).to.equal(6, 'add');
    r = flow.sub(a_, b_);
    expect(r()).to.equal(2, 'sub');
    r = flow.mul(a_, b_);
    expect(r()).to.equal(8, 'mul');
    r = flow.div(a_, b_);
    return expect(r()).to.equal(2, 'div');
  });
  it('should invalidate flow binary', function() {
    var a, b, r;
    a = see(1);
    b = see(2);
    r = flow.add(a, b);
    expect(r()).to.equal(3, 'add');
    a(3);
    return expect(r()).to.equal(5, 'add 2');
  });
  it('should invalidate bind flow binary', function() {
    var a, b, m, r;
    m = {
      a: 1,
      b: 2
    };
    a = bind(m, 'a', 'm');
    b = bind(m, 'b', 'm');
    r = flow.add(a, b);
    expect(r()).to.equal(3, 'add');
    expect(function() {
      return a(3);
    }).to["throw"]();
    return expect(r()).to.equal(3, 'add 2');
  });
  it('should bind', function() {
    var a, a2, m;
    m = {
      a: 1
    };
    a = bind(m, 'a');
    a2 = bind(m, 'a');
    expect(a()).to.equal(1);
    expect(a2()).to.equal(1, 'a2');
    expect(function() {
      return a(3);
    }).to["throw"]();
    expect(a()).to.equal(1, 'a again');
    return expect(a2()).to.equal(1, 'a2 again');
  });
  it('should process bindings', function() {
    var a$, a_, _ref3;
    _ref3 = bindings({
      a: 1
    }), a$ = _ref3.a$, a_ = _ref3.a_;
    a$(3);
    return expect(a_()).to.equal(3);
  });
  it('should process multiple bind and duplex on same object and attr', function() {
    var a1, a2, b1, b2, m, sum;
    m = {
      a: 1,
      b: 2
    };
    a1 = duplex(m, 'a');
    b1 = duplex(m, 'b');
    a2 = duplex(m, 'a');
    b2 = duplex(m, 'b');
    sum = flow.add(a1, b1);
    expect(sum()).to.equal(3, 'sum 1');
    expect(sum.valid).to.equal(true, 'valid 1');
    a2(3);
    expect(sum.valid).to.equal(false, 'valid 2');
    expect(sum()).to.equal(5, 'sum 2');
    sum = flow.add(a2, b2);
    expect(sum()).to.equal(5, 'sum 3');
    expect(sum.valid).to.equal(true, 'valid 3');
    a2(1);
    expect(sum.valid).to.equal(false, 'valid 4');
    return expect(sum()).to.equal(3, 'sum 4');
  });
  return it('should seeAttrs', function() {
    var a, b;
    a = {};
    b = {
      x: 1
    };
    seeAttrs(a, b);
    expect(typeof a.x).to.equal('function');
    expect(a.x()).to.equal(1);
    b = {
      x: 2
    };
    seeAttrs(a, b);
    expect(typeof a.x).to.equal('function');
    return expect(a.x()).to.equal(2);
  });
});
