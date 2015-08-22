{funcString, newLine} = require '../../util'

module.exports = class Comment extends Text
  createDom: -> @node = document.createComment(@processText()); @
  updateDom: -> @text and @node.data = @processText(); @

  toString: (indent=2, noNewLine) -> newLine("<Comment #{funcString(@text)}/>", indent, noNewLine)


