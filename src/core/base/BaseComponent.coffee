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
      @valid = true
      return @removeDom()
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

  # while TransformComponent.renderDom(),
  # if oldBaseComponent is not the same as the new baseComponent
  # oldBaseComponent should be removed from dom
  # if and only if it's and its offspring's parentNode is equal to
  # the transformComponent's parentNode
  removeReplacedDom: (parentNode) ->
    if @parentNode != parentNode
      return
    else
      @parentNode = null
      @removeNode()
      return

  # while TransformComponent.renderDom(),
  # if oldBaseComponent is not the same as the new baseComponent
  # oldBaseComponent should be removed from dom
  # if and only if it's and its offspring's parentNode is equal to
  # the transformComponent's parentNode
  markRemovingDom: (parentNode) ->
    # if the parentNode of this component has changed to other parentNode
    # it should have bene moved to other places, or have been removed before
    if @parentNode != parentNode
      return
    else
      @parentNode = null
      return

  removeDom: ->
    if @parentNode or !@node or !@node.parentNode
      @
    else
      @emit('removeDom')
      @removeNode()
      @

  removeNode: ->
    {node} = @
    node.parentNode.removeChild(node)

  attachNode: ->
    {node, parentNode, nextNode} = @

    if parentNode == node.parentNode and nextNode == node.nextNode
      return node

    parentNode.insertBefore(node, nextNode)
    # since dom have no nextNode field, so let domcom save it
    node.nextNode = nextNode

    node

  # set parentNode and nextNode field for transformComponent and its offspring, till baseComponent
  setParentAndNextNode: ->

    if this.isList
      {children} = this
      i = 0
      len = children.length
      if !len
        return
      {parentNode, nextNode} = @
      while i < len-1
        child = children[i]
        child.parentNode = parentNode
        child.setParentAndNextNode()
        i++

      child = children[i]
      child.parentNode = parentNode
      child.nextNode = nextNode
      child.setParentAndNextNode()
