{isArray, substractSet} = require('dc-util')

isComponent = require('./isComponent')
toComponent = require('./toComponent')
Nothing = require('./Nothing')

{binarySearch, binaryInsert, substractSet} = require('dc-util')
{extendChildFamily} = require('../../dom-util')

updateDcidIndexMap = (dcidIndexMap, children, start) ->
  length = children.length
  i = start
  while i < length
    dcidIndexMap[children[i].dcid] = i
    i++
  return

addIndexes = (indexes, value, start) ->
  length = indexes.length
  i = start
  while i < length
    indexes[i] += value
    i++
  return

module.exports =

  initListMixin: ->
    # do not use component.listIndex
    # because a component can occurs different places in component tree
    # especially because in the different TransformComponsnt branch
    this.dcidIndexMap = dcidIndexMap = {}

    this.family = family = {}
    family[this.dcid] = true

    for child, i in this.children
      child.holder = this
      extendChildFamily(family, child)
      dcidIndexMap[child.dcid] = i

    return

  cloneChildrenFrom: (component, options) ->
    children = []
    for child, i in component.children
      children.push(this.cloneChild(child, i, options, component))
    this.setChildren(0, children)

  cloneChild: (child, index, options, srcComponent) ->
    child.clone(options)

  createChildrenDom: ->
    node = this.childNodes
    this.invalidIndexes = []
    this.removingChildren = {}
    {children} = this

    index = children.length-1
    firstNode = null
    while index>=0
      child = children[index]

      if child.holder && child.holder != this
        child.holder.invalidateContent(child)
      child.holder = this

      try
        child.renderDom(child.baseComponent)
      catch e
        dc.onerror(e)

      node.unshift(child.node)
      firstNode = child.firstNode || firstNode
      index && children[index-1].nextNode = firstNode || child.nextNode
      index--

    this.childFirstNode = firstNode

    node

  updateChildrenDom: ->
    {invalidIndexes} = this

    if invalidIndexes.length

      {children} = this
      this.invalidIndexes = []
      i = invalidIndexes.length - 1
      {childNodes} = this
      lastNextNode = nextNode = this.childrenNextNode
      childrenLength = children.length
      if (lastChild = children[childrenLength - 1]) && lastChild.nextNode != nextNode
        lastChild.nextNode = nextNode
        listIndex = invalidIndexes[i]
        j = childrenLength - 1
        nextChild = children[j]
        j--
        while j >= listIndex
          child = children[j]
          if nextChildFirstNode = nextChild.firstNode
            child.nextNode = nextNode = nextChildFirstNode
            break
          else
            if child.nextNode != nextNode
              child.nextNode = nextNode
              nextChild = child
              j--
            else
              break
      while i >= 0
        listIndex = invalidIndexes[i]
        child = children[listIndex]

        if child.holder && child.holder != this
          child.holder.invalidateContent(child)
        child.holder = this

        if listIndex == childrenLength - 1
          child.nextNode = lastNextNode
        else
          child.nextNode = children[listIndex+1].firstNode || children[listIndex+1].nextNode
        try
          child.renderDom(child.baseComponent)
        catch e
          dc.onerror(e)

        childNodes[listIndex] = child.node
        nextNode = child.firstNode || nextNode
        i--
        if listIndex > 0
          nextChild = children[listIndex]
          j = listIndex - 1
          if i >= 0
            listIndex = invalidIndexes[i]
          else
            listIndex = 0
          while j >= listIndex
            child = children[j]
            if nextChildFirstNode = children[j+1].firstNode
              child.nextNode = nextChildFirstNode
              break
            else
              if child.nextNode != nextNode
                child.nextNode = nextNode
                nextChild = child
                j--
              else
                break

      this.childFirstNode = children[0].firstNode || children[0].nextNode

    for _, child of this.removingChildren
      child.removeDom()
    this.removingChildren = {}

    childNodes

  insertChildBefore: (child, refChild) ->
    this.insertChild(refChild, child)

  insertChildAfter: (child, refChild) ->
    {children} = this
    if isComponent(refChild)
      refChild = children.indexOf(refChild)
      if refChild < 0
        refChild = 0
    this.insertChild(refChild+1, child)

  pushChild: (child) ->
    this.insertChild(this.children.length, child)

  unshiftChild: (child) ->
    this.insertChild(0, child)

  insertChild: (refChild, child) ->
    {children, dcidIndexMap} = this
    length = children.length
    if isComponent(refChild)
      index = this.dcidIndexMap[refChild.dcid]
      if !index?
        index = length
    else if refChild > length
      index = length
      refChild = null
    else if refChild < 0
      index = 0
      refChild = null
    else
      index = refChild
      refChild = children[index]

    this.emit('onInsertChild', index, refChild, child)
    this.invalidate()

    child = toComponent(child)
    children.splice(index, 0, child)
    updateDcidIndexMap(dcidIndexMap, children, index)

    if this.node
      {invalidIndexes} = this
      if i = binarySearch(index, invalidIndexes)
        invalidIndexes.splice(i, 0, index)
        addIndexes(invalidIndexes, 1, i+1)
      else
        invalidIndexes.push(index)

    this

  shiftChild: (children...) ->
    children = []
    i = children.length -1
    while i >= 0
      child = toComponent(children[i])
      this.insertChild(0, child)
    this

  unshiftChild: ->
    this.removeChild(0)

  popChild: ->
    length = this.children.length
    if length
      this.removeChild(length-1)
    else
      this

  removeChild: (child) ->
    if !child?
      dc.error('child to be removed is undefined')

    children = this.children
    dcidIndexMap = this.dcidIndexMap
    if isComponent(child)
      index = dcidIndexMap[child.dcid]
      if !index?
        dc.error('child to be removed is not in the children')
    else if child >= children.length || child < 0
      dc.error('child to be removed is out of bound')
    else
      index = child
      child = children[index]
    delete dcidIndexMap[child.dcid]

    this.invalidate()
    child = children[index]

    child.markRemovingDom(true)

    substractSet(this.family, child.family)
    children.splice(index, 1)
    updateDcidIndexMap(dcidIndexMap, children, index)

    if this.node
      {invalidIndexes} = this
      invalidIndex = binarySearch(index, invalidIndexes)

      if invalidIndexes[invalidIndex]==index
        invalidIndexes.splice(invalidIndex, 1)
        addIndexes(invalidIndexes, -1, index)

      prevIndex = index-1
      if prevIndex >= 0
        children[prevIndex].nextNode = child.nextNode

      this.childNodes.splice(index, 1)
      this.removingChildren[child.dcid] = child

    this

  replaceChild: (oldChild, newChild) ->
    {children, dcidIndexMap} = this

    if isComponent(oldChild)
      index = dcidIndexMap[oldChild.dcid]
      if !index?
        dc.error('oldChild to be replaced is not in the children')
      delete dcidIndexMap[oldChild.id]
    else
      if oldChild >= children.length || oldChild < 0
        dc.error('oldChild to be replaced is out of bound')
      index = oldChild
      oldChild = children[index]

    this.emit('onReplaceChild', index, oldChild, newChild)

    newChild = toComponent(newChild)
    if oldChild == newChild
      return this
    delete dcidIndexMap[oldChild.dcid]
    children[index] = newChild
    dcidIndexMap[newChild.dcid] = index

    this.invalidate()
    oldChild.markRemovingDom(true)

    newChild.parentNode = oldChild.parentNode
    newChild.nextNode = oldChild.nextNode

    substractSet(this.family, oldChild.family)
    extendChildFamily(this.family, newChild)

    if this.node
      binaryInsert(index, this.invalidIndexes)
      this.removingChildren[oldChild.dcid] = oldChild

    this

  setChildren: (startIndex, newChildren) ->
    children = this.children
    oldChildrenLength = children.length
    n = oldChildrenLength
    while n < startIndex
      this.pushChild(new Nothing())
      n++
    for child, i in newChildren
      if startIndex + i < oldChildrenLength
        this.replaceChild(startIndex + i, newChildren[i])
      else
        this.pushChild(newChildren[i])
    this

  setLength: (newLength) ->
    children = this.children
    if newLength >= children.length
      this
    else
      last = children.length-1
      if this.node
        insertLocation = binarySearch(newLength, this.invalidIndexes)
        this.invalidIndexes = this.invalidIndexes[0...insertLocation]
      while last >= newLength
        this.removeChild(last)
        last--
      this

  invalidateContent: (child) ->
    this.valid = false
    this.contentValid = false
    this.node && binaryInsert(this.dcidIndexMap[child.dcid], this.invalidIndexes)
    this.holder && this.holder.invalidateContent(this)
