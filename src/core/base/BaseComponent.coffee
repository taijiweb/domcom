Component = require('./Component')

module.exports = class BaseComponent extends Component

  constructor: ->
    super()
    this.isBaseComponent = true
    this.removing = false
    this.removingChildren = {}
    # the line below is moved from ListMixin
    # because the removing component of TransformComponent will be added to TransformComponent.content
    this.baseComponent = this

  refreshDom: (oldBaseComponent) ->
    this.renderDom()
    this.attachParent()
    this.removeChildrenDom()
    this

  renderDom: (oldBaseComponent) ->
    this.emit('willRenderDom')

    if oldBaseComponent && oldBaseComponent != this
      oldBaseComponent.markRemovingDom(this)

    this.renderBaseComponent(oldBaseComponent)

    this.emit('didRenderDom')

    this

  renderBaseComponent: (oldBaseComponent) ->
    if oldBaseComponent && oldBaseComponent != this
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    if !this.node
      this.valid = true
      this.createDom()
      if this.holder
        this.holder.invalidateAttach(this)
    else
      if !this.valid || this.isTag
        this.valid = true
        this.updateDom()

    return

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    else
      this

  attachChildren: ->

  markRemovingDom: (holder) ->
    if this.parentNode && this.firstNode && this.firstNode.parentNode == this.parentNode
      this.removing = true
      holder.memoRemoving(this)
    this

  markRemoving: ->
    if this.parentNode && this.node
      this.removing = true
    return

  removeDom: ->
    if this.removing
      this.removing = false
      this.emit('willDetach')
      if this.isList
        this.node.parentNode = null
        this.childParentNode = null
        for child in this.children
          child.removeDom()
      else
        this.removeNode()
      this.emit('didDetach')
    this

  removeNode: ->
    this.removing = false
    if node = this.node
      node.parentNode && node.parentNode.removeChild(node)
    return

  executeAttachParent: ->

    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

    this.removing = false

    if parentNode && (parentNode != node.parentNode || nextNode != node.nextSibling)
      parentNode.insertBefore(node, nextNode)

    return

  attachParent: ->
    if this.node.parentNode
      this.emit('willAttach')
      this.executeAttachParent()
      this.emit('didAttach')
    else
      this.executeAttachParent()

    this.node