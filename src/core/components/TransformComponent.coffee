Component = require('./Component')

module.exports = class TransformComponent extends Component

  isTransformComponent: true

  constructor: ->
    super()
    this.transformValid = false

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    this

  invalidateContent: (content) ->
    this.invalidate()

  invalidateAttach: (content) ->
    if this.attachValid
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    this

  invalidateTransform: ->
    if this.transformValid
      this.transformValid = false
      this.invalidate()
    this

  refreshDom: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)
    this.attachParent()

  renderDom: (oldBaseComponent) ->
    this.emit('willRenderDom')
    this.valid = true
    this.attachValid = true
    if !this.transformValid
      this.transformValid = true
      content = this.content
      if content && content.holder == this
        this.content.holder = null
      this.content = this.getContentComponent()
      this.content.clearRemoving()
    content = this.content
    content.holder = this
    content.parentNode = this.parentNode
    content.nextNode = this.nextNode
    content.renderDom(oldBaseComponent)
    baseComponent = content.baseComponent
    this.baseComponent = baseComponent
    this.node = baseComponent.node
    this.firstNode = baseComponent.firstNode
    if !this.node.parentNode
      content.attachValid = false
      this.invalidateAttach(content)
    this.emit('didRenderDom')
    this

  markRemovingDom: ->
    this.removing = true
    this.holder = null
    dc.removingChildren[this.dcid] = this
    if this.content
      this.content.markRemoving()
    this

  markRemoving: ->
    this.removing = true
    if this.content
      this.content.markRemoving()
    return

  clearRemoving: ->
    this.removing = this.removed = false
    if this.content
      this.content.clearRemoving()
    return

  removeDom: ->
    if this.removing
      this.removing = false
      this.removed = true
      if this.content
        this.content.removeDom()
    this

  removeNode: ->
    this.removing = false
    this.removed = true
    if this.content
      this.content.removeNode()
    return

  attachParent: ->
    if !this.attachValid
      this.attachValid = true
      content = this.content
      content.parentNode = this.parentNode
      content.nextNode = this.nextNode
      content.attachParent()
    return

  propagateChildNextNode: (child, nextNode) ->
    if this.holder
      this.holder.propagateChildNextNode(this, nextNode)
    return

  linkNextNode: (child, oldNode, nextNode) ->
    if this.holder
      this.holder.linkNextNode(this, oldNode, nextNode)
    return

  resetAttach: ->
    this.attachValid = false
    this.content.resetAttach()