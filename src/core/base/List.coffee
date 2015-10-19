toComponent = require './toComponent'
BaseComponent = require './BaseComponent'
Nothing = require './Nothing'
{checkContainer, newLine, binarySearch, binaryInsert, substractSet} = require '../../util'
{checkConflictOffspring} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (@children) ->
    super()

    @family = family = Object.create(null)
    family[@dcid] = true
    @dcidIndexMap = dcidIndexMap = Object.create(null)

    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.holder = @
      dcidIndexMap[child.dcid] = i

    @isList = true
    return

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    @node and binaryInsert(@dcidIndexMap[child.dcid], @invalidIndexes)
    @holder and @holder.invalidateContent(@)

  createDom: ->
    if length=@children.length
      {parentNode, children} = @
      children[length-1].nextNode = @nextNode
      for child, i in children
        child.parentNode = parentNode

    @node = @childNodes = node = []
    node.parentNode = @parentNode
    @createChildrenDom()
    @firstNode = @childFristNode
    @node

  createChildrenDom: ->
    node = @childNodes
    @invalidIndexes = []
    @removedChildren = Object.create(null)
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

    @childFristNode = firstNode

    node

  updateDom: ->
    {children, parentNode, invalidIndexes} = @
    for index in invalidIndexes
      children[index].parentNode = parentNode
    @updateChildrenDom()

  updateChildrenDom: ->
    {invalidIndexes} = @

    if !invalidIndexes.length
      for _, child of @removedChildren
        child.removeDom()
      @removedChildren = Object.create(null)
      return childNodes

    {children} = @
    @invalidIndexes = []
    {parentNode, nextNode, childNodes} = @
    parentNextNode = nextNode
    i = invalidIndexes.length-1
    children[children.length-1].nextNode = @childrenNextNode
    while i>=0
      listIndex = invalidIndexes[i]
      child = children[listIndex]
      if child.holder!=@
        child.invalidate()
        child.holder = @
      child.renderDom()
      childNodes[listIndex] = child.node
      listIndex and children[listIndex-1].nextNode = child.firstNode or nextNode
      i--

    for _, child of @removedChildren
      child.removeDom()
    @removedChildren = Object.create(null)

    childNodes

  removeNode: ->
    @node.parentNode = null
    for child in @children
      child.baseComponent.removeNode()
    return

  insertChild: (index, child) ->
    @invalidate()
    child = toComponent(child)
    @children.splice(index, 0, child)
    @dcidIndexMap[child.dcid] = index

    if @node
      {invalidIndexes} = @
      insertLocation = binaryInsert(index, invalidIndexes)
      # increment the indexes in the invalidInexes after insertLocation
      length = invalidIndexes.length
      insertLocation++
      while insertLocation<length
        invalidIndexes[insertLocation]++
        insertLocation++

    @

  removeChild: (index) ->
    {children} = @
    if index>children.length then return @

    @invalidate()
    child = children[index]

    # to tell child will be removed from DOM while child.renderDom()
    child.parentNode = null

    substractSet(@family, child.family)
    children.splice(index, 1)

    if @node
      {invalidIndexes} = @
      invalidIndex = binarySearch(index, invalidIndexes)
      if invalidIndexes[invalidIndex]==index then invalidIndexes.splice(invalidIndexes, 1)
      children[index-1] and children[index-1].nextNode = child.nextNode
      @node.splice(index, 1)
      @removedChildren[child.dcid] = child

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
    {children, family, node, dcidIndexMap} = @

    if node
      {invalidIndexes, removedChildren} = @
      insertLocation = binarySearch(startIndex, @invalidIndexes)

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
        dcidIndexMap[child.dcid] = startIndex

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
  # But if the children is valid, and the List Component has been removeDom before, it must attachNode of all the children to the parentNode
  attachNode: () ->
    {children} = @
    if (parentNode=@parentNode)!=@node.parentNode
      @node.parentNode = parentNode
      if children.length
        {nextNode} = @
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
    @node.parentNode = null
    for child in @children
      child.parentNode = null
      child.removeDom()
    @emit('afterRemoveDom')
    @

  clone: -> (new List((for child in @children then child.clone()))).copyEventListeners(@)

  toString: (indent=0, addNewLine) ->
    if !@children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in @children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)