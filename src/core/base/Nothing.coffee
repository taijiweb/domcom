BaseComponent = require('./BaseComponent')
{newLine} = require('dc-util')

module.exports = class Nothing extends BaseComponent
  constructor: ->
    super

    this.firstNode = null
    this.family = {}

    this.baseComponent = this

  invalidate: -> this

  renderDom: (oldBaseComponent) ->
    if oldBaseComponent
      oldBaseComponent.markRemovingDom(this)
    this.valid = true
    this.node = []

    this

  createDom: -> this.node = []
  attachParent:  -> this.node
  attachChildren: -> this.node

  markRemovingDom: (holder) -> this
  markRemoving: ->
  removeDom: -> this
  removeNode: ->

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)