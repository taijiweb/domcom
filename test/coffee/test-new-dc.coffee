{expect, iit, idescribe, nit, ndescribe, newDemoNode} = require('bdd-test-helper')

{newDemoNode} = require('./helper')

{
bindings, see
Tag, Text, List, txt, list
p, div, Html, html
classFn, styleFrom,
Nothing
isComponent
} = dc

{a_} = bindings({a: 1, b: 2})

describe "test-base-component", ->
  afterEach ->
    dc.reset()

  describe 'update baseComponent', ->
    it 'should dc generate a component', ->
      comp = dc()
      expect(isComponent(comp)).to.be.true

    it 'dc() chaining call', ->
      comp = dc.div(at('x y')).data({x, y})

