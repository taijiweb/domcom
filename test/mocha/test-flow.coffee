{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, see, bound, watch, renew, flow} = dc

describe 'reative flow', ->

  it 'should see', ->
    r = see(1)
    expect(r()).to.equal 1
    expect(r 2).to.equal 2
    expect(r()).to.equal 2

  it 'should renew', ->
    x = 1
    r = renew( (-> x), true)
    expect(r()).to.equal 1
    expect(-> r 2).to.throw()
    x = 2
    expect(r()).to.equal 2

  it 'should flow', ->
    r1 = see 1
    r2 = see 2
    r3 = flow(r1, r2, -> r1()+r2())
    expect(r3()).to.equal 3
    expect(-> r3 2).to.throw()
    r1 2
    expect(r3()).to.equal 4

  it 'should flow unary', ->
    {_a, _b} = bindings({a: 4, b: 2})
    r = flow.neg _a
    expect(r()).to.equal -4, 'neg'
    r = flow.no _a
    expect(r()).to.equal false, 'not'
    r = flow.abs flow.neg _a
    expect(r()).to.equal 4, 'abs neg'
    r = flow.bitnot _a
    expect(r()).to.equal -5, 'bitnot'

  it 'should flow binary', ->
    {_a, _b} = bindings({a: 4, b: 2})
    r = flow.add _a, _b
    expect(r()).to.equal 6, 'add'
    r = flow.sub _a, _b
    expect(r()).to.equal 2, 'sub'
    r = flow.mul _a, _b
    expect(r()).to.equal 8, 'mul'
    r = flow.div _a, _b
    expect(r()).to.equal 2, 'div'
