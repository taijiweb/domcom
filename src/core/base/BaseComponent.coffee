Component = require('./Component')
{cloneObject} = require('dc-util')
{refreshComponents} = require('../../dc')

module.exports = class BaseComponent extends Component
  constructor: ->
    super()
    this.isBaseComponent = true
    this.removing = false
    this.baseComponent = this

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateOffspring(this)
    else
      this

  invalidateOffspring: (offspring) ->
    if this != offspring && !this.node
      this
    else if !(holder = this.holder)
      # while the component is not mounted, the holder may be undefined
      this.renderingMap[offspring.dcid] = [offspring, offspring.holder]
      this
    else
      if holder == dc
        dc.invalidateOffspring(offspring)
      else
        if !holder.isBaseComponent
          this.renderingMap[offspring.dcid] = [offspring, offspring.holder]
          offspring.renderingHolder = this
          holder.invalidate()
        else
          holder.invalidateOffspring(offspring)

      this

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing
      if this.node && this.node.parentNode
        dc.valid = false
        dc.removingMap[this.dcid] = this
      if this.renderingHolder
        renderingHolder = this.renderingHolder
        this.renerHolder = null
        delete renderingHolder.renderingMap[this.dcid]
        delete renderingHolder.oldRenderingMap[this.dcid]
      this.holder = null
    this

  updateBaseComponent: ->
    this

  renderContent: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)
    if holder = this.holder
      holder.raiseNode(this)
      holder.raiseFirstNextNode(this)

  renderDom: (oldBaseComponent) ->
    this.emit('willRender')

    if oldBaseComponent and oldBaseComponent != this
      oldBaseComponent.markRemovingDom(true)

    if !this.node
      this.valid = true
      this.renderingMap = {}
      this.createDom()
    else
      this.refreshDom()

    this.attachNode(this.parentNode, this.nextNode)

    this.emit('didRender')

    this

  removeDom: ->
    if this.removing && this.attached
      this.removing = false
      this.emit('willDetach')
      this.removeNode()
      this.emit('didDetach')
      this.attached = false
    this

  removeNode: ->
    node = this.node
    prevNode = node.previousSibling
    nextNode = node.nextSibling
    node.parentNode.removeChild(node)
    if prevNode && (component = prevNode.component)
      component.nextNode = nextNode
      if holder = component.holder
        holder.linkNextNode(component)
    return

  executeAttachNode: ->
    this.removing = false

    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

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

    if holder = this.holder
      holder.raiseNode(this)
      holder.raiseFirstNextNode(this)

    if !attached
      this.emit('didAttach')

    this.node

  setParentNode: (parentNode) ->
    this.parentNode = parentNode
    return

  # push down the nextNode, but does not propagate to the prev component
  sinkNextNode: (nextNode) ->
    if nextNode != this.nextNode
      this.nextNode = nextNode
      if (holder = this.holder) && (nextNodes = holder.nextNodes)
        index = holder.dcidIndexMap[this.dcid]
        nextNodes[index] = nextNode