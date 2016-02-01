toComponent = require('./toComponent')
TransformComponent = require('./TransformComponent')
{funcString, newLine} = require('dc-util')
{renew} = require('lazy-flow')

module.exports = class Func extends TransformComponent
  constructor: (func) ->
    super()

    if !func.invalidate
      @func = renew(func)
    else
      @func = func

    me = this
    @func.onInvalidate(-> me.invalidateTransform())

    this

  getContentComponent: -> toComponent(@func())

  clone: ->
    me = this
    (new Func((-> toComponent(me.func()).clone())))
      .copyEventListeners(@)

  toString: (indent=2, addNewLine) ->
    newLine("<Func #{funcString(@func)}/>",  indent, addNewLine)
