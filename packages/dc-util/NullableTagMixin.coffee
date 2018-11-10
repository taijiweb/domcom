{TransformComponentMixin, Tag, Nothing, BaseComponent, ListMixin} = dc

BaseComponentAttachParent =  BaseComponent.prototype.attachParent
BaseComponentRemoveNode =  BaseComponent.prototype.removeNode
BaseComponentRenderBaseComponent = BaseComponent.prototype.renderBaseComponent

module.exports = exports =  NullableTagMixin =

  initNullableTag: ->
    this.hidden = false
    this.tagNode = null
    this.nothingNode = []

  renderBaseComponent: (oldBaseComponent) ->

    if !this.isHidden()
      nodeChanged = !this.tagNode || this.node != this.tagNode
      this.node = this.tagNode
      BaseComponentRenderBaseComponent.call(this, oldBaseComponent)
      this.tagNode = nextNode = this.node
      if nodeChanged
        this.holder.propagateChildNextNode(this, nextNode)
        this.holder.invalidateAttach(this)
    else
      this.valid = true
      if this.tagNode && this.node == this.tagNode
        this.removing = true
        this.removeDom()
        this.removed = false
        this.node = this.nothingNode
        this.firstNode = null
        this.holder.propagateChildNextNode(this, this.nextNode)
    return

  attachParent: ->
    if !this.isHidden()
      BaseComponentAttachParent.call(this)

  removeNode: ->
    if this.node == this.tagNode
      BaseComponentRemoveNode.call(this)

  isHidden: -> this.hidden