toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Nothing = require './Nothing'
{checkContainer, newLine, binarySearch} = require '../../util'
{checkConflictOffspring} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children, options) ->
    @children = children
    options = options or {}
    super(options)
    @family = family = Object.create(null)
    family[@dcid] = true
    @invalidIndexes = invalidIndexes = []
    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.holder = @
      invalidIndexes.unshift i
    @isList = true
    return

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    [index, found] = binarySearch(child.listIndex, @invalidIndexes)
    if !found then @invalidIndexes.splice(index, 0, child.listIndex)
    @holder and @holder.invalidateContent(@)

  createDom: (options) ->
    node = @createChildrenDom(options)
    @node = node

  createChildrenDom: (options) ->
    @childrenNode = node = []
    @invalidIndexes = []
    @removeIndexes = Object.create(null)
    children = @children
    if !children.length
      @firstNode = null
      return node
    index = children.length-1
    {parentNode, nextNode} = options
    children[index].nextNode = nextNode
    firstNode = null
    while index>=0
      child = children[index]
      if child.holder!=@
        child.invalidate()
        child.holder = @
      child.renderDom(child.baseComponent, {parentNode, nextNode:child.nextNode})
      child.parentNode = @parentNode
      node.unshift(child.node)
      firstNode = child.firstNode or firstNode
      index and child[index-1] = firstNode or nextNode
      index--
    @firstNode = firstNode
    node

  updateDom: (options) ->
    node = @updateChildrenDom(options)
    child0 = @children[0]
    @node = node

  updateChildrenDom: (options) ->
    {invalidIndexes, childrenNode} = @
    if !invalidIndexes.length then return childrenNode
    {children, removeIndexes} = @
    @invalidIndexes = []
    @removeIndexes = Object.create(null)
    {parentNode, nextNode} = options
    parentNextNode = nextNode
    index = invalidIndexes.length-1
    children[children.length-1].nextNode = options.nextNode
    while index>=0
      child = children[index]
      if child.holder!=@
        child.invalidate()
        child.holder = @
      child.renderDom(child.baseComponent, {parentNode, nextNode:child.nextNode})
      childrenNode[index] = child.node
      index and children[index-1].nextNode = nextNode
      index--
    childrenNode

  removeNode: ->
    if !@parentNode or @unmounted then return
    for child in @children
      child.baseComponent.removeNode()
    return

  insertChild: (index, child) ->
    @invalidate()
    {invalidIndexes} = @
    insertLocation = binarySearch(index, invalidIndexes)
    invalidIndexes.splice(insertLocation, 0, index)
    length = invalidIndexes.length
    while insertLocation<length
      insertLocation[insertLocation]++
      insertLocation++
    @children.splice(index, 0, toComponent(child))
    @

  removeChild: (index) ->
    @invalidate()
    {children, invalidIndexes} = @
    insertLocation = binarySearch(index, invalidIndexes)
    if insertLocation[insertLocation]!=index then invalidIndexes.splice(insertLocation, 0, index)
    # todo: remove child from @children and node from @node while @updateDom()
    child = children[index]
    substractSet(family, child.family)
    @removeIndexes[index] = true
    @

  setChildren: (startIndex, newChildren...) ->
    @invalidate()
    {children, invalidIndexes, removeIndexes, family} = @
    insertLocation = binarySearch(startIndex, @invalidIndexes)
    stopIndex = startIndex+newChildren.length
    indexOut = false
    while startIndex<stop
      oldChild = children[startIndex]
      child = toComponent newChildren[startIndex]
      substractSet(family, oldChild.family)
      checkConflictOffspring(family, child)
      delete removeIndexes[startIndex]
      children[startIndex] = child
      if indexOut then invalidIndexes.splice(insertLocation, 0, startIndex)
      else
        invalidIndex = invalidIndexes[inserLocation]
        if invalidIndex>stopIndex
          indexOut = true
          invalidIndexes.splice(insertLocation, 0, startIndex)
        else if invalidIndex>startIndex then invalidIndexes.splice(insertLocation, 0, startIndex)
      insertLocation++
    return @

  # Tag, Comment, Html, Text should have attached themself in advace
  attachNode: (parentNode, nextNode) -> @node

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  toString: (indent=0, addNewLine) ->
    if !@children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)