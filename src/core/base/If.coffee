toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine, intersect} = require 'dc-util'
{renew} = require 'lazy-flow'
mergeIf = require('../mergeIf')

module.exports = class If extends TransformComponent
  constructor: (test, then_, else_, merge, recursive) ->
    if then_==else_
      return toComponent then_

    then_ = toComponent(then_)
    else_ = toComponent(else_)

    if typeof test != 'function'
      if test
        return then_
      else
        return else_

    if merge
      return mergeIf(test, then_, else_, recursive)

    super()

    @then_ = then_
    @else_ = else_

    @family = family = intersect([then_.family, else_.family])
    family[@dcid] = true

    if !test.invalidate
      @test = renew(test)
    else @test = test

    @test.onInvalidate(@invalidateTransform.bind(@))

    return this

  getContentComponent: ->
    if @test()
      @then_
    else
      @else_

  clone: -> (new If(@test, @then_.clone(), @else_.clone())).copyEventListeners(@)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<if '+funcString(@test)+'>' + \
        @then_.toString(indent+2, true) + \
        @else_.toString(indent+2, true) + \
        newLine('</if>', indent, true)