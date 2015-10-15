{funcString, newLine} = require '../../util'

module.exports = class Comment extends Text
  createDom: (parentNode, nextNode) -> @node = document.createComment(@processText()); @node
  updateDom: (parentNode, nextNode) -> @text and @node.data = @processText(); @node

  toString: (indent=2, addNewLine) -> newLine("<Comment #{funcString(@text)}/>", indent, addNewLine)


