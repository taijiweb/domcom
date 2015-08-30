toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'
{renew} = require '../../flow'

module.exports = class Func extends TransformComponent
  constructor: (func, options) ->
    super(options)

    if !func.invaidate then func = renew(func)

    func.onInvalidate(@invalidate.bind(@))

    @getContentComponent = -> toComponent(func())

    @clone = (options) -> (new Func((-> toComponent(func()).clone()), options or @options)).copyLifeCallback(@)

    @toString = (indent=2, noNewLine) -> newLine("<Func #{funcString(func)}/>",  indent, noNewLine)
    this