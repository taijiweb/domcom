import Block from './Block'

{newLine} = require 'dc-util'

import toComponentArray from './toComponentArray'

{mixin} = require 'dc-util'
import ListMixin from './ListMixin'

{binaryInsert} = require 'dc-util'

export default  module.exports =  class List extends Block
  constructor: (children) ->    
    super()
    this.children = toComponentArray(children)
    this.initListMixin()
    this.isList = true

    return

  refreshDom: (oldBlock) ->
    this.renderDom()
    this.attachChildren()
    this

  createDom: ->
    this.valid = true
    this.node = this.childNodes
    this.createChildrenDom()
    this.firstNode = this.childrenFirstNode
    this.node

  updateDom: ->
    this.valid = true
    this.updateChildrenDom()
    this.firstNode = this.childrenFirstNode
    this.node

  markRemovingDom: ->
    this.removing = true
    this.holder = null
    for child in this.children
      child.markRemoving()
    dc.removingChildren[this.dcid] = this
    this

  markRemoving: ->
    this.removing = true
    for child in this.children
      child.markRemoving()
    return

  clearRemoving: ->
    this.removing = this.removed = false
    for child in this.children
      child.clearRemoving()
    return

  # removeDom: ->
    # this method is coded in Block.removeDom
    # the case for Component.isList is considered there

  removeNode: ->
    this.removing = false
    this.removed = true
    this.node.parentNode = null
    this.childParentNode = null
    for child in this.children
      child.baseComponent.removeNode()
    return

  invalidateAttach: (child) ->
    index = this.children.indexOf(child)
    binaryInsert(index, this.attachingIndexes)
    if this.attachValid
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    this

  resetAttach: ->
    this.attachValid = false
    for child in this.children
      child.resetAttach()
    return

  attachParent: ->
    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode
    this.removing = false
    if parentNode && (parentNode != node.parentNode || nextNode != node.nextSibling)
      this.emit('willAttach')
      ListMixinAttachChildren.call(this)
      this.emit('didAttach')

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

  clone: (options) ->
    result = new List(this.cloneChildren(options))
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
ListMixinAttachChildren = ListMixin.attachChildren