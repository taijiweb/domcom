BaseComponent = require('./BaseComponent')

{newLine, isArray} = require('dc-util')

{refreshComponents} = dc = require('../../dc')

getFirstNodeFromArray = (nodes) ->
  if !nodes.length
    return null
  else
    for node in nodes
      if !isArray(node) && node
        return node
      else if node = getFirstNodeFromArray(node)
        return node
    null

module.exports = exports = class List extends BaseComponent
  constructor: (children) ->    
    super()
    this.renderingMap = {}
    this.removingMap = {}
    this.initChildren(children)
    this.isList = true

    return

  createDom: ->
    this.valid = true

    children = this.children
    nextNodes = this.nextNodes
    this.node = this.childNodes = node = []
    this.childParentNode = this.parentNode
    this.childNextNode = this.nextNode
    nextNodes.length = length = children.length
    if length
      nextNodes[length-1] = this.nextNode
      this.createChildrenDom()
    this.firstNode = this.childFirstNode
    node

  # because dc, tag and List has different behaviour
  # so getChildParentNode is a necessary method
  getChildParentNode: (child) ->
    this.parentNode

  updateChildHolder: (child, listIndex) ->
    if child.holder != this
      if child.holder && child.node
        child.invalidate()
      child.setParentNode(this.parentNode)
      child.holder = this
    return

  # push down the nextNode, but does not propagate to the prev component
  sinkNextNode: (nextNode) ->
    if nextNode != this.nextNode
      this.nextNode = nextNode
      children = this.children
      length = children.length
      if length
        i = length - 1
        while i >= 0
          child = children[i]
          child.sinkNextNode()
          if child.firstNode
            break
          else
             i--

  refreshDom: ->
    this.valid = true
    refreshComponents.call(this)
    this.node

  # set parentNode and nextNode field for transformComponent and its offspring, till baseComponent
  setParentNode: (parentNode) ->
    if this.parentNode != parentNode
      this.parentNode = parentNode
      for child in this.children
        child.setParentNode(parentNode)
    return

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing
      if this.renderHolder
        this.renderHolder = null
        delete this.renderHolder.renderingMap[this.dcid]
        delete this.oldRenderingMap[this.dcid]
      delete dc.renderingMap[this.dcid]
      delete dc.oldRenderingMap[this.dcid]
      node = this.node
      if node
        if node.parentNode
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

  # after Component.removeNode, the previousSibling component  will reset nextNode,
  # and then this method will be called
  linkNextNode: (child) ->
    i = ListMixinLinkNextNode.call(this, child)
    if i == length
      this.nextNode = child.nextNode
      if holder = this.holder
        holder.linkNextNode(this)
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
    if parentNode != node.parentNode or  nextNode != node.nextSibling
      node.parentNode = parentNode
      # nextSibling is just the thing
      # node.nextNode = nextNode
      length = children.length
      if length

        index = length - 1
        children[index].nextNode = nextNode

        while index >= 0
          child = children[index]
          if child.holder && child.holder != this.holder
            child.invalidate()
            child.holder = this.holder
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

    if holder = this.holder
      holder.raiseNode(this)
      holder.raiseFirstNextNode(this)

    # else null # both parentNode and nextNode does not change, do nothing
    if !attached
      this.emit('didAttach')

    this.node

  clone: -> (new List((for child in this.children then child.clone()))).copyEventListeners(this)

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

ListMixinLinkNextNode = ListMixin.linkNextNode