BaseComponent = require './BaseComponent'
{funcString, newLine, value, dynamic} = require '../../util'
{domValue} = require '../../dom-util'

module.exports = class Text extends BaseComponent
  constructor: (text) ->
    super()
    me = @
    @text = text = domValue(text)
    if typeof text == 'function'
      text.onInvalidate -> me.invalidate()
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
    @removeNode()
    @emit('afterRemoveDom')
    @

  attachNode: ->
    node = @node
    if @parentNode == node.parentNode then return node
    @parentNode.insertBefore(node, @nextNode)
    node

  removeNode: ->
    @node.parentNode.removeChild(@node)

  clone: -> (new @constructor(@text)).copyEventListeners(@)

  toString: (indent=2, addNewLine) -> newLine(funcString(@text), indent, addNewLine)