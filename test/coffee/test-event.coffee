{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeItem, normalizeDomElement} = require 'dc-util'
{isComponent} = dc

import React, {Component} from 'react'
import ReactDom from 'react-dom'
dc.addReactProxy React, ReactDom, Component

describe "test events", ->
  beforeEach ->
    demoNode = normalizeDomElement('#demo')
    if demoNode.childNodes.length
      node = demoNode.childNodes[0]
      demoNode.removeChild(node)

      # tell React do not warn about this
      demoNode._reactRootContainer = undefined
    return

  it 'should process onClick', ->
    data = {message:"click me!"}
    onClick = ->
      data.message = "you clicked!"
      dc.update()
    view = (data) -> ['div', {onClick}, data.message]
    embedded = dc({data, view, needProxy:true})
    comp = dc({view:embedded})
    comp.mount('#demo')