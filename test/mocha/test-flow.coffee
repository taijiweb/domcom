{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, see, bind, duplex, watch, renew, flow, text, list} = dc

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
    {a_, b_} = bindings({a: 4, b: 2})
    r = flow.neg a_
    expect(r()).to.equal -4, 'neg'
    r = flow.no a_
    expect(r()).to.equal false, 'not'
    r = flow.abs flow.neg a_
    expect(r()).to.equal 4, 'abs neg'
    r = flow.bitnot a_
    expect(r()).to.equal -5, 'bitnot'

  it 'should flow binary', ->
    {a_, b_} = bindings({a: 4, b: 2})
    r = flow.add a_, b_
    expect(r()).to.equal 6, 'add'
    r = flow.sub a_, b_
    expect(r()).to.equal 2, 'sub'
    r = flow.mul a_, b_
    expect(r()).to.equal 8, 'mul'
    r = flow.div a_, b_
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
    expect(-> a 3).to.throw()
    expect(r()).to.equal 3, 'add 2'

  it 'should bind', ->
    m = {a:1}
    a = bind(m, 'a')
    a2 = bind(m, 'a')
    expect(a()).to.equal(1)
    expect(a2()).to.equal(1, 'a2')
    expect(-> a 3).to.throw()
    expect(a()).to.equal(1, 'a again')
    expect(a2()).to.equal(1, 'a2 again')

  it 'should process bindings', ->
    {a$, a_} = bindings({a: 1})
    a$ 3
    expect(a_()).to.equal(3)

  it 'should process multiple bind and duplex on same object and attr', ->
    m = {a:1, b:2}
    a1 = duplex(m, 'a'); b1 = duplex(m, 'b')
    a2 = duplex(m, 'a'); b2 = duplex(m, 'b')
    sum = flow.add a1, b1
    expect(sum()).to.equal 3, 'sum 1'
    expect(sum.valid).to.equal true, 'valid 1'
    a2 3
    expect(sum.valid).to.equal false, 'valid 2'
    expect(sum()).to.equal 5, 'sum 2'
    sum = flow.add a2, b2
    expect(sum()).to.equal 5, 'sum 3'
    expect(sum.valid).to.equal true, 'valid 3'
    a2 1
    expect(sum.valid).to.equal false, 'valid 4'
    expect(sum()).to.equal 3, 'sum 4'

  it 'should process multiple duplex and $model directive', ->
    a = {}

    #a_x$ = duplex(a, 'x')

    text1 = text($model:duplex(a, 'x'))
    text2 = text($model:duplex(a, 'x'))
    list(text1, text2)
    .updateWhen([text1, text2], 'change')
    .mount()

    text1.node.value = '1'
    text1.node.onchange()
    expect(text2.node.value).to.equal('1')