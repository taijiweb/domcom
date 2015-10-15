BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require '../../util'
{domValue} = require '../../dom-util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    me = @
    @text = text = domValue(text)
    if typeof text == 'function'
      text.onInvalidate -> me.invalidate()
    super(options)
    @family = Object.create(null)
    @family[@dcid] = true
    @

  processText: ->
    if typeof @text == 'function'then domValue @text()
    else @text

  createDom: ->
    @firstNode = @node = document.createTextNode(@processText())
    @node

  updateDom: ->
    if (text=@processText())!=@node.textContent
      @node.textContent = text
    @node

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)