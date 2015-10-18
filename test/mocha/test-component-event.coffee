{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, duplex, see
classFn, styleFrom
model, show
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe "component event", ->
  describe 'beforeMount', ->
    it 'component shoud call listeners before mounting', ->
      x = 0
      comp = p()
      comp.on('beforeMount', -> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call listeners before mounting if_', ->
      x = 0
      comp = if_(1, 2, 3)
      comp.on('beforeMount', -> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call then_.listeners before updating if_', ->
      x = see 0
      comp = if_(x, t=txt(1), txt(2))
      t.on('beforeMount', -> x 1)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1

    it 'component shoud not call embeded listeners before updating if_', ->
      x = see 0
      comp = if_(x, p(t=txt(1)), txt(2))
      t.on('beforeMount', -> x 1)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1

  describe 'afterUnmount callback', ->
    it 'component shoud call listeners after mounting', ->
      x = see 0
      comp = p()
      comp.on('beforeMount', -> x 1)
      comp.on('afterUnmount', -> x 2)
      comp.mount()
      expect(x()).to.equal 1
      comp.unmount()
      expect(x()).to.equal 2

    it 'component shoud call listeners before mounting if_', ->
      x = 0
      y = 0
      comp = if_(1, 2, 3)
      comp.on('beforeMount', -> x=1)
      comp.on('afterMount', -> y=2)
      comp.mount()
      expect(x).to.equal 1
      comp.unmount()
      expect(y).to.equal 2

    it 'component shoud NOT call then_.listeners["beforeMount"] before updating if_', ->
      x = see 0
      y = 0
      comp = if_(x, t=txt(1), t2=txt(2))
      t.on('beforeMount', -> x 1)
      t2.on('afterUnmount', -> y=2)
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
      t.on('beforeMount', -> x 1)
      t2.on('afterMount', -> y=2)
      comp.mount()
      expect(x()).to.equal 0
      x 1
      comp.update()
      expect(x()).to.equal 1
      expect(y).to.equal 0
