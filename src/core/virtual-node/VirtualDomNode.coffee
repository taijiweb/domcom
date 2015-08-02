VirtualNode = require './VirtualNode'

module.exports = class VirtualDomNode extends VirtualNode

  isActive: -> @vtreeRootComponent or @children

  createDom: -> @  # this should not be called, because @node exists

  updateDom: -> @baseComponent.renderProperties(); @
