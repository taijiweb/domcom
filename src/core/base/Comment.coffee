BaseComponent = require './BaseComponent'
{constructTextLikeComponent} = require './Text'

{funcString, newLine} = require 'dc-util'

{domValue} = require '../../dom-util'

module.exports = class Comment extends BaseComponent
  constructor: (text) ->
    super()
    constructTextLikeComponent.call(this, text)

  createDom: ->
    @textValid = true
    text = domValue(@text)
    node = document.createComment(text)
    @setNode(node)
    @setFirstNode(node)
    @cacheText = text
    @node

  updateDom: ->
    if !@textValid then return @node
    @textValid = true
    text = domValue(@text)
    if text != @cacheText
      if @node.parentNode
        @removeNode()
      node = document.createComment(text)
      @setNode(node)
      @setFirstNode(node)
      @cacheText = text
    @node

  toString: (indent=2, addNewLine) ->
    newLine("<Comment #{funcString(@text)}/>", indent, addNewLine)


