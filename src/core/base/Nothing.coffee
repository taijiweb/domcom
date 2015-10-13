BaseComponent = require './TransformComponent'
{newLine} = require '../../util'

module.exports = class Nothing extends BaseComponent
  constructor: ->
    super

    @firstNode = null
    @family = Object.create(null)
    @baseComponent = @

    @clone = (options) -> (new Nothing())

    @toString = (indent=2, noNewLine) -> newLine("<Nothing/>",  indent, noNewLine)

    this