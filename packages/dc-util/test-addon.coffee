{expect, iit, idescribe, nit, ndescribe, ddescribe} = require('bdd-test-helper')

{p, list, div} = dc
{getCommonRoot, getComponentsBetween} = require('dc-util/addon')

describe "dc-util/addon", ->

  describe "getCommonRoot", ->
    it 'should getCommonRoot of two same component', ->
      comp = p()
      expect(getCommonRoot(comp, comp)[0]).to.equal(comp)

    it 'should getCommonRoot of two component', ->
      comp = list(c1=p(), c2=p())
      expect(getCommonRoot(c1, c2)[0]).to.equal(comp)

    it 'should getCommonRoot of two component in different level', ->
      comp = div(c1=p(), list(p(), c2=p()))
      expect(getCommonRoot(c1, c2)[0]).to.equal(comp)

    it 'should getCommonRoot of two component in different level', ->
      comp = div(comp1 = div(c1=p(), div(p(), c2=p())), p())
      expect(getCommonRoot(c1, c2)[0]).to.equal(comp1)

  describe "getComponentsBetween", ->
    it 'should getComponentsBetween of two same component', ->
      comp = p()
      expect(getComponentsBetween(comp, comp)).to.deep.equal([comp])

    it 'should getComponentsBetween of two component', ->
      comp = list(c1=p(), c2=p())
      expect(getComponentsBetween(c1, c2)).to.deep.equal([comp])

    it 'should getComponentsBetween of two component in different level', ->
      comp = div(c1=p(), c4 = list(p(), c2=p()))
      lst = getComponentsBetween(c1, c2)
      expect(lst).to.deep.equal([comp])

    it 'should getComponentsBetween of two component in different level 2', ->
      comp = div(comp1 = div(c1=p(), c4=div(p(), c2=p())), p())
      expect(getComponentsBetween(c1, c2)).to.deep.equal([comp1])

    it 'start is not first leaf', ->
      comp = div(comp1 = div(p(), c1 = p(), c4 = div(p(), c2=p())), p())
      expect(getComponentsBetween(c1, c2)).to.deep.equal([c1, c4])

    it 'start is not first leaf with mid brother', ->
      comp = div(comp1 = div(p(), c1 = p(), c3 = p(), c4 = div(p(), c2=p())), p())
      expect(getComponentsBetween(c1, c2)).to.deep.equal([c1, c3, c4])

    it 'start is first leaf with left top', ->
      comp = div(comp1 = div(c4 = div(c5 = p(), c2=p()), c1 = p(), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c4, c1])

    it 'start is not first leaf with left top 2', ->
      comp = div(comp1 = div(p(), c4 = div(c5 = p(), c2=p()), c1 = p(), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c4, c1])

    it 'more complicated', ->
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2=p()), c1 = p(), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c1])

    it 'more complicated 2', ->
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2=p()), div(c6 = p(), c1 = p(), p()), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c6, c1])

    it 'more complicated 3', ->
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2=p()), c7 = p(), div(c6 = p(), c1 = p(), p()), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c7, c6, c1])

    it 'more complicated 4', ->
      comp = div(comp1 = div(p(), c4 = div(c6 = p(), c5 = p(), c2=p()), c7 = p(), div(c8 = p(), div(c6 = p(), c1 = p(), p())), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c7, c8, c6, c1])

    it 'more complicated 5', ->
      comp = div(comp1 = div(p(), div(div(c3 = p(), c5 = p(), c2=p()), c9 = p()), c7 = p(), div(c8 = p(), div(c6 = p(), c1 = p(), p())), p()))
      expect(getComponentsBetween(c5, c1)).to.deep.equal([c5, c2, c9, c7, c8, c6, c1])

    it 'more complicated 6', ->
      comp = div(comp1 = div(p(23), c11 = div(div(c3 = p(3), c5 = p(5), c2=p(2)), c9 = p(9)), c7 = p(7),
        div(c8 = p(8), div(c6 = p(6), c1 = p(1), p(21))), p(22)))
      comp.mount()
      expect(getComponentsBetween(c3, c1)).to.deep.equal([c11, c7, c8, c6, c1])
      comp.unmount()


    it 'more complicated 7', ->
      comp = div(comp1 = div(p(23), c11 = div(div(c3 = p(3), c5 = p(5), c2=p(2)), c9 = p(9)), c7 = p(7),
        c12 = div(c8 = p(8), div(c6 = p(6), p(21), c1 = p(1))), p(22)))
      comp.mount()
      expect(getComponentsBetween(c3, c1)).to.deep.equal([c11, c7, c12])
      comp.unmount()
