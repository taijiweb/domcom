toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine} = require '../../util'
{renew} = require '../../flow'

module.exports = class Func extends TransformComponent
  constructor: (func) ->
    super()

    if !func.invalidate then @func = renew(func)
    else @func = func

    @func.onInvalidate(@invalidateTransform.bind(@))

    this

  getContentComponent: -> toComponent(@func())

  clone: -> (new Func((-> toComponent(func()).clone()))).copyEventListeners(@)

  toString: (indent=2, addNewLine) -> newLine("<Func #{funcString(@func)}/>",  indent, addNewLine)
