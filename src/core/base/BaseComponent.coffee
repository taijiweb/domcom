Component = require('./component')
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
      this.invalidateOffspring(this)
    else
      this

  invalidateOffspring: (offspring) ->
    holder = this.holder
    if !holder
      # while the component is not mounted, the holder may be undefined
      this
    else
      if this.inWillRenderender
        this.renderingMap[offspring.dcid] = [offspring, offspring.holder]
      else if holder == dc
        dc.invalidateOffspring(offspring)
      else if !holder.isBaseComponent
        this.renderingMap[offspring.dcid] = [offspring, offspring.holder]
        holder.invalidate()
      else
        holder.invalidateOffspring(offspring)
     this

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing && this.node
      dc.valid = false
      dc.removingMap[this.dcid] = this
    this

  updateBaseComponent: ->
    this

  renderContent: (oldBaseComponent) ->
    this.renderDom(oldBaseComponent)
    holder = this.holder
    holder.raiseNode(this)
    holder.raiseFirstNextNode(this)

  renderDom: (oldBaseComponent) ->
    this.rendering = true

    # this is a special hack for funcEach
    this.inWillRenderender = true
    this.emit('willRender')
    this.inWillRenderender = false

    if oldBaseComponent and oldBaseComponent != this
      oldBaseComponent.markRemovingDom(true)

    if !this.node
      this.valid = true
      this.renderingMap = {}
      this.createDom()
    else
      this.refreshDom()

    this.attachNode(this.parentNode, this.nextNode)
    this.rendering = false
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
    node.parentNode.removeChild(node)

  attachNode: ->
    if !(attached=this.attached)
      this.attached = true
      this.emit('willAttach')

    this.removing = false

    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

    if parentNode != node.parentNode || nextNode != node.nextSibling
      node = this.node
      try
        parentNode.insertBefore(node, nextNode)
      catch e
        dc.error(e)

      holder = this.holder
      if holder.children
        holder.node[holder.dcidIndexMap[this.dcid]] = node

    if !attached
      this.emit('didAttach')

    node

  setParentNode: (parentNode) ->
    this.parentNode = parentNode
    return

  getPrevChainComponentOf: (child) ->
    throw new Error('Atomic BaseComponent should not has child component.')