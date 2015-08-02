# wrong idea, replace with component.clone()

toComponent = require './toComponent'
TransformComponent = require './TransformComponent'

module.exports = class Clone extends TransformComponent
  constructor: (srcComponent, options) ->
    super(options)
    @content = content = srcComponent
    content.container = @
    @getVirtualTree = =>
      content.index = null
      content.setParentNode @parentNode
      vtree = content.getVirtualTree()
      vtree.vtreeRootComponent = @
      @vtree = vtree
    this