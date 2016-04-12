BaseComponent = require('./BaseComponent')

{newLine, isArray} = require('dc-util')

{refreshComponents} = dc = require('../../dc')

toComponentArray = require('./toComponentArray')

module.exports = exports = class List extends BaseComponent
  constructor: (children) ->    
    super()
    this.children = toComponentArray(children)
    this.initListMixin()
    this.isList = true

    return

  createDom: ->
    this.valid = true

    children = this.children
    this.node = this.childNodes = node = []
    this.childNextNode = this.nextNode
    this.createChildrenDom()
    this.firstNode = this.childFirstNode
    node

  updateDom: ->
    {children, parentNode, invalidIndexes} = this

    for index in invalidIndexes
      children[index].parentNode = parentNode

    this.childrenNextNode = this.nextNode
    this.updateChildrenDom()
    this.firstNode = this.childFirstNode

    this.node

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing
      if (node = this.node) && node.parentNode
        node.parentNode = null
        for child in this.children
          child.markRemovingDom(removing)
      this.holder = null
    this

  removeDom: ->
    if this.removing && this.attached
      this.removing = false
      this.attached = false
      this.emit('willDetach')
      for child in this.children
        child.removeDom()
      this.emit('didDetach')
    this

  removeNode: ->
    this.node.parentNode = null
    for child in this.children
      child.baseComponent.removeNode()
    return

  # Tag, Comment, Html, Text should have attached them self in advance
  # But if the children is valid, and the List Component has been removeDom before,
  # it must attachNode of all the children to the parentNode
  attachNode: ->

    {children, parentNode, nextNode, node} = this

    if !(attached=this.attached)
      this.attached = true
      this.emit('willAttach')

    # different parentNode, it was removeDom before !
    # attach it again
    if parentNode != node.parentNode ||  nextNode != node.nextSibling
      node.parentNode = parentNode
      length = children.length
      if length

        index = length - 1
        children[index].nextNode = nextNode

        while index >= 0
          child = children[index]
          if child.holder && child.holder != this
            child.invalidate()
            child.holder = this.holder
          child.parentNode = parentNode

          {baseComponent} = child
          baseComponent.parentNode = parentNode
          baseComponent.nextNode = child.nextNode
          baseComponent.attachNode()

          if index
            children[index-1].nextNode = child.firstNode || child.nextNode

          index--

    if !attached
      this.emit('didAttach')

    this.node

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

{mixin} = require('dc-util')
ListMixin = require('./ListMixin')
mixin(List.prototype, ListMixin)

#ListMixinLinkNextNode = ListMixin.linkNextNode