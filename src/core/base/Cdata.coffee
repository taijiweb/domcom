BaseComponent = require('./BaseComponent')
Text = require('./Text')

{funcString, newLine} = require('dc-util')

{domValue} = require('../../dom-util')

module.exports = class Cdata extends Text
  constructor: (text) ->
    super(text)

  ###
    this operation is not supported in html document
  ###
  createDom: (parentNode, nextNode) ->
    @node = document.createCDATASection(domValue(@text))
    @node

  updateDom: (parentNode, nextNode) ->
    @text and @node.data = domValue(@text)
    @node

  toString: (indent=2, addNewLine) -> newLine("<CDATA #{funcString(@text)}/>", indent, addNewLine)


