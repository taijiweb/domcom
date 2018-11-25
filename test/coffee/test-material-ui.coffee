{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'
{isComponent} = dc

import Button from '@material-ui/core/Button'

describe "some simple tests", ->
  beforeEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

      # tell React do not warn about this
      demoNode._reactRootContainer = undefined
    return

  describe 'mount some material-ui dc components', ->
     iit 'simple material-ui Button', ->
      view =  ['div'
        [Button, {variant:"contained", color:"primary"},'primary'],
        [Button, 'Default'],
        [Button, {variant:"dashed", color:"secondary", disabled:true},'secondary'],
        [Button, {variant:"danger", color:"danger"},'danger']
      ]
      comp = dc {view}
      comp.mount('#demo')