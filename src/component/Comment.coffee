import BaseComponent from './BaseComponent'
import Text from './Text'

{funcString, newLine} = require 'dc-util'

{domValue} = require '../dom-util'

export default module.exports = class Comment extends Text
  constructor: (text) ->
    super(text)

  createDom: ->
    this.valid = true
    text = domValue(this.text, this)
    node = document.createComment(text)
    this.node = this.firstNode = node
    this.cacheText = text
    this.node

  updateDom: ->
    this.valid = true
    text = domValue(this.text, this)
    if text != this.cacheText
      parentNode = node.parentNode
      if parentNode
        parentNode.removeChild(node)
      node = document.createComment(text)
      this.node = this.firstNode = node
      this.cacheText = text
    this.node

  toString: (indent=2, addNewLine) ->
    newLine("<Comment #{funcString(this.text)}/>", indent, addNewLine)


