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

