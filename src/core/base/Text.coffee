BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require '../../util'
{domValue} = require '../../dom-util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    self = @
    @text = domValue(text, -> self.invalidate())
    super(options)

  firstDomNode: -> @node

  processText: ->
    if typeof @text == 'function'
      text = @text()
      @isNoop = !@text.needUpdate and !@mountCallbackComponentList.length
    else
      text = @text
      @isNoop = !@mountCallbackComponentList.length
    text

  createDom: -> @node = document.createTextNode(@processText()); @

  updateDom: -> @text.needUpdate and @node.textContent = @processText(); @

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, noNewLine) -> newLine(funcString(@text), indent, noNewLine)