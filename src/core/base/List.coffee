toComponent = require './toComponent'
isComponent = require './isComponent'

BaseComponent = require './BaseComponent'

Nothing = require './Nothing'
{checkContainer, newLine, binarySearch, binaryInsert, substractSet} = require 'dc-util'
{checkConflictOffspring} = require '../../dom-util'

module.exports = exports = class List extends BaseComponent
  constructor: (children=[]) ->
    super()

    if isComponent(children)
      children = [children]

    @family = family = {}
    family[@dcid] = true
    @dcidIndexMap = dcidIndexMap = {}

    for child, i in children
      children[i] = child = toComponent(child)
      checkConflictOffspring(family, child)
      child.holder = @
      dcidIndexMap[child.dcid] = i
    @children = children

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

    node = []
    @setNode(node)

    @childNodes = node

    node.parentNode = @parentNode

    @createChildrenDom()

    @setFirstNode @childFirstNode

    @childrenNextNode = @nextNode

    @node

  createChildrenDom: ->
    node = @childNodes
    @invalidIndexes = []
    @removedChildren = {}
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

    @childFirstNode = firstNode

    node

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

  updateChildrenDom: ->
    {invalidIndexes} = @

    if invalidIndexes.length

      {children} = @
      @invalidIndexes = []
      {nextNode, childNodes} = @
      i = invalidIndexes.length-1
      children[children.length-1].nextNode = @childrenNextNode
      childFirstNode = null
      while i>=0
        listIndex = invalidIndexes[i]
        child = children[listIndex]
        if child.holder!=@
          child.invalidate()
          child.holder = @
        child.renderDom()
        childNodes[listIndex] = child.node
        childFirstNode = child.firstNode or nextNode
        if listIndex
          children[listIndex-1].nextNode = childFirstNode
        i--

      while listIndex >= 0
        child = children[listIndex]
        childFirstNode = child.firstNode or nextNode
        listIndex--
      @childFirstNode = childFirstNode

    # else null # invalidIndexes == [], do nothing

    for _, child of @removedChildren
      child.removeDom()
    @removedChildren = {}

    childNodes


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
        child.baseComponent.markRemovingDom(parentNode)
      return

  removeNode: ->
    @node.parentNode = null
    for child in @children
      child.baseComponent.removeNode()
    return

  pushChild: (child) ->
    @setChildren(@children.length, child)

  unshiftChild: (child) ->
    @insertChild(0, child)

  insertChild: (index, child) ->
    {children} = @
    if index >= children.length
      return @setChildren(index, child)

    @invalidate()
    child = toComponent(child)
    children.splice(index, 0, child)
    @dcidIndexMap[child.dcid] = index

    if @node
       # below will be executed before List.updateChildrenDom()
#      if index > oldChildrenLength
#        child.nextNode = @childrenNextNode

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
    child.markRemovingDom(@parentNode)

    substractSet(@family, child.family)
    children.splice(index, 1)

    if @node
      {invalidIndexes} = @
      invalidIndex = binarySearch(index, invalidIndexes)

      if invalidIndexes[invalidIndex]==index
        invalidIndexes.splice(invalidIndexes, 1)

      prevIndex = index-1
      if prevIndex >= 0
        children[prevIndex].nextNode = child.nextNode

      @node.splice(index, 1)
      @removedChildren[child.dcid] = child

    @

  invalidChildren: (startIndex, stopIndex) ->
    if !stopIndex? then stopIndex = startIndex+1
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

    if startIndex>oldChildrenLength=children.length
      i = oldChildrenLength
      while i<startIndex
        newChildren.unshift new Nothing()
        i++
      startIndex = oldChildrenLength

    if node
      {invalidIndexes} = @
      insertLocation = binarySearch(startIndex, @invalidIndexes)


    stopIndex = startIndex+newChildren.length
    i = 0
    while startIndex<stopIndex
      child = toComponent newChildren[i]

      oldChild = children[startIndex]

      # maybe stopIndex has exceeded the old length of the children
      if !oldChild?
        children[startIndex] = new Nothing()

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

    # below will be executed before List.updateChildrenDom()
#    if stopIndex>=oldChildrenLength
#      child.nextNode = @childrenNextNode

    return @

  setLength: (newLength) ->
    children = @children
    if newLength>=children.length then return @
    last = children.length-1
    if @node
      insertLocation = binarySearch(newLength, @invalidIndexes)
      @invalidIndexes = @invalidIndexes.slice(0, insertLocation)
    while last>=newLength
      @removeChild(last)
      last--
    @

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