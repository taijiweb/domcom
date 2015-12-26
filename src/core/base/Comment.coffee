BaseComponent = require './BaseComponent'
Text = require './Text'

{funcString, newLine} = require 'dc-util'

{domValue} = require '../../dom-util'

module.exports = class Comment extends Text
  constructor: (text) ->
    super(text)

  createDom: ->
    @textValid = true
    text = domValue(@text)
    node = document.createComment(text)
    @setNode(node)
    @setFirstNode(node)
    @cacheText = text
    @node

  updateDom: ->
    if @textValid
      return @node

    @textValid = true
    text = domValue(@text)
    if text != @cacheText
      parentNode = node.parentNode
      if parentNode
        parentNode.removeChild(node)
      node = document.createComment(text)
      @setNode(node)
      @setFirstNode(node)
      @cacheText = text
    @node

  toString: (indent=2, addNewLine) ->
    newLine("<Comment #{funcString(@text)}/>", indent, addNewLine)


