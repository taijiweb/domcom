{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'

{newDemoNode} = require './helper'

{
Tag, Text, List, txt, list
p, div, Html, html, if_
classFn, styleFrom,
Nothing
isComponent
getters
mvc
} = dc

describe "test vue back end", ->
  afterEach ->
    # the mounted #demo2 has been modified by Vue mounting,  the id demo2 does not exists anymore
    demoNode = normalizeDomElement('#demo2')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)
    dc.reset()

  describe 'update VueBlock', ->

    it 'should mount simple vue div block', ->
      dr = dc.vue()
      expect(dr).to.be.instanceof(dc.Vue)
      {div} = dr
      comp = div({}, ['hello'])
      expect(comp).to.be.instanceof(dc.VueBlock)
      comp.mount('#demo2')

    it 'should mount embedded vue div block', ->
      dr = dc.vue()
      {div} = dr
      comp = div({}, div({key:1}, div({key:1}, 'hello')))
      expect(comp).to.be.instanceof(dc.VueBlock)
      comp.mount('#demo2')
      comp.update()

    it 'should mount vue mvc + div block', ->
      dv = dc.vue()
      {div} = dv
      view = () -> if_(this.showing, div(this.message))
      comp = mvc(view)
      comp.showing = true
      comp.message = 'hello mvc'
      comp.mount('#demo2')
      comp.message = 'hello mvc 2'
      comp.showing = false
      comp.update()

    it 'should mount and update vue mvc + if_ div block 1', ->
      dr = dc.vue()
      {div} = dr
      view = () -> if_(this.showing, div(this.message1), div(this.message2))
      comp = mvc(view)
      comp.showing = true
      comp.message1 = 'hello mvc 1'
      comp.message2 = 'hello mvc 2'
      comp.mount('#demo2')
      comp.showing = false
      comp.update()

    it 'should mount and update vue mvc + if_ div block 2', ->
      dr = dc.vue()
      {div} = dr
      view = () -> if_(this.showing, div(this.message1))
      comp = mvc(view)
      comp.showing = true
      comp.message1 = 'hello mvc 1'
      comp.mount('#demo2')
      comp.showing = false
      comp.update()


    it 'should mount and update vue mvc + if_ div block 3', ->
      dr = dc.vue()
      {div} = dr
      view = () -> if_(this.showing, div(this.message1), div(this.message2))
      comp = mvc(view)
      comp.showing = true
      comp.message1 = 'hello mvc 1'
      comp.message2 = 'hello mvc 2'
      comp.mount('#demo2')
      comp.showing = false
      comp.update()
      comp.showing = true
      comp.update()
      comp.showing = false
      comp.update()


