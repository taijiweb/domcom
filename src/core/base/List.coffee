toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Text = require './Text'
{VirtualList} = require '../virtual-node'
{checkContainer} = require '../../util'
{newLine} = require '../../util'

module.exports = exports = class List extends BaseComponent
  constructor: (@children, options) ->
    options = options or {}
    if children.length==0 then children.push new Text('')
    childIndexMap = {}
    for child, i in children
      child = toComponent(child)
      if childIndexMap[child.id] then throw new Error 'component should not occur mulitple times'
      children[i] = child
      childIndexMap[child.id] = childIndexMap
      child.listIndex = [@, i]
    @isList = true
    super(options)
    return

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  setParentNode: (node) ->
    @parentNode = node
    for child in @children then child.setParentNode(node)
    return

  firstNode: -> @children[0].firstNode()

  getVirtualTree: ->
    if vtree=@vtree
      vtree.srcComponments = []
      vtree
    else
      @node = node = []
      componentChildren = @children
      node.length = componentChildren.length
      children = []
      for child, i in @children
        vtree = child.getVirtualTree()
        vtree.srcComponents.unshift([@, i])
        if vtree.isNoop then node[i] = child.node
        else children.push vtree.vtreeId
      if !children.length then children = null
      @vtree = new VirtualList(@, children)

  toString: (indent=0, noNewLine) ->
    s = newLine("<List>", indent, noNewLine)
    for child in @children
      s += child.toString(indent+2)
    s += newLine('</List>', indent)