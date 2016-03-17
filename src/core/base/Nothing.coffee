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

  renderDom: (oldBaseComponent) ->

    if oldBaseComponent and oldBaseComponent != this
      oldBaseComponent.markRemovingDom(true)

    this.valid = true
    if !this.node
      this.node = []

    this.attachNode()

    this

  createDom: -> @node = []

  refreshDom: ->
    this.valid = true
    this.node

  attachNode: ->
    if holder = this.holder
      holder.raiseNode(this)
      holder.raiseFirstNextNode(this)
    this.node

  markRemovingDom: (removing) ->
    this.removing = removing
    if removing
      this.holder = null
    this

  removeDom: -> this

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)