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
      child.listIndex = i
      invalidIndexes.unshift i
    @isList = true
    return

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    {invalidIndexes} = @
    listIndex = child.listIndex
    index = binarySearch(listIndex, invalidIndexes)
    if invalidIndexes[index]!=listIndex then invalidIndexes.splice(index, 0, listIndex)
    @holder and @holder.invalidateContent(@)

  createDom: (options) ->
    if length=@children.length
      {parentNode, children} = @
      children[length-1].nextNode = @nextNode
      for child in children then child.parentNode = parentNode
    node = @createChildrenDom(options)
    @firstNode = @childFristNode
    @node = node

  createChildrenDom: (options) ->
    @childrenNode = node = []
    {invalidIndexes, removeIndexes, children} = @
    @invalidIndexes = []
    @removeIndexes = Object.create(null)
    index = children.length-1
    firstNode = null
    while index>=0
      child = children[index]
      if child.holder!=@
        child.invalidate()
        child.holder = @
        child.listIndex = index
      child.renderDom(child.baseComponent, {})
      node.unshift(child.node)
      firstNode = child.firstNode or firstNode
      index and children[index-1].nextNode = firstNode or child.nextNode
      index--
    node.parentNode = @parentNode
    @childFristNode = firstNode
    node

  updateDom: (options) ->
    {children, parentNode, invalidIndexes} = @
    for index in invalidIndexes
      children[invalidIndexes[index]].parentNode = parentNode
    @updateChildrenDom(options)

  updateChildrenDom: (options) ->
    {invalidIndexes, childrenNode} = @
    if !invalidIndexes.length then return childrenNode
    {children, removeIndexes} = @
    @invalidIndexes = []
    @removeIndexes = Object.create(null)
    {parentNode, nextNode} = @
    parentNextNode = nextNode
    index = invalidIndexes.length-1
    children[children.length-1].nextNode = options.nextNode
    while index>=0
      listIndex = invalidIndexes[index]
      child = children[listIndex]
      if child.holder!=@
        child.invalidate()
        child.holder = @
        child.listIndex = listIndex
      child.renderDom(child.baseComponent, {})
      childrenNode[listIndex] = child.node
      index and children[listIndex-1].nextNode = nextNode
      index--
    childrenNode.parentNode = parentNode
    childrenNode

  removeNode: ->
    if !@node.parentNode then return
    @node.parentNode = null
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
  attachNode: () ->
    if @parentNode!=@node.parentNode
      for child in @children then child.attachNode()
    @node

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  toString: (indent=0, addNewLine) ->
    if !@children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)