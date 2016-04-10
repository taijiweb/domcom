module.exports =
  initTransformComponent: ->
    this.transformValid = false
    this.isTransformComponent = true

  invalidate: ->
    this.invalidateOffspring(this)

  invalidateOffspring: (offspring) ->
    if this.valid
      this.valid = false
      if this.holder
        this.holder.invalidateOffspring(this)
    this

  invalidateTransform: ->
    this.transformValid = false
    this.invalidate()

  markRemovingDom: (removing) ->
    if this.baseComponent
      this.baseComponent.markRemovingDom(removing)
    this.holder = null
    this

  updateBaseComponent: ->
    if !this.transformValid
      this.transformValid = true
      this.content = content = this.getContentComponent()
      if content != this
        content.holder = this
        content.parentNode = this.parentNode
        content.nextNode = this.nextNode
        this.baseComponent = content.updateBaseComponent()
    this.baseComponent


  renderDom: (oldBaseComponent) ->
    this.emit('willRender')

    if this.node && this.valid && oldBaseComponent==this.baseComponent
      this.baseComponent.attachNode()
    else
      this.valid = true
      this.updateBaseComponent()
      this.renderContent(oldBaseComponent)

    this.emit('didRender')
    this


  renderContent: (oldBaseComponent) ->
    this.baseComponent.renderDom(oldBaseComponent)

  getChildParentNode: (child) ->
    this.parentNode

  setParentNode: (parentNode) ->
    if this.parentNode!=parentNode
      this.parentNode = parentNode
      this.content and this.content.setParentNode(parentNode)
    return

  # after Component.removeNode, the previousSibling component  will reset nextNode,
  # and then this method will be called
  linkNextNode: (child) ->
    this.nextNode = child.nextNode
    if holder = this.holder
      holder.linkNextNode(this)

  # push down the nextNode, but does not propagate to the prev component
  sinkNextNode: (nextNode) ->
    if nextNode != this.nextNode
      this.nextNode = nextNode
      this.content.sinkNextNode(nextNode)