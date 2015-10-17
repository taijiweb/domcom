toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Nothing = require './Nothing'
{checkContainer, newLine, binarySearch, binaryInsert, substractSet} = require '../../util'
{checkConflictOffspring} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children, options) ->
    @children = children
    options = options or {}
    super(options)
    @family = family = Object.create(null)
    family[@dcid] = true
    @dcidIndexMap = dcidIndexMap = Object.create(null)
    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.holder = @
      dcidIndexMap[child.dcid] = i
    @invalidIndexes = []
    @removedChildren = Object.create(null)
    @isList = true
    return

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    binaryInsert(@dcidIndexMap[child.dcid], @invalidIndexes)
    @holder and @holder.invalidateContent(@)

  createDom: ->
    if length=@children.length
      {parentNode, children} = @
      children[length-1].nextNode = @nextNode
      for child, i in children
        child.parentNode = parentNode
    node = @createChildrenDom()
    @firstNode = @childFristNode
    @node = node

  createChildrenDom: ->
    @childrenNode = node = []
    {children} = @
    index = children.length-1
    firstNode = null
    while index>=0
      child = children[index]
      if child.holder!=@
        child.invalidate()
        child.holder = @
      child.renderDom()
      node.unshift(child.node)
      firstNode = child.firstNode or firstNode
      index and children[index-1].nextNode = firstNode or child.nextNode
      index--
    node.parentNode = @parentNode
    @childFristNode = firstNode
    node

  updateDom: ->
    {children, parentNode, invalidIndexes} = @
    for index in invalidIndexes
      children[index].parentNode = parentNode
    @updateChildrenDom()

  updateChildrenDom: ->
    {invalidIndexes, childrenNode, removedChildren} = @
    if !invalidIndexes.length
      @removedChildren = Object.create(null)
      for _, child of removedChildren
        child.removeDom()
      return childrenNode
    {children} = @
    @invalidIndexes = []
    @removedChildren = Object.create(null)
    {parentNode, nextNode} = @
    parentNextNode = nextNode
    i = invalidIndexes.length-1
    children[children.length-1].nextNode = @nextNode
    while i>=0
      listIndex = invalidIndexes[i]
      child = children[listIndex]
      if child.holder!=@
        child.invalidate()
        child.holder = @
      child.renderDom()
      childrenNode[listIndex] = child.node
      listIndex and children[listIndex-1].nextNode = child.firstNode or nextNode
      i--
    for _, child of removedChildren
      child.removeDom()
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
    binaryInsert(index, @invalidIndexes)
    @dcidListIndexMap[child.dcid] = index

    # increment the indexes in the invalidInexes after insertLocation
    length = invalidIndexes.length
    while insertLocation<length
      insertLocation[insertLocation]++
      insertLocation++

    @children.splice(index, 0, toComponent(child))
    @

  removeChild: (index) ->
    {children} = @
    if index>children.length then return @
    @invalidate()
    child = children[index]
    child.parentNode = null
    substractSet(@family, child.family)
    @removedChildren[child.dcid] = child
    children.splice(index, 1)
    children[index-1] and children[index-1].nextNode = child.nextNode
    @node.splice(index, 1)
    @

  invalidChildren: (startIndex, stopIndex) ->
    if !@node then return @
    @invalidate()
    {invalidIndexes} = @
    insertLocation = binarySearch(startIndex, @invalidIndexes)
    while startIndex<stopIndex
      invalidIndex = invalidIndexes[insertLocation]
      if invalidIndex!=startIndex then invalidIndexes.splice(insertLocation, 0, startIndex)
      insertLocation++
      startIndex++
    return @

  setChildren: (startIndex, newChildren...) ->
    @invalidate()
    {children, invalidIndexes, removedChildren, family, node} = @
    if node then insertLocation = binarySearch(startIndex, @invalidIndexes)
    stopIndex = startIndex+newChildren.length
    i = 0
    while startIndex<stopIndex
      child = toComponent newChildren[i]
      oldChild = children[startIndex]
      if oldChild==child
        if node
          invalidIndex = invalidIndexes[insertLocation]
          if invalidIndex and invalidIndex<stopIndex then insertLocation++
      else
        if oldChild
          substractSet(family, oldChild.family)
          if node then @removedChildren[oldChild.dcid] = oldChild
        checkConflictOffspring(family, child)
        children[startIndex] = child
        if node
          invalidIndex = invalidIndexes[insertLocation]
          if invalidIndex!=startIndex then invalidIndexes.splice(insertLocation, 0, startIndex)
          insertLocation++
      startIndex++
      i++
    return @

  setLength: (newLength) ->
    children = @children
    last = children.length-1
    while last>=newLength
      @removeChild(last)
      last--
    @

  # Tag, Comment, Html, Text should have attached themself in advace
  attachNode: () ->
    {children} = @
    if parentNode!=@node.parentNode and children.length
      {parentNode, nextNode} = @
      index = children.length-1
      children[index].nextNode = nextNode
      while index>=0
        child = children[index]
        child.parentNode = parentNode
        child.baseComponent.attachNode()
        index and children[index-1].nextNode = child.firstNode or child.nextNode
        index--
    @node

  removeDom: ->
    # while we want to remove any component, its parentNode is be set null
    # if it is attatched to DOM by other component again, its parentNode will be set again
    if !@node or !@node.parentNode or @parentNode then return @
    @node.parentNode = null
    for child in @children
      child.parentNode = null
      child.removeDom()
    if @unmountCallbackList
      for cb in @unmountCallbackList then cb()
    @

  clone: (options) -> (new List((for child in @children then child.clone()), options or @options)).copyLifeCallback(@)

  toString: (indent=0, addNewLine) ->
    if !@children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)