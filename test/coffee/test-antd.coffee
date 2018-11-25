{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'
{isComponent} = dc

import Chip from '@material-ui/core/Chip'

import { Button } from 'antd'

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
     it 'simple Button', ->
      view =  ['div'
        [Button, {type:"primary"},'Default'],
        [Button, 'Default'],
        [Button, {type:"dashed"},'dashed'],
        [Button, {type:"danger"},'danger']
      ]

      comp = dc {view}
      comp.mount('#demo')