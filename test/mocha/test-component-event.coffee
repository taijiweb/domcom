{expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper')

{duplex, see
classFn, styleFrom
model, show
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

describe "component event", ->
  describe 'mount', ->
    it 'component shoud call listeners before mounting', ->
      x = 0
      comp = p()
      comp.on('mount', -> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call listeners before mounting if_', ->
      x = 0
      comp = if_(1, 2, 3)
      comp.on('mount', -> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call then_.listeners before updating if_', ->
      x = see 0
      comp = if_(x, t=txt(1), txt(2))
      t.on('mount', -> x 1)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1

    it 'component shoud not call embeded listeners before updating if_', ->
      x = see 0
      comp = if_(x, p(t=txt(1)), txt(2))
      t.on('mount', -> x 1)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1

  describe 'unmount callback', ->
    it 'component shoud call listeners after mounting', ->
      x = see 0
      comp = p()
      comp.on('mount', -> x 1)
      comp.on('unmount', -> x 2)
      comp.mount()
      expect(x()).to.equal 1
      comp.unmount()
      expect(x()).to.equal 2

    it 'component shoud call mount and unmount listeners', ->
      x = 0
      y = 0
      comp = if_(1, 2, 3)
      comp.on('mount', -> x=1)
      comp.on('unmount', -> y=2)
      comp.mount()
      expect(x).to.equal 1
      comp.unmount()
      expect(y).to.equal 2

    it 'component shoud NOT call then_.listeners["mount"] before updating if_', ->
      x = see 0
      y = 0
      comp = if_(x, t=txt(1), t2=txt(2))
      t.on('mount', -> x 1)
      t2.on('unmount', -> y=2)
      comp.mount()
      expect(x()).to.equal 0, 'mount'
      x 1
      comp.update()
      expect(x()).to.equal 1
      expect(y).to.equal 0

    it 'component shoud NOT call embeded mountCallback before updating if_', ->
      x = see 0
      y = 0
      comp = if_(x, p(t=txt(1)), p(t2=txt(2)))
      t.on('mount', -> x 1)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1
      expect(y).to.equal 0
