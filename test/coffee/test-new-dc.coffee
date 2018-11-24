{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{newDemoNode} = require './helper'
{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'

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

    it 'config.render should work', ->
      render = (h) ->
        h('div', {}, 'hello domcom mvc')
      comp = dc({render})
      comp.mount('#demo2')

    iit 'config.view should work', ->
      view = ['div', 'hello domcom mvc']
      comp = dc({view})
      comp.mount('#demo2')

    it 'proxy.normalizeItem should work', ->
      view = ['div', 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"className":{}},["hello domcom mvc"]]'
