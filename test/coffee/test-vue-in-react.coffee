{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

import ReactDom from 'react-dom'

{newDemoNode} = require './helper'
import HelloVue from '../react-vue-components/HelloVue'


{normalizeDomElement} = require '../../src/dom-util'
{
mvc
} = dc

describe "test vue in react", ->
  afterEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

      # tell React do not warn about this
      demoNode._reactRootContainer = undefined
      debugger
    return


  describe 'update Vue in React', ->

    it 'should mount simple vue in react div block', ->
      dr = dc.react()
      expect(dr).to.be.instanceof(dc.React)
      dv = dc.vue()
      comp = dr.div(dv.div({key:0}, 'hello', dv.span(' vue in react')))
      expect(comp).to.be.instanceof(dc.ReactBlock)
      comp.mount('#demo')


    it 'should mount simple vue component in react div block', ->
      dr = dc.react()
      expect(dr).to.be.instanceof(dc.React)
      dv = dc.vue()
      debugger
      comp = dr.div(dv.by(HelloVue)({props:{who:'nsy'}}))
      expect(comp).to.be.instanceof(dc.ReactBlock)
      comp.mount('#demo')