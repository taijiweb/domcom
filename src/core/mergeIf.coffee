extend = require('extend')

Tag = require('./base/Tag')
List = require('./base/List')
Nothing = require('./base/Nothing')

{eventHandlerFromArray} = require('./property')

flow = require('lazy-flow/addon')
flowIf = flow.if_

# do not need toComponent
# do not need check whether test is a function
# because mergeIf is called in If component constructor,
# after then_, else_ was converted to component
# and check test is a function
exports = module.exports = mergeIf = (test, then_, else_, recursive) ->

  If = require('./base/If')

  if then_==else_
    return then_

  else if ( then_.constructor==Tag and else_.constructor==Tag and
       then_.tagName == else_.tagName and then_.namespace==else_.namespace)

    children = mergeIfChildren(test, then_, else_, recursive)

    component = new Tag(then_.tagName, {}, children)

    className = mergeIfClassFn(test, then_.className, else_.className)
    props = mergeIfProps(test, then_.props, else_.props)
    style = mergeIfProps(test, then_.style, else_.style)
    events = mergeIfEvents(test, then_.events, else_.events, component)

    component
      .addClass(className)
      .prop(props)
      .css(style)
      .bind(events)

  else if then_.isHtml and else_.isHtml
    thenTransform = then_.transform
    elseTransform = else_.transform
    transform = (text) ->
      if test()
        thenTransform and thenTransform(text) or text
      else
        elseTransform and elseTransform(text) or text
    new then_.constructor(flowIf(test, then_.text, else_.text), transform)

  # this is for Text, Comment and Cdata
  else if then_.isText and else_.isText and then_.constructor == else_.constructor
    new then_.constructor(flowIf(test, then_.text, else_.text))

  else if then_.isNothing and else_.isNothing
    return then_

  # List component
  else if then_.isList and else_.isList
    return new List(mergeIfChildren(test, then_, else_, recursive))

  else
     new If(test, then_, else_)

mergeIfChild = (test, then_, else_, recursive) ->
  if !recursive and (then_.isList or else_.isList)
    # whether another is List or not, then_ and else_ should or could not be merged
    if_(test, then_, else_)
  else
    mergeIf(test, then_, else_, recursive)

exports.mergeIfChildren = mergeIfChildren = (test, then_, else_, recursive) ->

  thenChildren = then_.children
  elseChildren = else_.children
  thenChildrenLength = thenChildren.length
  elseChildrenLength = elseChildren.length

  if thenChildrenLength == elseChildrenLength
    children = new Array(thenChildrenLength)
    for thenItem, i in thenChildren
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive)

  else if thenChildrenLength < elseChildrenLength
    children = new Array(elseChildrenLength)
    for thenItem, i in thenChildren
      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive)

    while i < elseChildrenLength
      children[i] = mergeIf(test, new Nothing(), elseChildren[i])
      i++

  else # if thenChildrenLength > elseChildrenLength
    children = new Array(thenChildrenLength)
    for elseItem, i in elseChildren
      children[i] = mergeIfChild(test, thenChildren[i], elseItem, recursive)

    while i < thenChildrenLength
      children[i] = mergeIf(test, thenChildren[i], new Nothing())
      i++

  children

mergeIfClassFn = (test, thenClassName, elseClassName) ->
  mergeIfProps(test, thenClassName.classMap, elseClassName.classMap)

mergeIfProps = (test, thenProps, elseProps) ->
  unified = extend({}, thenProps, elseProps)
  for prop of unified
    unified[prop] = flowIf(test, thenProps[prop], elseProps[prop])
  unified

emptyEventCallback = ->

mergeIfEvents = (test, thenEvents, elseEvents, component) ->

  unified = extend({}, thenEvents, elseEvents)

  for eventName of unified

    if thenCallbackList = thenEvents[eventName]
      thenHandler = eventHandlerFromArray(thenCallbackList[...], eventName, component)
    else 
      thenHandler = emptyEventCallback

    if elseCallbackList = elseEvents[eventName]
      elseHandler = eventHandlerFromArray(elseCallbackList[...], eventName, component)
    else
      elseHandler = emptyEventCallback

    unified[eventName] = (event) ->
      if test()
        thenHandler.call(component.node, event, component)
      else
        elseHandler.call(component.node, event, component)

  unified