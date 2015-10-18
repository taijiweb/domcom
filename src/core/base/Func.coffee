toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'
{renew} = require '../../flow'

module.exports = class Func extends TransformComponent
  constructor: (func, options) ->
    super(options)

    if !func.invalidate then func = renew(func)

    func.onInvalidate(@invalidateTransform.bind(@))

    @getContentComponent = -> toComponent(func())

    @clone = (options) -> (new Func((-> toComponent(func()).clone()), options)).copyEventListeners(@)

    @toString = (indent=2, addNewLine) -> newLine("<Func #{funcString(func)}/>",  indent, addNewLine)

    this