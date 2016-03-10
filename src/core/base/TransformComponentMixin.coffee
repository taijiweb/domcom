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
    this.rendering = true
    this.emit('willRender')

    if this.node && this.valid && oldBaseComponent==this.baseComponent
      this.baseComponent.attachNode(this.parentNode, this.nextNode)
    else
      this.valid = true
      baseComponent = this.updateBaseComponent()
      baseComponent.renderContent(oldBaseComponent)

    this.rendering = false
    this.emit('didRender')
    this

  getChildParentNode: (child) ->
    this.parentNode

  setParentNode: (parentNode) ->
    if this.parentNode!=parentNode
      this.parentNode = parentNode
      this.content and this.content.setParentNode(parentNode)
    return
