BaseComponent = require './BaseComponent'

module.exports = class Nothing extends BaseComponent
  constructor: ->
  createDom: ->
  updateDom: ->
  getNode: ->
  attachNode: ->
  removeNode: ->
  clone: -> new Nothing()
  toString: (indent=2, noNewLine) -> '<nothing/>'