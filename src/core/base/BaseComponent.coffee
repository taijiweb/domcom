Component = require('./Component')
{cloneObject} = require('dc-util')

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    this.isBaseComponent = true
    this.removing = false
    this.baseComponent = this

  renderDom: (oldBaseComponent) ->
    this.emit('willRenderDom')

    if oldBaseComponent && oldBaseComponent != this
      oldBaseComponent.markRemovingDom(true)

    if !this.node
      this.valid = true
      this.createDom()
    else
      this.removing = false
      if !this.valid
        this.valid = true
        this.updateDom()

    this.attachNode(this.parentNode, this.nextNode)

    if oldBaseComponent && oldBaseComponent != this
      oldBaseComponent.removeDom()

    this.emit('didRenderDom')

    this

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    else
      this

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing
      if this.node && this.node.parentNode
        dc.valid = false
    this

  removeDom: ->
    if this.removing && this.attached
      this.removing = false
      this.holder = null
      this.emit('willDetach')
      this.removeNode()
      this.emit('didDetach')
      this.attached = false
    this

  removeNode: ->
    node = this.node
    node.parentNode.removeChild(node)
    return

  executeAttachNode: ->

    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

    this.removing = false

    if parentNode && (parentNode != node.parentNode || nextNode != node.nextSibling)
      node = this.node
      try
        parentNode.insertBefore(node, nextNode)
      catch e
        dc.error(e)

  attachNode: ->
    if !(attached=this.attached)
      this.attached = true
      this.emit('willAttach')

    this.executeAttachNode()

    if !attached
      this.emit('didAttach')

    this.node

  renderContent: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)

