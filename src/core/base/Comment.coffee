{funcString, newLine} = require '../../util'

module.exports = class Comment extends Text
  createDom: -> @node = document.createComment(@processText()); @node
  updateDom: -> @text and @node.data = @processText(); @node

  toString: (indent=2, noNewLine) -> newLine("<Comment #{funcString(@text)}/>", indent, noNewLine)


