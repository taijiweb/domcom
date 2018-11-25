{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'
{isComponent} = dc

describe "some simple tests", ->
  beforeEach ->
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

    it 'simple data view', ->
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

    it 'class in both tag string and props', ->
      view = ['div.btn', {classes:"active"}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"className":"btn active"},["hello domcom mvc"]]'

    it 'style in both tag string and props 1', ->
      view = ['div##width:100;', {css:"height:200px"}, 'hello domcom mvc']
      item = normalizeItem(view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"style":{"width":"100","height":"200px"}},["hello domcom mvc"]]'

    it 'style and css in both tag string and props 2', ->
      red = 'red'
      view = ['div##width:100;', {css:"height:200px", style:{backgroundColor:red}}, 'hello domcom mvc']
      item = normalizeItem(view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"style":{"width":"100","height":"200px","backgroundColor":"red"}},["hello domcom mvc"]]'

    it 'camelCase style and css in both tag string and props 1', ->
      red = 'red'
      view = ['div##width:100;', {css:"height:200px", style:{'background-color':red}}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"style":{"width":"100","height":"200px","backgroundColor":"red"}},["hello domcom mvc"]]'

    it 'multiple props 1', ->
      red = 'red'
      view = ['div##width:100;', {css:"height:200px"}, {'background-color':red}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"backgroundColor":"red","style":{"width":"100","height":"200px"}},["hello domcom mvc"]]'

    it 'classname with true value', ->
      red = 'red'
      active = true
      view = ['div##width:100;', {classes:{active}}, {'background-color':red}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"backgroundColor":"red","className":"active","style":{"width":"100"}},["hello domcom mvc"]]'

    it 'classname with falsy value', ->
      red = 'red'
      active = false
      view = ['div##width:100;', {classes:{active}}, {'background-color':red}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item)
      expect(s).to.equal '["div",{"backgroundColor":"red","style":{"width":"100"}},["hello domcom mvc"]]'

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
      expect(node.innerHTML).to.equal '<div class="btn" id="button1">hello</div>'

    it 'tag.classes#id::css should work 1', ->
      view = (data) -> ['div.btn#button1##width:20px;', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div class="btn" id="button1" style="width: 20px;">hello</div>'

    it 'tag.classes#id::css should work 2', ->
      view = (data) -> ['.btn#button1##width:20px;color:red', 'hello', data]
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<div class="btn" id="button1" style="width: 20px; color: red;">hello</div>'

    it 'inputtype.classes#id::css should work 2', ->
      view = -> ['text.btn#button1##width:200px;color:red']
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<input class="btn" id="button1" type="text" style="width: 200px; color: red;">'

    it 'password.classes#id::css should work', ->
      view = -> ['password.btn#button1##width:200px;color:red']
      comp = dc({view})
      comp.mount('#demo')
      node = document.querySelector('#demo')
      expect(node.innerHTML).to.equal '<input class="btn" id="button1" type="password" style="width: 200px; color: red;">'


  describe 'mount embedded dc components', ->
    it 'should mount  embedded component', ->
      data = {message:"I'm embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view, needProxy:true})
      comp = dc({view:embedded})
      debugger
      comp.mount('#demo')
      data.message = "new embedded message"
      comp.update()

    it 'should mount the same embedded component', ->
      data = {message:"I'm embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view})
      comp = dc({view:['div', embedded, embedded]})
      debugger
      comp.mount('#demo')
      data.message = "new embedded message"
      comp.update()

    it 'should mount the same proxiedembedded component', ->
      data = {message:"I'm embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view, needProxy:true})
      comp = dc({view:['div', embedded, embedded]})
      debugger
      comp.mount('#demo')
      data.message = "new embedded message"
      comp.update()

