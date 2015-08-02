VirtualNode = require './VirtualNode'

module.exports = class VirtualNoop extends VirtualNode
  constructor: (@baseComponent) ->
    @node = @baseComponent.node
    @isNoop = true

  isActive: -> false

  createDom: -> @baseComponent.node

  updateDom: -> @node