###*test-component
###
{expect, iit, idescribe, nit, ndescribe, rtimeout, rinterval} = require('./helper')

{isComponent} = dc = require 'domcom/src/index'

ndescribe "test dc", ->
  describe 'dc(document)', ->
    it 'dc(document) should be Component', ->
      expect(!!isComponent(dc(document))).to.equal true
    it 'should cache DomNodeComponent', ->
      x = dc(document)
      expect(dc(document)).to.equal x
      expect(dc(document).dcId).to.equal x.dcId
      expect(dc(document).dcId).to.equal defined

    it 'dc(document).bind should be a function', ->
      x = 0
      dc(document).bind('onclick', -> x=1)
      dc(document).node.onclick()
      expect(x).to.equal 1


