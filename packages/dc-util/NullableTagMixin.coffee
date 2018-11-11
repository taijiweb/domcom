{TransformComponentMixin, Tag, Nothing, Block, ListMixin} = dc

BlockAttachParent =  Block.prototype.attachParent
BlockRemoveNode =  Block.prototype.removeNode
BlockRenderBlock = Block.prototype.renderBlock

module.exports = exports =  NullableTagMixin =

  initNullableTag: ->
    this.hidden = false
    this.tagNode = null
    this.nothingNode = []

  renderBlock: (oldBlock) ->

    if !this.isHidden()
      nodeChanged = !this.tagNode || this.node != this.tagNode
      this.node = this.tagNode
      BlockRenderBlock.call(this, oldBlock)
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
      BlockAttachParent.call(this)

  removeNode: ->
    if this.node == this.tagNode
      BlockRemoveNode.call(this)

  isHidden: -> this.hidden