{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{newDemoNode} = require './helper'
{normalizeDomElement} = require '../../src/dom-util'

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
#    demoNode = normalizeDomElement('#demo2')
#    if demoNode.childNodes.length
#      node = demoNode.childNodes[0]
#      demoNode.removeChild(node)
#
#      # tell React do not warn about this
#      demoNode._reactRootContainer = undefined
#      debugger
    #      ReactDom.unmountComponentAtNode(normalizeDomElement('#demo2'))
    return

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

    iit 'config.render should work', ->
      render = (h) ->
        h('div', {}, 'hello domcom mvc')
      comp = dc({render})
      comp.mount('#demo2')

    it 'config.view should work', ->
      view = ->
        el('div', {}, 'hello domcom mvc')
      comp = dc({view})
      comp.mount('#demo2')
