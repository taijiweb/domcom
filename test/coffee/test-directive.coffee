{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeItem, normalizeDomElement} = require 'dc-util'

import React, {Component} from 'react'
import ReactDom from 'react-dom'
dc.addReactProxy React, ReactDom, Component

import Button from '@material-ui/core/Button'

describe "test-directive", ->
  beforeEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

    # tell React do not warn about this
    demoNode._reactRootContainer = undefined
    return

  describe 'model directive', ->
    iit 'should process model directive', ->
      view = ->
        ['div', ['text', {'#':[[dc.model, 'message']]}], ['p', this.message]]
      comp = dc({view, message:'hello'})
      comp.mount('#demo')

    iit 'should process view event without model directive', ->
      view = () ->
        onChange = (event) =>
          comp.message = event.target.value
        ['div', ['text', {value: this.message, onChange}], ['p', this.message]]
      message = 'hello'
      comp = dc({view, message})
      comp.mount('#demo')
