{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{fakeEvent} = require('./helper')

{duplex, see
classFn, styleFrom
model, show
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

describe "component event", ->
  afterEach ->
    dc.reset()

  it 'component shoud call listeners before mounting', ->
    x = 0
    comp = p()
    comp.on('willMount', -> x=1)
    comp.mount()
    expect(x).to.equal 1

  it 'component shoud call listeners before mounting if_', ->
    x = 0
    comp = if_(1, 2, 3)
    comp.on('willMount', -> x=1)
    comp.mount()
    expect(x).to.equal 1

  it 'component shoud call then_.listeners before updating if_', ->
    x = see 0
    comp = if_(x, t=txt(1), txt(2))
    t.on('willMount', -> x 1)
    comp.mount()
    expect(x()).to.equal 0
    x 1
    dc.update()
    expect(x()).to.equal 1

  it 'component shoud not call embeded listeners before updating if_', ->
    x = see 0
    comp = if_(x, p(t=txt(1)), txt(2))
    t.on('willMount', -> x 1)
    comp.mount()
    expect(x()).to.equal 0
    x 1
    dc.update()
    expect(x()).to.equal 1

  it 'component shoud call listeners after mounting', ->
    x = see 0
    comp = p()
    comp.on('willMount', -> x 1)
    comp.on('willUnmount', -> x 2)
    comp.mount()
    expect(x()).to.equal 1
    comp.unmount()
    expect(x()).to.equal 2

  it 'component shoud call mount and unmount listeners', ->
    x = 0
    y = 0
    comp = if_(1, 2, 3)
    comp.on('willMount', -> x=1)
    comp.on('willUnmount', -> y=2)
    comp.mount()
    expect(x).to.equal 1
    comp.unmount()
    expect(y).to.equal 2

  it 'component shoud NOT call then_.listeners["mount"] before updating if_', ->
    x = see 0
    y = 0
    comp = if_(x, t=txt(1), t2=txt(2))
    t.on('willMount', -> x 1)
    t2.on('willUnmount', -> y=2)
    comp.mount()
    expect(x()).to.equal 0, 'mount'
    x 1
    dc.update()
    expect(x()).to.equal 1
    expect(y).to.equal 0

  it 'component shoud NOT call embeded mountCallback before updating if_', ->
    x = see 0
    y = 0
    comp = if_(x, p(t=txt(1)), p(t2=txt(2)))
    t.on('willMount', -> x 1)
    comp.mount()
    expect(x()).to.equal 0
    x 1
    dc.update()
    expect(x()).to.equal 1
    expect(y).to.equal 0

describe "delegate event", ->
  it 'component should delegate click event', ->
    x = 0
    comp = p()
    comp.mount()
    comp.delegate('click')
    comp.do_click = -> x = 1
    comp.node.onclick(fakeEvent(comp.node))
    expect(x).to.equal 1

  it 'component should delegate click event to its holder', ->
    x = 0
    comp = list([child = p()])
    comp.mount()
    child.delegateByHolder('click')
    comp.do_click = -> x = 1
    child.node.onclick(fakeEvent(child.node))
    expect(x).to.equal 1

  it 'component should delegate click event from tag ancestor to its holder', ->
    x = 0
    comp = div(lst = list([child = p()]))
    comp.mount()
    comp.delegateByHolder('click')
    lst.do_click = -> x = 1
    comp.node.onclick(fakeEvent(child.node))
    expect(child.node.onclick).to.be.null
    expect(x).to.equal 1

  it 'component should delegate click event by given component', ->
    x = 0
    comp = div(lst = list([child = p()]))
    comp.mount()
    comp.delegateByComponent('click', lst)
    lst.do_click = -> x = 1
    comp.node.onclick(fakeEvent(child.node))
    expect(child.node.onclick).to.be.null
    expect(x).to.equal 1