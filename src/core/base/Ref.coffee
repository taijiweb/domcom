TransformComponent = require './TransformComponent'
{newLine} = require '../../util'

module.exports = class Ref extends TransformComponent
  constructor: (@content) ->
    super()

    content.refs = content.refs or Object.create(null)
    content.refs[@dcid] = @

    @family = content.family

    @getContentComponent = -> @content

    @clone = (options) -> (new Ref(@baseComponent)).copyEventListeners(@)

    @toString = (indent=2, addNewLine) -> newLine("<Ref #{@content}/>",  indent, addNewLine)

    this