{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeItem, normalizeDomElement} = require 'dc-util'
{isComponent} = dc

import React, {Component} from 'react'
import ReactDom from 'react-dom'
dc.addReactProxy React, ReactDom, Component

import Chip from '@material-ui/core/Chip'

import { Button } from 'antd'

describe "test-antd", ->
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