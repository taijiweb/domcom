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

  list.setItem = (startIndex, values...) ->
    startIndex = startIndex>>>0
    if startIndex<0 then throw new Error('array index is negative')
    listLength = list.length
    i = startIndex; j = 0; valuesLength = values.length
    while j<valuesLength then list[i] = values[j]; i++; j++
    if startIndex<listLength
      for component in watchingComponents
        component.invalidateChildren(startIndex, i)
    else
      for component in watchingComponents
        component.invalidateChildren(listLength, i)
        component.listComponent.length = i
    return

  list.pop = ->
    listLength = list.length
    if !listLength then return
    result = pop.call(this)
    for component in watchingComponents
      component.invalidateChildren(listLength-1, listLength)
      component.listComponent.length = list.length
    result

  list.push = ->
    oldLength = list.length
    result = push.apply(list, arguments)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(oldLength, listLength)
      component.listComponent.length = listLength
    result

  list.shift = ->
    if !list.length then return
    result = shift.call(this)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
      component.listComponent.length = listLength
    result

  list.unshift= ->
    result = unshift.apply(list, arguments)
    listLength = list.length
    for component in watchingComponents
      component.invalidateChildren(0, listLength)
      component.listComponent.length = listLength
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
    if !len or start>>>0 >= list.length or deleteCount>>>0 <= 0 then return []
    oldListLength = list.length
    result = splice.apply(this, arguments)
    listLength = list.length
    for component in watchingComponents
      if newListLength==listLength
        component.invalidateChildren(start, start+deleteCount)
      else
        component.invalidateChildren(start, Math.max(oldListLength, listLength) )
        component.listComponent.length = listLength
    result

  list.setLength = (length) ->
    oldListLength = list.length
    if length==oldListLength  then return
    list.length = length
    for component in watchingComponents
      if length>oldListLength
        component.invalidateChildren(oldListLength, length)
      else component.invalidateChildren(length, oldListLength)
      component.listComponent.length = length
    return

flow.watchEachList = (list, component) ->
  if !list.watching
    list.watching = true
    mixinListWatcher(list)
  list.watchingComponents.push component

flow.watchEachObject = (object, component) ->
  if !object.watching
    object.watching = true

    object.deleteItem = (keys...) ->
      for key in keys then delete object[key]
      for component in object.watchingComponents
        if component.watchingItem
          oldItemsLength = component._items.length
          min = oldItemsLength
          for key in keys
            index = component.childComponentMap[key]
            component._items.splice(index, 1)
            if index<min then min = index
          component.invalidateChildren(min, oldItemsLength)
          component.listComponent.length = component._items.length

    object.setItem = (key, value) ->
      object[key] = value
      length = component._items.length
      for component in object.watchingComponents
        if component.watchingItem
          component._items.push([key, value])
          component.invalidateChildren(length, length+1)
          component.listComponent.length = component._items.length

    object.extend = (obj) ->
      for key, value of obj
        object[key] = value
      length = component._items.length
      for component in object.watchingComponents
        if component.watchingItem
          for key, value of obj then object[key] = value
          component._items.push([key, value])
          component.invalidateChildren(length, component._items.length)
          component.listComponent.length = component._items.length

# make itemFn always invalidate childComponent of the Each component
# be careful about this, this will affect the performace
flow.pour = (itemFn) -> itemFn.pouring = true; itemFn