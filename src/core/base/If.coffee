toComponent = require './toComponent'
TransformComponent = require './TransformComponent'
{funcString, newLine, intersect} = require '../../util'
{renew} = require '../../flow'

mergeThenElseValue = (test, thenValue, elseValue) ->
  if typeof thenValue == 'function'
    if typeof elseValue == 'function'
       -> if test() then thenValue() else elseValue()
    else -> if test() then thenValue() else elseValue
  else
    if typeof elseValue == 'function'
      -> if test() then thenValue else elseValue()
    else -> if test() then thenValue else elseValue

maybeIf = (test, then_, else_, options) ->
  if then_==else_ then return then_
  if typeof test == 'function'
    if then_.isTag and else_.isTag and then_.tagName==else_.tagName and then_.namespace==else_.namespace
      attrs = Object.create(null)
      thenAttrs = then_.attrs
      elseAttrs = else_.attrs
      for key of bothKeys(thenAttrs, elseAttrs)
        attrs[key] = mergeThenElseValue(test, thenAttrs[key], elseAttrs[key])
      attrs.namespace = then_.namespace
      new Tag(then_.tagName, attrs, children)
    else if then_.type=='Text' and else_.type=='Text'
      new Text(mergeThenElseValue(test, then_.text, else_.text))
    else if then_.type=='Comment' and else_.type=='Comment'
      new Comment(mergeThenElseValue(test, then_.text, else_.text))
    else if then_.type=='Html' and else_.type=='Html'
      new Html(mergeThenElseValue(test, then_.text, else_.text))
  else if test then then_
  else else_

module.exports = class If extends TransformComponent
  constructor: (test, then_, else_, options) ->
    then_ = toComponent(then_)
    else_ = toComponent(else_)

    if typeof test != 'function'
      return if test then then_ else else_
    else if then_==else_ then return then_

    super(options)

    @family = family = intersect([then_.family, else_.family])
    family[@dcid] = true

    if !test.invalidate then test = renew(test)

    test.onInvalidate(@invalidateTransform.bind(@))

    @getContentComponent = -> if test() then then_ else else_

    @clone = (options) -> (new If(test, then_.clone(), else_clone(), options or @options)).copyEventListeners(@)

    @toString = (indent=0, addNewLine='') ->
      newLine('', indent, addNewLine)+'<if '+funcString(test)+'>' + then_.toString(indent+2, true) + else_.toString(indent+2, true)+newLine('</if>', indent, true)

    this