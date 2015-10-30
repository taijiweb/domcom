toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine, intersect} = require '../../util'
{renew} = require '../../flow'

module.exports = class If extends TransformComponent
  constructor: (test, then_, else_) ->
    if then_==else_ then return toComponent then_

    then_ = toComponent(then_)
    else_ = toComponent(else_)

    if typeof test != 'function'
      return if test then then_ else else_

    super()

    @then_ = then_
    @else_ = else_

    @family = family = intersect([then_.family, else_.family])
    family[@dcid] = true

    if !test.invalidate then @test = renew(test)
    else @test = test

    @test.onInvalidate(@invalidateTransform.bind(@))

    this

  getContentComponent: -> if @test() then @then_ else @else_

  clone: -> (new If(@test, @then_.clone(), @else_.clone())).copyEventListeners(@)

  toString: (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<if '+funcString(@test)+'>' + \
        @then_.toString(indent+2, true) + \
        @else_.toString(indent+2, true) + \
        newLine('</if>', indent, true)