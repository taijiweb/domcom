{react} = flow = require './index'

module.exports = flow

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
    list[i] = value
    if i<listLength
      for component in watchingComponents
        component.invalidateChildren(i, i+1)
    else
      for component in watchingComponents
        component.invalidateChildren(listLength, i+1)
    return

  list.pop = ->
    listLength = list.length
    if !listLength then return
    result = pop.call(this)
    for component in watchingComponents
      component.invalidateChildren(listLength-1, listLength)
    result

  list.push = ->
    oldLength = list.length
    result = push.apply(list, arguments)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(oldLength, listLength)
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

  list.setLength = (length) ->
    oldListLength = list.length
    if length==oldListLength  then return
    list.length = length
    for component in watchingComponents
      if length>oldListLength
        component.invalidateChildren(oldListLength, length)
      else component.invalidateChildren(length, oldListLength)
    return

flow.watchEachList = (list, component) ->
  if !list.watching
    list.watching = true
    mixinListWatcher(list)
  list.watchingComponents.push component

flow.watchEachObject = (object, component) ->
  if !object.watching
    object.watching = true

    object.deleteItem = (key) ->
      delete object[key]
      for component in object.watchingComponents
        if component.watchIteming
          index = component.childComponentMap[key]
          component._items.splice(index, 1)
          component.invalidateChildren(index, component._items.length)

    object.setItem = (key, value) ->
      object[key] = value
      length = component._items.length
      for component in object.watchingComponents
        component._items.push([key, value])
        component.invalidateChildren(length, length+1)

# make itemFn always invalidate childComponent of the Each component
# be careful about this, this will affect the performace
flow.pour = (itemFn) -> itemFn.pouring = true; itemFn