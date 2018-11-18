import toComponent from '../toComponent'
import TranBlock from './TranBlock'
{funcString, newLine} = require 'dc-util'
{renew} = require 'lazy-flow'

export default module.exports = class Func extends TranBlock
  constructor: (func) ->
    super()

    if !func.invalidate
      this.func = renew(func)
    else
      this.func = func

    me = this
    this.func.onInvalidate(-> me.invalidateTransform())

    this

  getContent: ->
    return toComponent(this.func())

  clone: ->
    (new Func(this.func))
      .copyEventListeners(this)

  toString: (indent=2, addNewLine) ->
    newLine("<Func #{funcString(this.func)}/>",  indent, addNewLine)
