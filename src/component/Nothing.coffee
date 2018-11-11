import Block from './Block'
{newLine} = require 'dc-util'

export default module.exports = class Nothing extends Block
  constructor: ->
    super()

    this.firstNode = null
    this.family = {}

    this.baseComponent = this

  invalidate: -> this

  getImage: ->
    this.block = this
    this.image = this
    return this

  renderDom: (oldBlock) ->
    if oldBlock
      oldBlock.markRemovingDom()
    this.valid = true
    this.node = []

    this

  createDom: -> this.node = []
  attachParent:  -> this.node
  attachChildren: -> this.node

  markRemovingDom: -> this
  removeDom: -> this
  removeNode: ->

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)