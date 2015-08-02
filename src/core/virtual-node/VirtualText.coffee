VirtualNode = require './VirtualNode'
VirtualNoop = require './VirtualNoop'

module.exports = class VirtualText extends VirtualNode
  constructor: (@baseComponent) ->
    super
    @text = @baseComponent.text
    @node = null

  isActive: -> @text or @vtreeRootComponent

  processText: ->
    text = @text
    if typeof text == 'function' then text = text()
    else
      @text = null
      @isNoop = !@vtreeRootComponent and !@hasMountCallback()
    text

  createDom: -> @baseComponent.node = @node = document.createTextNode(@processText()); @

  updateDom: -> @text? and @node.textContent = @processText(); @