{VirtualComment} = require '../virtual-node'
{funcString, newLine} = require '../../util'

module.exports = class Comment extends Text
  VirtualNodeClass: VirtualComment
  toString: (indent=2, noNewLine) -> newLine("<Comment #{funcString(@text)}/>", indent, noNewLine)


