{react} = flow = require './index'


mixinListWatcher = (list) ->

  pop = list.pop
  push = list.push
  reverse = list.reverse
  shift = list.shift
  sort = list.sort
  unshift  = list.unshift

  list.watchingComponents = watchingComponents = []

  list.setItem = (i, value) ->
    i = i>>>0
    if i<0 then throw new Error('array index is negative')
    listLength = list.length
    if i<listLength
      for component in watchingComponents
        component.invalidateChild(i)
    else
      for component in watchingComponents
        component.invalidateChildren(listLength, i)
    return

  list.pop = ->
    listLength = list.length
    if !listLength then return
    result = pop.call(this)
    for component in watchingComponents
      component.invalidateChild(listLength-1)
    result

  list.push = ->
    oldLength = list.length
    result = push.apply(list, arguments)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChild(oldLength, listLength)
    result

  list.shift = ->
    if !list.length then return
    result = shift.call(this)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
    result

  list.unshift= ->
    result = unshift.apply(list, arguments)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
    result

  list.reverse= ->
    listLength = list.length
    if listLength <= 1 then return list
    reverse.call(list)
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
    list

  list.sort= ->
    listLength = list.length
    if listLength <= 1 then return list
    sort.call(list)
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
    list

  list.splice = (start, deleteCount) ->
    len = arguments.length
    listLength = list.length
    if !len or start>>>0 >= list.length or deleteCount>>>0 <= 0 then return []
    result = splice.apply(this, arguments)
    for component in watchingComponents
      component.invalidateChildren(start, Math.max(listLength, start+deleteCount))
    result

module.exports = flow

flow.watchEachList = (list, component) ->
  if !list.watching
    list.watching = true
    mixinListWatcher(list)
  list.watchingComponents.push component

flow.watchEachObject = (object, component) ->
  if !object.watching
    object.watching = true
    mixinListWatcher(list)
  object.watchingComponents.push component

