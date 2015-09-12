{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, see, bind, duplex, watch, renew, flow} = dc

describe 'reactive flow', ->

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

  it 'should invalidate flow binary', ->
    a = see 1; b = see 2
    r = flow.add a, b
    expect(r()).to.equal 3, 'add'
    a 3
    expect(r()).to.equal 5, 'add 2'

  it 'should invalidate bind flow binary', ->
    m = {a:1, b:2}
    a = bind(m, 'a', 'm'); b = bind(m, 'b', 'm')
    r = flow.add a, b
    expect(r()).to.equal 3, 'add'
    a 3
    expect(r()).to.equal 5, 'add 2'

  it 'should bind', ->
    m = {a:1}
    a = bind(m, 'a')
    a2 = bind(m, 'a')
    expect(a()).to.equal(1)
    expect(a2()).to.equal(1, 'a2')
    a 3
    expect(a()).to.equal(3, 'a again')
    expect(a2()).to.equal(3, 'a2 again')

  it 'should process bindings', ->
    {$a, _a} = bindings({a: 1})
    $a 3
    expect(_a()).to.equal(3)

  it 'should process multiple bind and duplex on same object and attr', ->
    m = {a:1, b:2}
    a1 = bind(m, 'a'); b1 = bind(m, 'b')
    a2 = bind(m, 'a'); b2 = bind(m, 'b')
    sum = flow.add a1, b1
    expect(sum()).to.equal 3, 'sum 1'
    expect(sum.invalid).to.equal false, 'invalid 1'
    a2 3
    expect(sum.invalid).to.equal true, 'invalid 2'
    expect(sum()).to.equal 5, 'sum 2'
    sum = flow.add a2, b2
    expect(sum()).to.equal 5, 'sum 3'
    expect(sum.invalid).to.equal false, 'invalid 3'
    a2 1
    expect(sum.invalid).to.equal true, 'invalid 4'
    expect(sum()).to.equal 3, 'sum 4'
