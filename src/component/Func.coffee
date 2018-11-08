import toComponent = require('./toComponent')
import TranComponent = require('./TranComponent')
{funcString, newLine} = require('dc-util')
{renew} = require('lazy-flow')

export default class Func extends TranComponent
  constructor: (func) ->
    super()

    if !func.invalidate
      this.func = renew(func)
    else
      this.func = func

    me = this
    this.func.onInvalidate(-> me.invalidateTransform())

    this

  getContentComponent: -> toComponent(this.func())

  clone: ->
    (new Func(this.func))
      .copyEventListeners(this)

  toString: (indent=2, addNewLine) ->
    newLine("<Func #{funcString(this.func)}/>",  indent, addNewLine)
