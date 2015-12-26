BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require 'dc-util'
{domField, domValue} = require '../../dom-util'

if 'textContent' of document.documentElement
  hasTextContent = true
else
  hasTextContent = false

exports = module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    @text = text = domField(text)

    me = @
    if typeof text == 'function'
      text.onInvalidate ->
        me.textValid = false
        me.invalidate()

    @family = {}
    @family[@dcid] = true
    @

  createDom: ->
    @textValid = true
    text = domValue(@text)
    node = document.createTextNode(text)
    @setNode(node)
    @setFirstNode(node)
    @cacheText = text
    node

  updateDom: ->
    {node} = @
    if @textValid
      return node
    else
      @textValid = true
      text = domValue(@text)
      if text!=@cacheText
        if hasTextContent
          node.textContent = text
        else
          node.innerText = text
        @cacheText = text
      node

  clone: -> (new @constructor(@text)).copyEventListeners(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)
