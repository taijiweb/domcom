VirtualNode = require './VirtualNode'

module.exports = class VirtualNothing extends VirtualNode
  constructor: (@baseComponent) ->
    super

  isActive: -> false

  setParentNode: (node) -> @baseComponent.parentNode = node

  createDom: ->

  updateDom: ->