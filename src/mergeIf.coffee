import Tag from './component/Tag'
import List from './component/List'
import Nothing from './component/Nothing'

import {domEventHandlerFromArray} from './property/events'

flow from 'lazy-flow/addon'
flowIf = flow.if_

# do not need toBlock
# do not need check whether test is a function
# because mergeIf is called in If component constructor,
# after then_, else_ was converted to component
# and check test is a function
exports = module.exports = mergeIf = (test, then_, else_, recursive) ->

  If from './component/If'

  if then_==else_
    return then_

  else if ( then_.constructor==Tag && else_.constructor==Tag &&
       then_.tagName == else_.tagName && then_.namespace==else_.namespace)

    children = mergeIfChildren(test, then_, else_, recursive)

    component = new Tag(then_.tagName, {}, children)

    className = mergeIfClassFn(test, then_.className, else_.className)
    props = mergeIfProps(test, then_.props, else_.props)
    style = mergeIfProps(test, then_.style, else_.style)
    events = mergeIfEvents(test, then_.domEventCallbackMap, else_.domEventCallbackMap)

    component
      .addClass(className)
      .prop(props)
      .css(style)
      .bind(events)

  else if then_.isHtml && else_.isHtml
    thenTransform = then_.transform
    elseTransform = else_.transform
    transform = (text) ->
      if test()
        thenTransform && thenTransform(text) || text
      else
        elseTransform && elseTransform(text) || text
    new then_.constructor(flowIf(test, then_.text, else_.text), transform)

  # this is for Text, Comment and Cdata
  else if then_.isText && else_.isText && then_.constructor == else_.constructor
    new then_.constructor(flowIf(test, then_.text, else_.text))

  else if then_ instanceof Nothing && else_ instanceof Nothing
    return then_

  # List component
  else if then_.isList && else_.isList
    return new List(mergeIfChildren(test, then_, else_, recursive))

  else
     new If(test, then_, else_, false, false, true)  # merge, recursive, forceIf

mergeIfChild = (test, then_, else_, recursive) ->
  if !recursive && (then_.isList || else_.isList)
    # whether another is List or not, then_ and else_ should or could not be merged
    If from './component/If'
    new If(test, then_, else_, false, false, true) # merge, recursive, forceIf
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

mergeIfEvents = (test, thenEventCallbackMap, elseEventCallbackMap) ->

  unified = extend({}, thenEventCallbackMap, elseEventCallbackMap)

  for eventName of unified

    if thenCallbackList = thenEventCallbackMap[eventName]
      thenHandler = domEventHandlerFromArray(thenCallbackList[...])
    else
      thenHandler = emptyEventCallback

    if elseCallbackList = elseEventCallbackMap[eventName]
      elseHandler = domEventHandlerFromArray(elseCallbackList[...])
    else
      elseHandler = emptyEventCallback

    unified[eventName] = (event) ->
      if test()
        thenHandler.call(this, event)
      else
        elseHandler.call(this, event)

  unified
