BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require '../../util'
{domValue} = require '../../dom-util'

module.exports = class Text extends BaseComponent
  constructor: (text, options) ->
    me = @
    @text = text = domValue(text)
    if typeof text == 'function'
      @textValid = false
      text.onInvalidate -> me.invalidate()
    super(options)
    @family = Object.create(null)
    @family[@dcid] = true
    @

  processText: ->
    if typeof @text == 'function'then domValue @text()
    else @text

  createDom: ->
    @textValid = true
    @firstNode = @node = document.createTextNode(@processText())
    @node

  updateDom: ->
    if !@textValid then return @node
    @textValid = true
    if (text=@processText())!=@node.textContent
      @node.textContent = text
    @node

  removeDom: ->
    if !@node or !@node.parentNode or @parentNode then return @
    @removeNode()
    if @unmountCallbackList
      for cb in @unmountCallbackList then cb()
    @

  attachNode: ->
    node = @node
    if @parentNode == node.parentNode then return node
    @parentNode.insertBefore(node, @nextNode)
    node

  removeNode: ->
    if @node and !@node.parentNode then return
    @node.parentNode.removeChild(@node)

  clone: (options) -> (new @constructor(@text, options)).copyLifeCallback(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)