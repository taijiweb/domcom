import toComponent from './toComponent'
import TranComponent from './TranComponent'
{funcString, newLine, intersect} = require 'dc-util'
{renew} = require 'lazy-flow'

INIT = 0
FULFILL = 1
REJECT = 2

export default module.exports = class Defer extends TranComponent
  constructor: (@promise, fulfill, reject, init) ->

    super()

    this.fulfill = fulfill || (result) -> result
    treject = reject || (error) -> error
    this.init = init && init(promise, this) || new Nothing()

    this.family = family = intersect([fullfill.family, reject.family, init.family])
    family[this.dcid] = true

    this.promiseState = INIT

    promise
    .then (value) ->
      this.promiseResult = value
      this.promiseState = FULFILL
      this.invalidateTransform()

    .catch (error) ->
      this.promiseResult = error
      this.promiseState = REJECT
      this.invalidateTransform()

    return this

  getContentComponent: ->
    if (state=this.promiseState)==INIT then init
    else if state==FULFILL then toComponent(this.fulfill(this.promiseResult, this.promise, this))
    else toComponent(this.reject(this.promiseResult, this.promise, this))

  clone: -> (new Defer(this.promise, this.fulfill, this.reject, this.init.clone)).copyEventListeners(this)

  toString: (indent=0, addNewLine='') ->
    newLine('', indent, addNewLine)+'<Defer '+this.promise+'>' + \
      newLine('', indent, addNewLine) + funcString(this.fulfill) + \
      newLine('', indent, addNewLine) + funcString(this.reject) +  \
      this.init.toString(indent+2, true) + newLine('</Defer>', indent, true)

Object.assign Defer, {INIT, FULFILL, REJECT}