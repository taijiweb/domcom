BaseComponent = require './BaseComponent'

{newLine} = require 'dc-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children) ->
    super()
    @initChildren(children)
    @isList = true
    return

  createDom: ->
    if length=@children.length
      {parentNode, children} = @
      children[length-1].nextNode = @nextNode
      for child, i in children
        child.parentNode = parentNode

    node = []
    @setNode(node)

    @childNodes = node

    node.parentNode = @parentNode

    @createChildrenDom()

    @setFirstNode @childFirstNode

    @childrenNextNode = @nextNode

    @node

  updateDom: ->
    {children, parentNode, invalidIndexes} = @

    for index in invalidIndexes
      children[index].parentNode = parentNode

    @childrenNextNode = @nextNode
    @updateChildrenDom()

    # do not worry about Tag component
    # 1. it does not call List.updateDom
    # 2. setFirstNode will affect BaseComponent holder (including Tag)
    @setFirstNode @childFirstNode

    @node

  removeDom: ->
    if @parentNode or !@node or !@node.parentNode
      @
    else
      @emit('removeDom')
      @node.parentNode = null
      @node.nextNode = null
      for child in @children
        child.removeDom()
      @

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
      for child in @children
        child.markRemovingDom(parentNode)
      return

  removeNode: ->
    @node.parentNode = null
    for child in @children
      child.baseComponent.removeNode()
    return

  # Tag, Comment, Html, Text should have attached them self in advace
  # But if the children is valid, and the List Component has been removeDom before,
  # it must attachNode of all the children to the parentNode
  attachNode: () ->

    {children, parentNode, nextNode, node} = @

    # different parentNode, it was removeDom before !
    # attach it again
    if parentNode != @node.parentNode or  nextNode != node.nextNode
      node.parentNode = parentNode
      node.nextNode = nextNode

      if children.length

        {nextNode} = @
        index = children.length - 1
        children[index].nextNode = nextNode

        while index >= 0
          child = children[index]
          child.parentNode = parentNode

          {baseComponent} = child
          baseComponent.parentNode = parentNode
          baseComponent.nextNode = child.nextNode
          baseComponent.attachNode()

          if index
            children[index-1].nextNode = child.firstNode or child.nextNode
          #else null # meet the first children
          index--

      # else null # no children, do nothing

    # else null # both parentNode and nextNode does not change, do nothing

    @node

  clone: -> (new List((for child in @children then child.clone()))).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    if !@children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)

extend = require('extend')
ListMixin = require('./ListMixin')
extend(List.prototype, ListMixin)