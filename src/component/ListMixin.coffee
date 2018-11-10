# if not using binarySearch, it's too expensive to update new index after inserting or removing child
import {isArray, substractSet, binarySearch, binaryInsert} from 'dc-util'

import isComponent from './isComponent'
import toComponent from './toComponent'
import Nothing from './Nothing'

{extendChildFamily} = require('../dom-util').default

insertIndex = (index, indexes) ->
  i = binarySearch(index, indexes)
  indexes.splice(i, 0, index)
  addIndexes(indexes, 1, i + 1)
  return

removeIndex = (index, indexes) ->
  i = binarySearch(index, indexes)
  if  indexes[i] == index
    indexes.splice(i, 1)
  addIndexes(indexes, -1, i)
  return

addIndexes = (indexes, value, start) ->
  # value can be 1 or -1
  length = indexes.length
  i = start
  while i < length
    indexes[i] += value
    if indexes[i] < 0
      throw 'negative index in ListMixin component'
    i++
  return

setNextNodes = (children, nextNode, last, first) ->
  i = last
  while i >= first
    child = children[i]
    if child.nextNode != nextNode
      child.nextNode = nextNode
      if !child.firstNode
        i--
        nextNode = child.firstNode
      else
        break
    else
      break
  return

export default

  initListMixin: ->
    this.updatingIndexes = []
    this.attachingIndexes = []
    this.childNodes = []

    this.family = family = {}
    family[this.dcid] = true

    this.children = this.children || []
    for child, i in this.children
      child.setHolder(this)
      child.clearRemoving()
      extendChildFamily(family, child)

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
    firstNode = null
    this.updatingIndexes = []
    for child, index in this.children
      child.setHolder(this)
      child.renderDom(child.BaseComponent)
      node.push(child.node)
      if !firstNode && child.firstNode
        firstNode = child.firstNode
        firstNodeIndex = index
    this.childrenFirstNode = firstNode
    this.firstNodeIndex = firstNodeIndex
    return

  updateChildrenDom: ->
    updatingIndexes = this.updatingIndexes
    this.updatingIndexes = []
    node = this.childNodes
    children = this.children
    for index in updatingIndexes
      child = children[index]
      child.setHolder(this)
      child.renderDom(child.BaseComponent)
      index = children.indexOf(child)
      node[index] = child.node
      this.updateChildrenFirstNode(child, index)
    return

  insertChildBefore: (child, refChild) ->
    this.insertChild(refChild, child)

  insertChildAfter: (child, refChild) ->
    {children} = this
    if isComponent(refChild)
      refChild = children.indexOf(refChild)
      if refChild < 0
        refChild = 0
    this.insertChild(refChild+1, child)

  pushChild: (children...) ->
    thisChildren = this.children
    length = children.length
    i = 0
    while i < length
      this.insertChild(thisChildren.length, children[i])
      i++
    this

  insertChild: (refChild, child) ->
    children = this.children
    length = children.length
    if !refChild?
      index = length
    else if isComponent(refChild)
      index = children.indexOf(refChild)
      if index < 0
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
    child = toComponent(child)
    this._insertChild(index, child)

  _insertChild: (index, child) ->

    children = this.children
    children.splice(index, 0, child)
    child.setHolder(this)
    child.clearRemoving()
    child.parentNode = this.childParentNode
    if index == children.length - 1
      child.setNextNode(this.childrenNextNode)
    else
      child.setNextNode(children[index+1].firstNode || children[index+1].nextNode)

    if this.node
      this.childNodes.splice(index, 0, child.node)
      if !child.node || !child.valid
        this.valid = false
        insertIndex(index, this.updatingIndexes)
        if this.holder
          this.holder.invalidateContent(this)
      if this.holder
        this.holder.invalidateAttach(this)
      this.attachValid = false
      insertIndex(index, this.attachingIndexes)

      if child.firstNode && (!this.childrenFirstNode ||  index <= this.firstNodeIndex)
        this.childrenFirstNode = child.firstNode
        this.firstNodeIndex = index

    this

  unshiftChild: (children...) ->
    i = children.length - 1
    while i >= 0
      this.insertChild(0, children[i])
      i--
    this

  shiftChild: ->
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
    if isComponent(child)
      index = children.indexOf(child)
      if index < 0
        dc.error('child to be removed is not in the children')
    else if child >= children.length || child < 0
      dc.error('child(' + child + ') to be removed is out of range')
    else
      index = child
      child = children[index]

    removeIndex(index, this.updatingIndexes)

    child = children[index]
    if this.node
      this.childNodes.splice(index, 1)
      if childFirstNode = child.firstNode
        if this.firstNodeIndex == index
          this.setFirstNodeWithFollowing(index)
        this.linkNextNode(index, childFirstNode, child.nextNode)
      child.markRemovingDom()
      removeIndex(index, this.attachingIndexes)

    substractSet(this.family, child.family)
    children.splice(index, 1)

    if child.holder == this
      child.holder = null

    child

  removeRange: (start, stop) ->
    children = this.children

    last = children.length - 1
    index = start
    if index < 0
      index = 0
    if stop > last
      stop = last

    while index <= stop
      this.removeChild(index)
      index++

    this
    
  setFirstNodeWithFollowing: (index) ->
    children = this.children
    length = children.length
    index++
    while index < length
      if firstNode = children[index].firstNode
        this.childrenFirstNode = firstNode
        this.firstNodeIndex = index
        return
      index++
    this.childrenFirstNode = null
    return

  replaceChild: (oldChild, newChild) ->
    children = this.children

    if isComponent(oldChild)
      index = children.indexOf(oldChild)
      if index < 0
        dc.error('oldChild to be replaced is not in the children')
    else
      if oldChild >= children.length || oldChild < 0
        dc.error('oldChild(' + oldChild + ') to be replaced is out of range')
      index = oldChild
      oldChild = children[index]

    this.emit('onReplaceChild', index, oldChild, newChild)
    newChild = toComponent(newChild)
    this._replaceChild(index, oldChild, newChild)


  _replaceChild: (index, oldChild, newChild) ->
    children = this.children

    if oldChild == newChild
      return this
    children[index] = newChild
    if oldChild.holder == this
      oldChild.holder = null
    oldChild.markRemovingDom()
    newChild.setHolder(this)
    newChild.clearRemoving()
    newChild.parentNode = oldChild.parentNode
    newChild.nextNode = oldChild.nextNode

    substractSet(this.family, oldChild.family)
    extendChildFamily(this.family, newChild)

    if this.node
      this.childNodes[index] = newChild.node
      if !newChild.node || !newChild.valid
        this.invalidateContent(newChild)

      this.invalidateAttach(newChild)
      dc.removingChildren[oldChild.dcid] = oldChild
      this.updateChildrenFirstNode(newChild, index)

    this

  updateChildrenFirstNode: (newChild, index) ->
    if this.childrenFirstNode
      if newChild.firstNode
        if index <= this.firstNodeIndex
          this.childrenFirstNode = newChild.firstNode
          this.firstNodeIndex = index
      else if index == this.firstNodeIndex
        this.setFirstNodeWithFollowing(index)        
    else
      if newChild.firstNode
        this.childrenFirstNode = newChild.firstNode
        this.firstNodeIndex = index
    return

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
      while last >= newLength
        this.removeChild(last)
        last--
      this

  invalidateContent: (child) ->
    index = this.children.indexOf(child)
    binaryInsert(index, this.updatingIndexes)
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    this

  invalidateChildren: ->
    this.invalidate()
    for child in this.children
      child.valid = false
    this

  attachChildren: ->
    childParentNode = this.childParentNode
    if !childParentNode || !this.attachValid || !this.childNodes.parentNode
      this.attachValid = true
      if this.isList
        this.childParentNode = this.parentNode
        this.childrenNextNode = this.nextNode
      else if !childParentNode
        this.childParentNode = this.node
        this.childrenNextNode = null

      if this.childParentNode != this.childNodes.parentNode
        this.attachAllChildren()
      else
        this.attachInvalidChildren()
    return

  attachAllChildren: ->
    parentNode = this.childParentNode
    children = this.children
    if length = children.length
      nextNode = this.childrenNextNode
      i = length - 1
      while child = children[i]
        child.setHolder(this)
        child.parentNode = parentNode
        child.setNextNode(nextNode)
        child.attachParent()
        nextNode = child.firstNode || nextNode
        i--
      child = children[0]
      this.childNodes.parentNode = parentNode
    return

  attachInvalidChildren: ->
    attachingIndexes = this.attachingIndexes
    if attachingIndexes.length
      this.attachingIndexes = []

      if parentNode = this.childParentNode
        nextNode = this.childrenNextNode
        children = this.children
        i = attachingIndexes.length - 1
        prevIndex = children.length - 1
        while i >= 0
          listIndex = attachingIndexes[i]
          setNextNodes(children, nextNode, prevIndex, listIndex)
          child = children[listIndex]
          child.setHolder(this)
          child.parentNode = parentNode
          child.attachParent()
          nextNode = child.firstNode || child.nextNode
          prevIndex = listIndex - 1
          i--
        setNextNodes(children, nextNode, prevIndex, 0)

        this.childNodes.parentNode = parentNode
    return

  propagateChildNextNode: (child, nextNode) ->
    children = this.children
    if isComponent(child)
      index = children.indexOf(child) - 1
    else
      index = child - 1

    while child = children[index]
      child.setNextNode(nextNode)
      if child.firstNode
        return
      index--
    if !this.isTag && this.holder
      this.holder.propagateChildNextNode(this, nextNode)

    return

  linkNextNode: (child, oldNode, nextNode) ->
    children = this.children

    if isComponent(child)
      index = children.indexOf(child) - 1
    else
      index = child - 1

    while index >= 0
      child = children[index]
      if child.nextNode == oldNode
        child.setNextNode(nextNode)
      else
        return
      index--

    if !this.isTag && this.holder
      this.holder.linkNextNode(this, oldNode, nextNode)

    return



