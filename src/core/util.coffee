# this module is not finished yet!!!

{isComponent, toComponent} = require('./base')

Func = require "./base/Func"
Text = require "./base/Text"
Html = require "./base/Html"
Comment = require "./base/Comment"

exports.isAttrs = (item) ->
  typeof item == 'object' and item!=null and !isComponent(item) and item not instanceof Array

mergeThenElseValue = (test, thenValue, elseValue) -> dc.flow.if_(test, thenValue, elseValue)

exports._maybeIf = (test, then_, else_) ->
  then_ = toComponent then_
  else_ = toComponent else_

  if then_==else_ then return then_

  if then_ instanceof Nothing and else_ instanceof Nothing then return then_

  if typeof test == 'function'

    if then_.isTag and else_.isTag and then_.tagName==else_.tagName and then_.namespace==else_.namespace
      attrs = {}
      thenAttrs = then_.attrs
      elseAttrs = else_.attrs
      for key of bothKeys(thenAttrs, elseAttrs)
        attrs[key] = mergeThenElseValue(test, thenAttrs[key], elseAttrs[key])
      attrs.namespace = then_.namespace

      new Tag(then_.tagName, attrs, children)

    else if then_ instanceof Text and else_ instanceof Text
      new Text(mergeThenElseValue(test, then_.text, else_.text))
    else if then_ instanceof Comment and else_  instanceof Comment
      new Comment(mergeThenElseValue(test, then_.text, else_.text))
    else if then_  instanceof Html and else_  instanceof Html
      new Html(mergeThenElseValue(test, then_.text, else_.text))

    else if then_ instanceof Func and else_ instanceof Func
      new Func(flow.if_(test, then_.func, else_.func))

    else new If(test, then_, else_)

  else if test then then_

  else else_
