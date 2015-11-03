BaseComponent = require './BaseComponent'
{newLine} = require '../../util'

module.exports = class Nothing extends BaseComponent
  constructor: ->
    super

    @firstNode = null
    @family = {}
    @baseComponent = @

  createDom: -> @node = []

  updateDom: -> @node

  attachNode: -> @node

  clone: -> new Nothing()

  toString: (indent=2, addNewLine) -> newLine("<Nothing/>",  indent, addNewLine)