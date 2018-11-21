{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

import ReactDom from 'react-dom'

{newDemoNode} = require './helper'
import HelloReact from '../react-vue-components/HelloReact'

{normalizeDomElement} = require '../../src/dom-util'
{div
mvc
} = dc

describe "test react in vue", ->
  this.timeout(2000*10000)
  afterEach ->
#    demoNode = normalizeDomElement('#demo')
#    if demoNode.childNodes.length
#      node = demoNode.childNodes[0]
#      demoNode.removeChild(node)
#
#      # tell React do not warn about this
#      demoNode._reactRootContainer = undefined
#      debugger
    return


  describe 'update React in Vue', ->

    iit 'should mount simple react in vue div block', ->
      this.timeout(2000*10000)
      dv = dc.vue
      dr = dc.react
      blk = div({key:0}, 'hello')
      drb = dr blk
      comp = dv div(drb)
      comp.mount('#demo')

    it 'should mount simple react component in vue div block', ->
      dv = dc.vue()
      expect(dv).to.be.instanceof(dc.Vue)
      dr = dc.react()
      comp = dv.div(dr.by(HelloReact)({who:'nsy'}))
      expect(comp).to.be.instanceof(dc.VueBlock)
      comp.mount('#demo')