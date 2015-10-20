{react} = flow = require './index'

module.exports = flow

slice = Array.prototype.slice

flow.watchEachList = (listItems, component) ->
  watchingComponents = listItems.watchingComponents  or listItems.watchingComponents = Object.create(null)
  watchingComponents[component.dcid] = component

  if listItems.$dcWatching then return

  listItems.$dcWatching = true

  shift = listItems.shift
  pop = listItems.pop
  push = listItems.push
  reverse = listItems.reverse
  sort = listItems.sort
  splice = listItems.splice
  unshift  = listItems.unshift

  listItems.setItem = (startIndex, values...) ->
    startIndex = startIndex>>>0
    if startIndex<0 then throw new Error('array index is negative')
    
    listLength = listItems.length
    i = startIndex; j = 0; valuesLength = values.length
    while j<valuesLength then listItems[i] = values[j]; i++; j++
      
    if startIndex<listLength
      for dcid, component of watchingComponents
        component.invalidateChildren(startIndex, i)
    else
      for dcid, component of watchingComponents
        component.invalidateChildren(listLength, i)
    return

  listItems.pop = ->
    listLength = listItems.length
    if !listLength then return
    result = pop.call(this)
    for dcid, component of watchingComponents
      component.invalidateChildren(listLength-1, listLength)
    result

  listItems.push = ->
    oldLength = listItems.length
    result = push.apply(listItems, arguments)
    listLength = listItems.length
    for dcid, component of watchingComponents
      component.invalidateChildren(oldLength, listLength)
    result

  listItems.shift = ->
    if !listItems.length then return
    result = shift.call(this)
    listLength = listItems.length
    for dcid, component of watchingComponents
      component.invalidateChildren(0, listLength)
    result

  listItems.unshift= ->
    result = unshift.apply(listItems, arguments)
    listLength = listItems.length
    for dcid, component of watchingComponents
      component.invalidateChildren(0, listLength)
    result

  listItems.reverse= ->
    listLength = listItems.length
    if listLength <= 1 then return listItems
    reverse.call(listItems)
    for dcid, component of watchingComponents
      component.invalidateChildren(0, listLength)
    listItems

  listItems.sort= ->
    listLength = listItems.length
    if listLength <= 1 then return listItems
    sort.call(listItems)
    for dcid, component of watchingComponents
      component.invalidateChildren(0, listLength)
    listItems

  listItems.splice = (start, deleteCount) ->
    len = arguments.length
    oldListLength = listItems.length
    start  = start>>>0
    if start<0 then start = 0
    if start>oldListLength then start = oldListLength
    inserted = slice.call(arguments, 2)
    result = splice.apply(this, [start, deleteCount].concat(inserted))
    listLength = listItems.length
    for dcid, component of watchingComponents
      if oldListLength==listLength
        component.invalidateChildren(start, start+deleteCount)
      else
        component.invalidateChildren(start, Math.max(oldListLength, listLength) )
    result

  listItems.setLength = (length) ->
    oldListLength = listItems.length
    if length==oldListLength  then return

    listItems.length = length
    for dcid, component of watchingComponents
      if length>oldListLength
        component.invalidateChildren(oldListLength, length)
      else component._setLength(length)

    return

flow.watchEachObject = (objectItems, component) ->

  watchingComponents = objectItems.watchingComponents or objectItems.watchingComponents = Object.create(null)
  watchingComponents[component.dcid] = component

  if objectItems.$dcWatching then return

  objectItems.$dcWatching = true

  objectItems.deleteItem = (keys...) ->
    items = component._items
    oldItemsLength = items.length
    for key in keys
      if !objectItems.hasOwnProperty(key) then continue
      delete objectItems[key]

      for dcid, component of watchingComponents
        min = oldItemsLength
        for [key1, _], index in component.items
          if `key1==key`
            items.splice(index, 1)
            if index<min then min = index
            component.invalidateChildren(min, oldItemsLength)
            break

      oldItemsLength--

  objectItems.setItem = (key, value) ->

    items = component._items

    if objectItems.hasOwnProperty(key)
      if objectItems[key]!=value
        for dcid, component of watchingComponents
          for [key1, _], index in items
            if `key1==key`
              component.invalidateChildren(index, index+1)
              break

    else
      length = _items.length
      for dcid, component of watchingComponents
        _items.push([key, value])
        component.invalidateChildren(length, length+1)

  objectItems.extend = (obj) ->
    for key, value of obj
      objectItems.setItem(key, value)

# make itemFn always invalidate childComponent of the Each component
# be careful about this, this will affect the performace
flow.pour = (itemFn) -> itemFn.pouring = true; itemFn