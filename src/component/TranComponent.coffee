Component = require('./Component')

export default class TranComponent extends Component

  isTranComponent: true

  constructor: ->
    super()
    this.transformValid = false

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
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
    BaseComponent = content.BaseComponent
    this.BaseComponent = BaseComponent
    this.node = BaseComponent.node
    this.firstNode = BaseComponent.firstNode
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