{vtreeMap} = VirtualNode = require './VirtualNode'

module.exports = class VirtualList extends VirtualNode
  constructor: (@baseComponent, children) ->
    super
    @vtreeRootComponent = null
    if !children or !children.length then @chilren = null
    else
      myChildren = []
      for child in children
        myChildren.push child.vtreeId or child
      @children = myChildren
    @

  isActive: -> @vtreeRootComponent or @children

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
      child = vtreeMap[child]
      vtree = child.render()
      if vtree.isNoop then continue
      else if vtree.isPlaceHolder
        if vtree.children instanceof Array
          children.push.apply children, vtree.children
        else # VirtualTag
          if vtree.children
            if vtree.children.isPlaceHolder
              children.push.apply children, vtree.children.children
            else children.push vtree.children.vtreeId
      else children.push vtree.vtreeId
    @isPlaceHolder = !@vtreeRootComponent and !@hasMountCallback()
    if !children.length
      @children = null
      @isNoop = @isPlaceHolder
    else
      @children = children
      @isNoop = false

