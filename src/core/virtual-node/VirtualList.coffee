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

  firstDomNode: -> @children[0].firstDomNode()

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
      @renderChildrenDom('create')
      for child, i in baseComponent.children
        node[i] = child.node
    @

  updateDom: ->
    if @children then @renderChildrenDom('update')
    @

  renderChildrenDom: (method) ->
    children = []
    for child in @children
      baseComponent = child[method]()
      if baseComponent.isNoop then continue
      else if baseComponent.isPlaceHolder
        if baseComponent.children instanceof Array
          children.push.apply children, baseComponent.children
        else # VirtualTag
          if baseComponent.children
            if baseComponent.children.isPlaceHolder
              children.push.apply children, baseComponent.children.children
            else children.push baseComponent.children
      else children.push baseComponent
    @isPlaceHolder = !@vtreeRootComponent and !@hasMountCallback()
    if !children.length
      @children = null
      @isNoop = @isPlaceHolder
    else
      @children = children
      @isNoop = false

