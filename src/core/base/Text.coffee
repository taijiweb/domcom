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
  ###
  https://github.com/ajaxorg/ace/blob/master/lib/ace/lib/dom.js
  if ("textContent" in document.documentElement) {
      exports.setInnerText = function(el, innerText) {
          el.textContent = innerText;
      };

      exports.getInnerText = function(el) {
          return el.textContent;
      };
  }
  else {
      exports.setInnerText = function(el, innerText) {
          el.innerText = innerText;
      };

      exports.getInnerText = function(el) {
          return el.innerText;
      };
  }
  ###
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

