VirtualNode = require './VirtualNode'

module.exports = class VirtualDomNodeList extends VirtualNode
  constructor: (@baseComponent, children) ->
    super

    @vtreeRootComponent = null
    @children = children or null

  isActive: -> @vtreeRootComponent or @children

  createDom: -> @

  updateDom: -> @renderChildrenDom('update')

  renderChildrenDom: (method) ->
    if !@children then return
    children = []
    for child in @children
      child[method]()
      childComponent = child.baseComponent
      if child.isActive() then children.push childComponent.vtree
    if !children.length then @children = null
    else @children = children
