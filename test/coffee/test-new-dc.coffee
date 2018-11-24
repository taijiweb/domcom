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

debugger

describe "some simple tests", ->
  afterEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

      # tell React do not warn about this
      demoNode._reactRootContainer = undefined
    return

  describe 'mount simple dc components', ->
    it 'should dc generate a component', ->
      comp = dc()
      expect(isComponent(comp)).to.be.true

    it 'dc() chaining call', ->
      data = {x:1, y:2}
      view = (data) ->
        {x, y} =  data
        return ['div', ['div', x], ['div', y]]
      comp = dc {data, view}

    it 'config.view should work 1', ->
      view = -> ['div', {}, 'hello domcom mvc']
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div>hello domcom mvc</div>'

    it 'config.view should work 2', ->
      view = ['div', 'hello domcom mvc']
      comp = dc({view})
      comp.mount('#demo')

    it 'normalizeItem should work', ->
      view = ['div', 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{},["hello domcom mvc"]]'

    it 'should work  on view function', ->
      view = (data) -> ['div', 'hello', data]
      comp = dc({data:" data", view})
      view = comp.getView()
      item = normalizeItem(view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{},["hello"," data"]]'
      comp.mount('#demo')

    it 'view function should work on data', ->
      view = (data) -> ['div', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div>hello</div>'

    it 'tag.classes#id should work', ->
      view = (data) -> ['div.btn#button1', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div id="button1" class="btn">hello</div>'

    it 'tag.classes#id::css should work 1', ->
      view = (data) -> ['div.btn#button1##width:20px;', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div id="button1" class="btn" style="width: 20px;">hello</div>'

    it 'tag.classes#id::css should work 2', ->
      view = (data) -> ['.btn#button1##width:20px;color:red', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div id="button1" class="btn" style="width: 20px; color: red;">hello</div>'

    it 'inputtype.classes#id::css should work 2', ->
      view = -> ['text.btn#button1##width:200px;color:red']
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<input id="button1" type="text" class="btn" style="width: 200px; color: red;">'

    it 'password.classes#id::css should work', ->
      view = -> ['password.btn#button1##width:200px;color:red']
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<input id="button1" type="password" class="btn" style="width: 200px; color: red;">'