import Component from './Component'

export default class Block extends Component

  constructor: ->
    super()
    this.isBlock = true
    this.removing = false
    # the line below is moved from ListMixin
    # because the removing Component of TranComponent will be added to TranComponent.content
    this.baseComponent = this

  getImage: ->
    # as an abstract base class , Block class do not know how to getImage
    # should be overrided by subclass for a concrete getImage method.
    dc.error('as an abstract base class , Block class do not know how to getImage, \nshould be overrided by subclass for a concrete getImage method.')

  getBlock: ->
    return this

  refresh: ->
    this.image = this.getImage()
    this.refreshDom()

  refreshDom: (oldBlock) ->
    this.renderDom()
    this.attachParent()
    this

  renderDom: (oldBlock) ->
    this.emit('willRenderDom')

    if oldBlock && oldBlock != this
      oldBlock.markRemovingDom()

    this.renderBlock(oldBlock)

    this.emit('didRenderDom')

    this

  renderBlock: (oldBlock) ->
    if oldBlock && oldBlock != this
      this.attachValid = false
      if this.holder
        this.holder.invalidateAttach(this)
    if !this.node
      this.createDom()
      if this.holder
        this.holder.invalidateAttach(this)
    else
      if !this.valid
        this.updateDom()

    return

  invalidate: ->
    if this.valid
      this.valid = false
      this.holder && this.holder.invalidateContent(this)
    else
      this

  resetAttach: ->
    this.attachValid = false

  attachChildren: ->

  markRemovingDom: ->
    this.removing = true
    this.holder = null
    dc.removingChildren[this.dcid] = this
    this

  markRemoving: ->
    this.removing = true
    return

  clearRemoving: ->
    this.removing = this.removed = false

  removeDom: ->
    if this.removing
      this.emit('willDetach')
      if this.isList
        this.removing = false
        this.removed = true
        this.node.parentNode = null
        this.childParentNode = null
        for child in this.children
          child.removeDom()
      else
        this.removeNode()
      this.emit('didDetach')
    this

  removeNode: ->
    this.removing = false
    this.removed = true
    if node = this.node
      node.parentNode && node.parentNode.removeChild(node)
    return

  attachParent: ->
    node = this.node
    parentNode = this.parentNode
    nextNode = this.nextNode

    this.removing = false

    if parentNode && (parentNode != node.parentNode || nextNode != node.nextSibling)
      this.emit('willAttach')
      parentNode.insertBefore(node, nextNode)
      this.emit('didAttach')

    node

module.exports = Block
