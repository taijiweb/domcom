{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeItem, normalizeDomElement} = require 'dc-util'

import React, {Component} from 'react'
import ReactDom from 'react-dom'
dc.addReactProxy React, ReactDom, Component

import Button from '@material-ui/core/Button'


describe "test-new-dc", ->
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
      debugger
      expect(comp instanceof dc.Component).to.be.true

    it ' dc should check fields', ->
      expect(-> dc {dcid:'should error'}).to.throw dc.DomcomError

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

    it 'tagstr follow ReactClass', ->
      red = 'red'
      active = false
      view = [Button, '##width:100;', {classes:{active}}, {'background-color':red}, 'hello domcom mvc']
      comp = dc({view})
      item = normalizeItem(comp.view)
      s = JSON.stringify(item[1...])
      # will not camelcase in props  in ReactClass element
      expect(s).to.equal '[{"background-color":"red","style":{"width":"100"}},["hello domcom mvc"]]'

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
    it 'should mount  embedded component and auto watch it', ->
      data = {message:"I am embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view})
      comp = dc({view:embedded})
      comp.mount('#demo')
      expect(comp.node.innerHTML).to.equal 'I am embedded'
      data.message = "new embedded message"
      comp.update()
      expect(comp.node.innerHTML).to.equal "new embedded message"

    it 'embedded component will not auto update if stop watching it', ->
      data = {message:"I am embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view})
      embedded.stopWatch()
      comp = dc({view:embedded})
      comp.mount('#demo')
      expect(comp.node.innerHTML).to.equal 'I am embedded'
      data.message = "new embedded message"
      comp.update()
      expect(comp.node.innerHTML).to.equal "I am embedded"

    it 'should NOT mount the same one component in different places', ->
      data = {message:"I am embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view})
      comp = dc({view:['div', embedded, embedded]})
      window.onerror = (error) ->
        throw error
      expect(-> comp.mount('#demo')).to.throw()

    it 'should mount the embedded component copy', ->
      data = {message:"I am embedded"}
      view = (data) -> ['div', data.message]
      embedded = dc({data, view})
      debugger
      embedded.watch()
      embedded2 = embedded.copy()
      debugger
      embedded2.watch()
      comp = dc({view:['div', embedded, embedded2]})
      comp.mount('#demo')
      console.log('should mount the same embedded component', comp.node)
      expect(comp.node.innerHTML).to.equal '<div>I am embedded</div><div>I am embedded</div>'
      data.message = "new embedded message"
      expect(comp.node.innerHTML).to.equal '<div>new embedded message</div><div>new embedded message</div>'

    it 'should mount the embedded component copy 2', ->
      data = {show1:true, message1:"I am embedded 1", message2:"I am embedded 2"}
      view = (data) ->
        if data.show1
          ['div', data.message1]
        else
          ['div', data.message2]
      embedded = dc({data, view})
      embedded.watch()
      embedded2 = embedded.copy().watch()
      comp = dc({view:['div', embedded, embedded2]})
      comp.mount('#demo')
      expect(embedded.node.innerHTML).to.equal 'I am embedded 1'
      expect(comp.node.innerHTML).to.equal '<div>I am embedded 1</div><div>I am embedded 1</div>'
      data.show1 = false
      expect(comp.node.innerHTML).to.equal '<div>I am embedded 2</div><div>I am embedded 2</div>'

    it 'should process rebol style function call in view item', ->
      if_ = (test, then_, else_) ->
        if test
          then_
        else
          else_
      item = normalizeItem [if_, 0, 1, 2]

      expect(item).to.equal '2'

