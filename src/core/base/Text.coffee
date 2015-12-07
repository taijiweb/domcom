BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require 'dc-util'
{domField, domValue} = require '../../dom-util'

exports = module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    constructTextLikeComponent.call(this, text)

  createDom: ->
    @textValid = true
    text = domValue(@text)
    node = document.createTextNode(text)
    @setNode(node)
    @setFirstNode(node)
    @cacheText = text
    node

  updateDom: ->
    if @textValid
      return @node

    @textValid = true
    text = domValue(@text)
    if text!=@cacheText
      node = @node
      parentNode = node.parentNode
      if parentNode
        parentNode.removeChild(node)
      node = document.createTextNode(text)
      @setNode(node)
      @setFirstNode(node)
      @cacheText = text
    @node

  clone: -> (new @constructor(@text)).copyEventListeners(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)

exports.constructTextLikeComponent = constructTextLikeComponent = (text) ->
  me = @
  @text = text = domField(text)

  if typeof text == 'function'
    text.onInvalidate ->
      me.textValid = false
      me.invalidate()

  @family = {}
  @family[@dcid] = true
  @

