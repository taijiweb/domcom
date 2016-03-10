{isArray, substractSet} = require('dc-util')

isComponent = require('./isComponent')
toComponent = require('./toComponent')
toComponentList = require('./toComponentList')
Nothing = require('./Nothing')

{extendChildFamily} = require('../../dom-util')
{updateChildHolder} = require('../../dc')

updateDcidIndexMap = (dcidIndexMap, children, start) ->
  length = children.length
  i = start
  while i < length
    dcidIndexMap[children[i].dcid] = i
    i++
  return

getFirstNode = (node) ->
  if isArray(node)
    for n in node
      if first = getFirstNode(n)
        return first
    null
  else
    node

# todo: use double linked list as children???
# {dcid: {next: dcid, prev: dcid, nextNode: theNode}}
# array and linked list, which is better?

module.exports =

  initChildren: (children) ->
    children = toComponentList(children)

    # do not use component.listIndex
    # because a component can occurs different places in component tree
    # especially because in the different the TransformComponsnt branch
    this.dcidIndexMap = dcidIndexMap = {}

    this.renderingMap = {}
    this.removingMap = {}

    this.family = family = {}
    family[this.dcid] = true

    for child, i in children
      child = children[i]
      child.holder = this
      extendChildFamily(family, child)
      dcidIndexMap[child.dcid] = i

    this.children = children

  # because dc, ListMixin has different behaviour
  # especially, dc.nextNodes is an array!!!
  # so getChildNextNode is a necessary method
  getChildNextNode: (child) ->
    this.nextNodes[this.dcidIndexMap[child.dcid]]

  updateChildHolder: updateChildHolder
  
  createChildrenDom: ->
    nextNodes = this.nextNodes
    children = this.children
    node = this.childNodes
    node.nextSibling = nextNode = this.childNextNode
    node.parentNode = this.childParentNode
    i = children.length - 1
    nextNodes[i] = nextNode
    while i >= 0
      child = children[i]
      child.parentNode = this.childParentNode
      child.nextNode = nextNode
      if child.holder != this
        if child.node
          child.invalidate()
        child.holder = this
      try
        child.renderDom(child.baseComponent)
      catch e
        dc.onerror(e)
      node[i] = child.node
      i--
      firstNode = child.firstNode
      nextNodes[i] = nextNode = firstNode || nextNode
    this.childFirstNode = firstNode
    node

  insertChildBefore: (child, refChild) ->
    this.insertChild(refChild, child)

  insertChildAfter: (child, refChild) ->
    {children} = this
    if isComponent(refChild)
      refChild = children.indexOf(refChild)
      if refChild < 0
        refChild = children.length

    this.insertChild(refChild+1, child)

  pushChild: (child) ->
    this.insertChild(this.children.length, child)

  unshiftChild: (child) ->
    this.insertChild(0, child)

  insertChild: (refChild, child) ->
    {children, dcidIndexMap} = this
    length = children.length
    if isComponent(refChild)
      index = dcidIndexMap[refChild.dcid]
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
    extendChildFamily(this.family, child)
    this.updateChildHolder(child)
    if !refChild
      nextNode = this.nextNode
    else
      nextNode = refChild.firstNode || refChild.nextNode
    child.setNextNode(nextNode)
    child.invalidate()
    dcidIndexMap[child.dcid] = index
    children.splice(index, 1, child)
    if this.childNodes
      this.childNodes.splice(index, 1, null)
    updateDcidIndexMap(dcidIndexMap, children, index + 1, 0)
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

    children[index].markRemovingDom(true)

    substractSet(this.family, child.family)
    children.splice(index, 1)
    if this.childNodes
      this.childNodes.splice(index, 1)
    updateDcidIndexMap(dcidIndexMap, children, index)
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

    newChild.holder = this
    newChild.setParentNode(this.childParentNode)
    newChild.setNextNode(oldChild.nextNode)
    newChild.invalidate()
    oldChild.markRemovingDom(true)

    substractSet(this.family, oldChild.family)
    extendChildFamily(this.family, newChild)
    this

  invalidateChildren: (startIndex, stopIndex) ->
    if !stopIndex?
      stopIndex = startIndex+1
    if !this.node
      return this
    children = this.children
    while startIndex<stopIndex
      children[startIndex].invalidate()
      startIndex++
    this

  setChildren: (startIndex, newChildren...) ->
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
    return this

  setLength: (newLength) ->
    length = this.children.length
    if newLength >= length
      n = length
      while n < newLength
        this.pushChild(new Nothing())
        n++
    else
      last = length - 1
      while last >= newLength
        this.removeChild(last)
        last--
    this