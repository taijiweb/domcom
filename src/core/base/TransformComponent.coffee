Component = require('./Component')

module.exports = class TransformComponent extends Component

  isTransformComponent: true

  constructor: ->
    super
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
    this.transformValid = false
    this.invalidate()

  invalidateAttachOnRemove: (child, nextNode) ->
    if this.holder
      this.holder.invalidateAttachOnRemove(this, nextNode)

  refreshDom: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)
    this.attachParent()
    this.removeChildrenDom()

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

  markRemovingDom: (holder) ->
    if this.baseComponent
      holder.markRemovingChild(this.baseComponent)
    this

  markRemoving: ->
    this.baseComponent.markRemoving()
    return

  removeDom: ->
    this.baseComponent.removeDom()

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
      this.holder.propagateChildNextNode(child, nextNode)
    return