{VirtualHtml} = require '../virtual-node'
{funcString, newLine} = require '../../util'

module.exports = class Html extends Text
  VirtualNodeClass: VirtualHtml

  toString: (indent=2, noNewLine) -> newLine("<Html #{funcString(@text)}/>", indent, noNewLine)
