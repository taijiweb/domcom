BaseComponent = require './BaseComponent'

cacheNothing = null
module.exports = class Nothing extends BaseComponent
  constructor: ->
    if cacheNothing then return cacheNothing
    super
    @family = Object.create(null)
    cacheNothing = @
  createDom: ->
  updateDom: ->
  getNode: ->
  attachNode: ->
  removeNode: ->
  clone: -> @
  toString: (indent=2, noNewLine) -> '<nothing/>'