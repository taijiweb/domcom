BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require '../../util'
{domValue} = require '../../dom-util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    me = @
    @text = text = domValue(text)
    if typeof text == 'function'
      text.onInvalidate -> me.activeInContainer()
    super(options)

  firstDomNode: -> @node

  processText: ->
    if typeof @text == 'function'
      text = @text()
      @isNoop = !@text.invalid and !@mountCallbackComponentList.length
    else
      text = @text
      @isNoop = !@mountCallbackComponentList.length
    text

  createDom: -> @node = document.createTextNode(@processText()); @

  updateDom: ->
    if (text=@processText())!=@node.textContent
      @node.textContent = text;
    @

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, noNewLine) -> newLine(funcString(@text), indent, noNewLine)