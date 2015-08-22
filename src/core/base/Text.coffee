BaseComponent = require './BaseComponent'
{funcString, newLine} = require '../../util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    if !text? then text = ''
    @text = text
    super(options)

  firstDomNode: -> @node

  processText: ->
    text = @text
    if typeof text == 'function' then text = text()
    else
      @text = null
      @isNoop = !@mountCallbackComponentList.length
    text

  createDom: -> @node = document.createTextNode(@processText()); @

  updateDom: -> @text? and @node.textContent = @processText(); @

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, noNewLine) -> newLine(funcString(@text), indent, noNewLine)