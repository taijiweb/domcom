###*test-component
###
{expect, iit, idescribe, nit, ndescribe, rtimeout, rinterval} = require('bdd-test-helper')

{isComponent} = dc

describe "test dc", ->
  describe 'dc(document)', ->
    it 'dc(document) should be Component', ->
      expect(!isComponent(dc(document))).to.equal true

    it 'should cache DomComponent', ->
      expect(dc(document)).to.equal dc(document)

    it 'dc(document).bind should be a function', ->
      x = 0
      dc(document).bind('onclick', -> x = 1)


