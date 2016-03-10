BaseComponent = require('./BaseComponent')
{newLine} = require('dc-util')

module.exports = class Nothing extends BaseComponent
  constructor: ->
    super

    this.firstNode = null
    this.family = {}

    this.isNothing = true

    this.baseComponent = this

  invalidateOffspring: -> this

  invalidate: -> this

  createDom: -> @node = []

  refreshDom: ->
    this.valid = true
    this.node

  attachNode: ->
    this.holder.raiseNode(this.node)
    this.node

  markRemovingDom: (removing) ->

  removeDom: -> this

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)