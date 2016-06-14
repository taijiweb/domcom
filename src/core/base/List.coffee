BaseComponent = require('./BaseComponent')

{newLine} = require('dc-util')

toComponentArray = require('./toComponentArray')

{mixin} = require('dc-util')
ListMixin = require('./ListMixin')

{binaryInsert} = require('dc-util')

module.exports = exports = class List extends BaseComponent
  constructor: (children) ->    
    super()
    this.children = toComponentArray(children)
    this.initListMixin()
    this.isList = true

    return

  refreshDom: (oldBaseComponent) ->
    this.renderDom()
    this.attachChildren()
    this.removeChildrenDom()
    this

  createDom: ->
    this.node = this.childNodes
    this.createChildrenDom()
    this.firstNode = this.childrenFirstNode
    this.node

  updateDom: ->
    this.updateChildrenDom()
    this.firstNode = this.childrenFirstNode
    this.node

  markRemovingDom: (holder) ->
    if this.childParentNode && this.firstNode && this.firstNode.parentNode == this.childParentNode
      this.removing = true
      for child in this.children
        child.markRemoving(holder)
      holder.memoRemoving(this)
    this

  markRemoving: ->
    if this.childParentNode && this.node
      this.removing = true
      for child in this.children
        child.markRemoving()
    return

  removeNode: ->
    this.node.parentNode = null
    this.childParentNode = null
    for child in this.children
      child.baseComponent.removeNode()
    return

  invalidateAttach: (child) ->
    index = this.children.indexOf(child)
    binaryInsert(index, this.attachParentIndexes)
    if this.attachValid
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    this

  attachParent: ListMixin.attachChildren

  setNextNode: (nextNode) ->
    this.nextNode = nextNode
    this.childrenNextNode = nextNode
    children = this.children
    index = children.length - 1
    while child = children[index]
      child.setNextNode(nextNode)
      if !child.firstNode
        index--
      else
        break
    return

  clone: (arg) ->
    result = new List(this.cloneChildren(arg))
    result.constructor = this.constructor
    result.copyEventListeners(this)

  toString: (indent=0, addNewLine) ->
    if !this.children.length then newLine("<List/>", indent, addNewLine)
    else
      s = newLine("<List>", indent, addNewLine)
      for child in this.children
        s += child.toString(indent+2, true)
      s += newLine('</List>', indent, true)

mixin(List.prototype, ListMixin)