Component = require './component'
{cloneObject} = require 'dc-util'

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    @isBaseComponent = true
    @baseComponent = @

  getBaseComponent: -> @

  renderDom: ->
    if !@parentNode
      if @node and @node.parentNode
        @valid = true
        return @removeDom()
      else return @
    if !@node
      @valid = true
      @emit('beforeAttach')
      @createDom()
    else if !@valid
      @valid = true
      @updateDom()
    @attachNode(@parentNode, @nextNode)
    @

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)

  removeDom: ->
    @removeNode()
    @emit('afterRemoveDom')
    @

  removeNode: ->
    @node.parentNode and @node.parentNode.removeChild(@node)

  attachNode: ->
    node = @node
    if @parentNode == node.parentNode then return node
    @parentNode.insertBefore(node, @nextNode)
    node
