{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'

{normalizeDomElement} = require '../../src/dom-util'
{normalizeItem} = require 'dc-util'
{isComponent} = dc

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
    debugger
    comp.mount('#demo')