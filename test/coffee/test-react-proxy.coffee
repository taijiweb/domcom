{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

import ReactDom from 'react-dom'

{newDemoNode} = require './helper'

{normalizeDomElement} = require '../../src/dom-util'
{
Tag, Text, List, txt, list
p, div, Html, html, if_
classFn, styleFrom,
Nothing
isComponent
getters
} = dc

describe "test react proxy", ->
  beforeEach ->
    demoNode = normalizeDomElement('#demo2')

    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

      # tell React do not warn about this
      demoNode._reactRootContainer = undefined
#      ReactDom.unmountComponentAtNode(normalizeDomElement('#demo2'))
    demoNode._reactRootContainer = undefined
    return


  describe 'update ReactBlock', ->

    it 'should mount simple react div block 1', ->
      comp = dc {view: ['div', 'hello']}
      comp.mount('#demo2')

    it 'should mount embedded react div block 2', ->
      comp = dc {view: ['div', {}, ['div', {key:1}, 'hello']]}
      comp.mount('#demo2')
      comp.update()

    it 'should mount react dc + div block', ->
      data = {showing:true, message:'dc'}
      view = (data) ->
        if data.showing
          return ['div', data.message]
        else
          return null
      comp = dc {data, view}
      data.showing = true
      data.message = 'hello dc'
      debugger
      comp.mount('#demo2')
      data.showing = false
      comp.update()


    it 'should mount and update react dc + if-else div block 1', ->
      data = {showing:true, message1: 'hello dc 1', message2: 'hello dc 2'}
      view = (data) ->
        if data.showing
          ['div', data.message1]
        else
          ['div', data.message2]
      comp = dc {data, view}
      data.showing = true
      debugger
      comp.mount('#demo2')
      data.showing = false
      debugger
      comp.update()

    it 'should mount and update react dc + if_ div block 2', ->
      data = {showing:true, message1: 'hello dc 1', message2:'hello dc 2'}
      view = () ->
        if this.showing
          ['div', data.message1]
        else
          ['div', data.message2]
      comp = dc {data, view}
      data.showing = true
      comp.mount('#demo2')
      data.showing = false
      comp.update()
      data.showing = true
      comp.update()
      data.showing = false
      comp.update()
