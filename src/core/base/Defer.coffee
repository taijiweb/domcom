toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
extend = require '../../extend'
{funcString, newLine, intersect} = require '../../util'
{renew} = require '../../flow'

INIT = 0
FULFILLED = 1
REJECTED = 2

module.exports = class Defer extends TransformComponent
  constructor: (@promise, fulfill, reject, init) ->

    super

    @fulfill = fulfill
    @reject = reject or ->
    @init = init and init(promise) or new Nothing()

    @family = family = intersect([fullfill.family, reject.family, init.family])
    family[@dcid] = true

    @promiseState = INIT

    promise
    .then (valu) ->
      @promiseResult = value
      @promiseState = FULFILL
      @invalidateTransform()

    .catch (error) ->
      @promiseResult = error
      @promiseState = REJECT
      @invalidateTransform()

    @

  getContentComponent: ->
    if (state=@promiseState)==INIT then init
    else if state==FULFILL then toComponent(@fulfill(@promiseResult, @promise, @))
    else toComponent(@reject(@promiseResult, @promise, @))

  @clone = -> (new Defer(@promise, @fulfill, @reject, @init.clone)).copyEventListeners(@)

  @toString = (indent=0, addNewLine='') ->
    newLine('', indent, addNewLine)+'<Defer '+@promise+'>' + \
      newLine('', indent, addNewLine) + funcString(@fulfill) + \
      newLine('', indent, addNewLine) + funcString(@reject) +  \
      @init.toString(indent+2, true) + newLine('</Defer>', indent, true)

  this

extend Defer, {INIT, FULFILL, REJECT}