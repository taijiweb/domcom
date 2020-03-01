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

  describe 'model directive 1', ->
    it 'should process model directive', ->
      view = ->
        [['text', {$model:'message'}], ['p', @message]]
      comp = dc({view, message:'hello'})
      comp.mount('#demo')

    it 'should process model directive 2', ->
      view = ->
        ['div', ['text', {$model:'message'}], ['p', this.message]]
      comp = dc({view, message:'hello'})
      comp.mount('#demo')

    it 'should process model directive 3', ->
      view = ->
        ['div', ['text', 'message'], ['p', this.message]]
      comp = dc({view, message:'hello'})
      comp.mount('#demo')

    it 'should process view event without model directive', ->
      view = () ->
        onChange = (event) =>
          comp.message = event.target.value
        ['div', ['text', {value: this.message, onChange}], ['p', this.message]]
      message = 'hello'
      comp = dc({view, message})
      comp.mount('#demo')
