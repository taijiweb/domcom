VirtualNode = require './VirtualNode'

module.exports = class VirtualText extends VirtualNode
  constructor: (@baseComponent) ->
    super
    @text = @baseComponent.text
    @node = null

  isActive: -> @text or @vtreeRootComponent

  setParentNode: (node) ->
    @parentNode = node
    return

  processText: ->
    text = @text
    if typeof text == 'function' then text = text()
    else
      @text = null
      @isNoop = !@vtreeRootComponent and !@hasMountCallback()
    text

  createDom: -> @node = document.createTextNode(@processText()); @

  updateDom: -> @text? and @node.textContent = @processText(); @