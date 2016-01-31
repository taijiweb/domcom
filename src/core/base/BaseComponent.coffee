Component = require('./component')
{cloneObject} = require('dc-util')

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    @isBaseComponent = true
    @removing = false
    @baseComponent = @

  renderDom: (oldBaseComponent) ->

    if oldBaseComponent and oldBaseComponent!=@
      oldBaseComponent.markRemovingDom(true)

    if !@node
      @valid = true
      @createDom()
    else
      @removing = false
      if !@valid
        @valid = true
        @updateDom()

    @attachNode(@parentNode, @nextNode)

    if oldBaseComponent and oldBaseComponent!=@
      oldBaseComponent.removeDom()

    @

  invalidate: ->
    if !@valid then return
    @valid = false
    @holder and @holder.invalidateContent(@)

  markRemovingDom: (removing) ->
    if !removing || (@node and @node.parentNode)
      @removing = removing
    return

  removeDom: ->
    if @removing && @attached
      @removing = false
      @holder = null
      @removeNode()
      @emit('detach')
      @attached = false
    @

  removeNode: ->
    {node} = @
    node.parentNode.removeChild(node)

  attachNode: ->
    {node, parentNode, nextNode} = @

    if !@attached
      @attached = true
      @emit('attach')

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