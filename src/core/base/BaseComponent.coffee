Component = require './component'
{cloneObject} = require 'dc-util'

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    @isBaseComponent = true
    @baseComponent = @

  getBaseComponent: -> @

  renderDom: ->
    if !@node
      @valid = true
      @emit('beforeAttach')
      @createDom()
    else
      @removing = false
      if !@valid
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
  markRemovingDom: (removing) ->
    # if the parentNode of this component has changed to other parentNode
    # it should have bene moved to other places, or have been removed before
    if !removing || (@node and @node.parentNode)
      @removing = removing
    return

  removeDom: ->
    if @removing
      @removing = false
      @holder = null
      @emit('removeDom')
      @removeNode()
    @

  removeNode: ->
    {node} = @
    node.parentNode.removeChild(node)

  attachNode: ->
    {node, parentNode, nextNode} = @

    @removing = false

    if parentNode == node.parentNode and nextNode == node.nextNode
      return node

    try
      parentNode.insertBefore(node, nextNode)
    catch e
      dc.error(e)
    # since dom have no nextNode field, so let domcom save it
    node.nextNode = nextNode

    node

  setParentNode: (parentNode) ->
    @parentNode = parentNode
    return

  setNextNode: (nextNode) ->
    @nextNode = nextNode
    return

  getNode: -> @node