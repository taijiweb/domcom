BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require 'dc-util'
{domField, domValue} = require '../../dom-util'

exports = module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    constructTextLikeComponent.call(this, text)

  createDom: ->
    @textValid = true
    @firstNode = @node = document.createTextNode(domValue(@text))
    @node

  updateDom: ->
    if !@textValid then return @node
    @textValid = true
    text = domValue(@text)
    if text!=@cacheText
      if @node.parentNode  then @removeNode()
      @node = document.createTextNode(text)
      @firstNode = @node
      @cacheText = text
    @node

  clone: -> (new @constructor(@text)).copyEventListeners(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)

exports.constructTextLikeComponent = constructTextLikeComponent = (text) ->
  me = @
  @text = text = domField(text)
  if typeof text == 'function'
    text.onInvalidate -> me.invalidate()
  @family = {}
  @family[@dcid] = true
  @

