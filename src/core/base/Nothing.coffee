BaseComponent = require './BaseComponent'

module.exports = class Nothing extends BaseComponent
  constructor: ->
  firstDomNode: ->
  createDom: ->
  updateDom: ->
  clone: -> new Nothing()
  toString: (indent=2, noNewLine) -> '<nothing/>'