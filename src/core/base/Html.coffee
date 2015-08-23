{funcString, newLine} = require '../../util'

module.exports = class Html extends Text
  createDom: -> @node = document.createDocumenutFragment(@processText()); @

  updateDom: ->
    if !@text then return @
    @node = document.createDocumenutFragment @processText()
    @

  toString: (indent=2, noNewLine) -> newLine("<Html #{funcString(@text)}/>", indent, noNewLine)
