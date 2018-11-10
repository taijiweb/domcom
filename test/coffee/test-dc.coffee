###*test-component
###
{expect, iit, idescribe, nit, ndescribe, rtimeout, rinterval} = require 'bdd-test-helper'

{isComponent} = dc

describe "test dc", ->
  describe 'dc(document)', ->
    it 'dc(document) should be Component', ->
      expect(!isComponent(dc(document))).to.equal(true)

    nit 'should cache DomComponent', ->
      expect(dc(document)).to.equal dc(document)

    nit 'dc(document).bind should be a function', ->
      x = 0
      #now dc(...) will not generate ComNode
      dc(document).bind('onclick', -> x = 1)


    nit 'dc() chaining call', ->
      #pipe is a deprecated idea, will not to implement it.
      comp = dc.div(at('x y')).data({x, y})
