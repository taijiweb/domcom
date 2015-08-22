toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'

module.exports = class Func extends TransformComponent
  constructor: (func, options) ->
    super(options)

    @getContentComponent = -> toComponent(func())

    @clone = (options) -> (new Func((-> toComponent(func()).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=2, noNewLine) -> newLine("<Func #{funcString(func)}/>",  indent, noNewLine)
    this