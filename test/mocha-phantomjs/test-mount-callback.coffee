{expect, iit, idescribe, nit, ndescribe} = require('./helper')

{bindings, bibind
classFn, styleFrom
model, show
Tag, Text, List
Component, list, func, if_, txt
a, p, span, text, li, div, button, input} = dc

{$a, $b, _a, _b} = bindings({a: 1, b: 2})

describe "test beforeMount afterUnmount callback  ", ->
  describe 'before mount callback', ->
    it 'component shoud call mountCallback before mounting', ->
      x = 0
      comp = p()
      comp.beforeMount(-> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call mountCallback before mounting if_', ->
      x = 0
      comp = if_(1, 2, 3)
      comp.beforeMount(-> x=1)
      comp.mount()
      expect(x).to.equal 1

    it 'component shoud call then_.mountCallback before updating if_', ->
      x = 0
      comp = if_((->x), t=txt(1), txt(2))
      t.beforeMount(-> x=1)
      comp.mount()
      expect(x).to.equal 0
      x = 1
      comp.update()
      expect(x).to.equal 1

    it 'component shoud call embeded mountCallback before updating if_', ->
      x = 0
      comp = if_((->x), p(t=txt(1)), txt(2))
      t.beforeMount(-> x=1)
      comp.mount()
      expect(x).to.equal 0
      x = 1
      comp.update()
      expect(x).to.equal 1

  describe 'after unmount callback', ->
    it 'component shoud call unmountCallback after mounting', ->
      x = 0
      comp = p()
      comp.beforeMount(-> x=1)
      comp.afterUnmount(-> x=2)
      comp.mount()
      expect(x).to.equal 1
      comp.unmount()
      expect(x).to.equal 2

    it 'component shoud call mountCallback before mounting if_', ->
      x = 0
      y = 0
      comp = if_(1, 2, 3)
      comp.beforeMount(-> x=1)
      comp.afterUnmount(-> y=2)
      comp.mount()
      expect(x).to.equal 1
      comp.unmount()
      expect(y).to.equal 2

    it 'component shoud call then_.mountCallback before updating if_', ->
      x = 0
      y = 0
      comp = if_((->x), t=txt(1), t2=txt(2))
      t.beforeMount(-> x=1)
      t2.afterUnmount(-> y=2)
      comp.mount()
      expect(x).to.equal 0
      x = 1
      comp.update()
      expect(x).to.equal 1
      expect(y).to.equal 2

    it 'component shoud call embeded mountCallback before updating if_', ->
      x = 0
      y = 0
      comp = if_((->x), p(t=txt(1)), p(t2=txt(2)))
      t.beforeMount(-> x=1)
      t2.afterUnmount(-> y=2)
      comp.mount()
      expect(x).to.equal 0
      x = 1
      comp.update()
      expect(x).to.equal 1
      expect(y).to.equal 2
