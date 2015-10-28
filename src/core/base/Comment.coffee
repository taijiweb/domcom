BaseComponent = require './BaseComponent'
{constructTextLikeComponent} = require './Text'

{funcString, newLine} = require '../../util'

{domValue} = require '../../dom-util'

module.exports = class Comment extends BaseComponent
  constructor: (text) ->
    super()
    constructTextLikeComponent.call(this, text)

  createDom: (parentNode, nextNode) -> @node = document.createComment(domValue(@text)); @node
  updateDom: (parentNode, nextNode) -> @text and @node.data = domValue(@text); @node

  toString: (indent=2, addNewLine) -> newLine("<Comment #{funcString(@text)}/>", indent, addNewLine)


