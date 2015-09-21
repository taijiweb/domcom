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
    @firstNodeComponent = @lastNodeComponent = @

  processText: ->
    if typeof @text == 'function'then domValue @text()
    else @text

  createDom: ->
    @noop = true
    if @mountCallbackComponentList.length then @invalidate()
    @firstNode = @lastNode = @node = document.createTextNode(@processText())
    @created = true
    @

  updateDom: ->
    @noop = true
    if @mountCallbackComponentList.length then @invalidate()
    if (text=@processText())!=@node.textContent
      @node.textContent = text
    @

  getFirstNodeComponent: -> @
  getLastNodeCompnent: -> @

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, noNewLine) -> newLine(funcString(@text), indent, noNewLine)