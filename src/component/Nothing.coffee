import BaseComponent from './BaseComponent'
import {newLine} from 'dc-util'

export default class Nothing extends BaseComponent
  constructor: ->
    super()

    this.firstNode = null
    this.family = {}

    this.baseComponent = this

  invalidate: -> this

  renderDom: (oldBaseComponent) ->
    if oldBaseComponent
      oldBaseComponent.markRemovingDom()
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