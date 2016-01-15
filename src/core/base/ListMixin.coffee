isComponent = require './isComponent'
toComponent = require './toComponent'
toComponentList = require './toComponentList'
Nothing = require './Nothing'

{binarySearch, binaryInsert, substractSet} = require 'dc-util'
{extendChildFamily} = require '../../dom-util'

# todo: to simplify, use sort to replace binaryInsert and binarySearch
# tried once, but it seems to be not simple enough

module.exports =

  initChildren: (children) ->
    children = toComponentList(children)

    @family = family = {}
    family[@dcid] = true
    @dcidIndexMap = dcidIndexMap = {}

    for child, i in children
      child = children[i]
      extendChildFamily(family, child)
      child.holder = @
      dcidIndexMap[child.dcid] = i
    @children = children

  createChildrenDom: ->
    node = @childNodes
    @invalidIndexes = []
    @removedChildren = {}
    {children} = @

    index = children.length-1
    firstNode = null
    while index>=0
      child = children[index]

      if child.holder != @

        # here just set child.valid = false is not enough
        # it is necessary to invalidate old holder
        # child.valid = false
        child.invalidate()

        child.holder = @

      try
        child.renderDom(child.baseComponent)
      catch e
        dc.onerror(e)

      node.unshift(child.node)
      firstNode = child.firstNode or firstNode
      index and children[index-1].nextNode = firstNode or child.nextNode
      index--

    @childFirstNode = firstNode

    node

  updateChildrenDom: ->
    {invalidIndexes} = @

    if invalidIndexes.length

      {children} = @
      @invalidIndexes = []
      {childNodes} = @
      nextNode = @childrenNextNode
      children[children.length-1].nextNode = nextNode
      childFirstNode = null
      i = invalidIndexes.length - 1
      while i>=0
        listIndex = invalidIndexes[i]
        child = children[listIndex]

        if child.holder!=@
          # should invalidate old holder at first
          child.invalidate()
          child.holder = @

        try
          child.renderDom(child.baseComponent)
        catch e
          dc.onerror(e)

        childNodes[listIndex] = child.node
        nextNode = child.firstNode or nextNode
        if listIndex
          children[listIndex-1].nextNode = nextNode
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

  invalidateContent: (child) ->
    @valid = false
    @contentValid = false
    @node and binaryInsert(@dcidIndexMap[child.dcid], @invalidIndexes)
    @holder and @holder.invalidateContent(@)

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

      {invalidIndexes} = @
      insertLocation = binaryInsert(index, invalidIndexes)

      # increment the indexes in the invalidInexes after insertLocation
      length = invalidIndexes.length
      insertLocation++
      while insertLocation<length
        invalidIndexes[insertLocation]++
        insertLocation++

    @

  removeChild: (indexOrComponent) ->
    if isComponent(indexOrComponent)
      index = this.dcidIndexMap[indexOrComponent.dcid]
      delete this.dcidIndexMap[indexOrComponent.id]
    else
      index = indexOrComponent

    {children} = this

    if index > children.length
      return this

    @invalidate()
    child = children[index]

    child.markRemovingDom(true)

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

      @childNodes.splice(index, 1)
      @removedChildren[child.dcid] = child

    @

  replaceChild: (indexOrOldChild, newChild) ->
    {children} = this

    if isComponent(indexOrOldChild)
      oldChild = indexOrOldChild
      index = this.dcidIndexMap[oldChild.dcid]
      delete this.dcidIndexMap[oldChild.id]
    else
      if indexOrOldChild > children.length || indexOrOldChild < 0
        dc.error('the old child index to be replaced is out of bound')
      index = indexOrOldChild
      oldChild = children[index]

    newChild = toComponent(newChild)
    children[index] = newChild
    this.dcidIndexMap[newChild.id] = index

    @invalidate()

    oldChild.markRemovingDom(true)

    substractSet(@family, oldChild.family)
    extendChildFamily(@family, newChild)

    if @node
      binaryInsert(index, @invalidIndexes)
      @removedChildren[oldChild.dcid] = oldChild

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

    oldChildrenLength = children.length
    if startIndex > oldChildrenLength
      i = oldChildrenLength
      while i < startIndex
        child = new Nothing()
        child.holder = this
        newChildren.unshift child
        i++
      startIndex = oldChildrenLength

    if node
      {invalidIndexes} = @
      insertLocation = binarySearch(startIndex, @invalidIndexes)


    stopIndex = startIndex+newChildren.length
    i = 0
    while startIndex<stopIndex
      child = toComponent newChildren[i]
      child.holder = this

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
        extendChildFamily(family, child)
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
    if newLength>=children.length then return @
    last = children.length-1
    if @node
      insertLocation = binarySearch(newLength, @invalidIndexes)
      @invalidIndexes = @invalidIndexes.slice(0, insertLocation)
    while last>=newLength
      @removeChild(last)
      last--
    @

