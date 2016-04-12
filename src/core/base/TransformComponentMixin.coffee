module.exports =
  initTransformComponent: ->
    this.valid = false
    this.transformValid = false

  invalidate: ->
    if this.valid
      this.valid = false
      if this.holder
        this.holder.invalidateContent(this)
    this

  invalidateContent: (content) ->
    this.invalidate()

  invalidateTransform: ->
    this.transformValid = false
    this.invalidate()

  markRemovingDom: (removing) ->
    if this.baseComponent
      this.baseComponent.markRemovingDom(removing)
    this.holder = null
    this

  renderDom: (oldBaseComponent) ->
    this.emit('willRenderDom')
    if !(attached = this.attached)
      this.emit('willAttach')
    if this.valid
      if oldBaseComponent == this.baseComponent
        if attached
          return this
        else
          this.attached = true
          this.baseComponent.attachNode(this.parentNode, this.nextNode)
      else
        this.attached = true
        baseComponent = this.baseComponent
        baseComponent.renderDom(oldBaseComponent)
        this.node = baseComponent.node
        this.firstNode = baseComponent.firstNode
    else
      this.valid = true
      this.attached = true
      if !this.transformValid
        this.transformValid = true
        oldContent = this.content
        this.content = content = this.getContentComponent()
        if oldContent && oldContent != content && oldContent.holder == this
          needRemoveOld = true
          oldContent.markRemovingDom(true)
        if content!=this
          content.holder = this
      else
        content = this.content
      content.parentNode = this.parentNode
      content.nextNode = this.nextNode
      content.renderContent(oldBaseComponent)
      if needRemoveOld
        oldContent.removeDom()
      this.baseComponent = baseComponent = content.baseComponent
      this.node = baseComponent.node
      this.firstNode = baseComponent.firstNode
    if !attached
      this.emit('didAttach')
    this.emit('didRenderDom')
    this

  renderContent: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)

  removeDom: ->
    this.baseComponent.removeDom()