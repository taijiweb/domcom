{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{newDemoNode} = require './helper'

{
Tag, Text, List, txt, list
p, div, Html, html
classFn, styleFrom,
Nothing
isComponent
getters
} = dc

describe "test-base-component", ->
  afterEach ->
    dc.reset()

  describe 'update BaseBlock', ->
    it 'should dc generate a component', ->
      comp = dc()
      expect(isComponent(comp)).to.be.true

    it 'dc() chaining call', ->
      data = {x:1, y:2}
      view = (data) ->
        {x, y} =  data
        return div(div(x), div(y))
      comp = dc.mvc(view, data)

    it 'dc.react should be an backend', ->
      dr = dc.react()
      expect(dr).to.be.instanceof(dc.React)
