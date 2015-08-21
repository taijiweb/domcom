VirtualNode = require './VirtualNode'

module.exports = class VirtualList extends VirtualNode
  constructor: (@baseComponent, children) ->
    super
    @vtreeRootComponent = null
    if !children or !children.length then @chilren = null
    else
      myChildren = []
      for child in children
        myChildren.push child
      @children = myChildren
    @

  isActive: -> @vtreeRootComponent or @children

  firstNode: -> @children[0].firstNode()

  setParentNode: (node) ->
    @baseComponent.parentNode = node
    if !@children then return
    for child in @children then child.setParentNode(node)
    return

  createDom: ->
    baseComponent = @baseComponent
    @node = baseComponent.node
    if children = @children
      node = baseComponent.node
      @renderChildrenDom()
      for child, i in baseComponent.children
        node[i] = child.node
    @

  updateDom: ->
    if @children then @renderChildrenDom()
    @

  renderChildrenDom: () ->
    children = []
    for child in @children
      vtree = child.render()
      if vtree.isNoop then continue
      else if vtree.isPlaceHolder
        if vtree.children instanceof Array
          children.push.apply children, vtree.children
        else # VirtualTag
          if vtree.children
            if vtree.children.isPlaceHolder
              children.push.apply children, vtree.children.children
            else children.push vtree.children
      else children.push vtree
    @isPlaceHolder = !@vtreeRootComponent and !@hasMountCallback()
    if !children.length
      @children = null
      @isNoop = @isPlaceHolder
    else
      @children = children
      @isNoop = false

