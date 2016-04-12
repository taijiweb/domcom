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

    if oldBaseComponent && oldBaseComponent != this
      oldBaseComponent.markRemovingDom(true)

    this.valid = true
    if !this.node
      this.node = []

    this.attachNode()

    this

  createDom: -> this.node = []

  attachNode: ->
    this.node

  markRemovingDom: (removing) ->
    if removing
      this.holder = null
    this.removing = removing
    this

  removeDom: -> this

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)