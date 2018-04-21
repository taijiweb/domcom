Component = require('./Component')

module.exports = class BaseComponent extends Component

  constructor: ->
    super()
    this.isBaseComponent = true
    this.removing = false
    # the line below is moved from ListMixin
    # because the removing component of TransformComponent will be added to TransformComponent.content
    this.baseComponent = this

  refreshDom: (oldBaseComponent) ->
    this.renderDom()
    this.attachParent()
    this

  renderDom: (oldBaseComponent) ->
    this.emit('willRenderDom')

    if oldBaseComponent && oldBaseComponent != this
      oldBaseComponent.markRemovingDom()

    this.renderBaseComponent(oldBaseComponent)

    this.emit('didRenderDom')

    this

  renderBaseComponent: (oldBaseComponent) ->
    if oldBaseComponent && oldBaseComponent != this
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    if !this.node
      this.createDom()
      if this.holder
        this.holder.invalidateAttach(this)
    else
      if !this.valid
        this.updateDom()

    return

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    else
      this

  resetAttach: ->
    this.attachValid = false

  attachChildren: ->

  markRemovingDom: ->
    this.removing = true
    this.holder = null
    dc.removingChildren[this.dcid] = this
    this

  markRemoving: ->
    this.removing = true
    return

  clearRemoving: ->
    this.removing = this.removed = false

  removeDom: ->
    if this.removing
      this.emit('willDetach')
      if this.isList
        this.removing = false
        this.removed = true
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
    this.removed = true
    if node = this.node
      node.parentNode && node.parentNode.removeChild(node)
    return

  attachParent: ->
    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

    this.removing = false

    if parentNode && (parentNode != node.parentNode || nextNode != node.nextSibling)
      this.emit('willAttach')
      parentNode.insertBefore(node, nextNode)
      this.emit('didAttach')

    node

