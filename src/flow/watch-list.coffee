{react, binary} = flow = require './index'

pop = Array::pop
push = Array::push
reverse = Array::reverse
shift = Array::shift
sort = Array::sort
unshift  = Array::unshift

mixinListWatchHandlers = (list) ->
  if list.watching then return
  list.watching = true
  list.itemWatchers = itemWatchers = []

  list.listWatcher = listWatcher = -> list
  react listWatcher

  list.setItem = (i, value) ->
    i = i>>>0
    if i<0 then throw new Error('array index is negative')
    if i<list.length
      if list[i]!=value
        listWatcher.invalidate()
        if itemWatchers[i] then itemWatchers[i](value)
        else list[i] = value
    else
      listWatcher.invalidate()
      j = list.length
      while j<i
        if itemWatchers[j] then itemWatchers[j].invalidate()
      if itemWatchers[i] then itemWatchers[i](value)
      else list[i] = value

  list.pop = ->
    if !list.length then return
    listWatcher.invalidate()
    element = pop.call(this)
    if itemWatchers[list.length]
      itemWatchers[list.length].invalidate()

  list.push = ->
    listWatcher.invalidate()
    oldLength = list.length
    result = element = push.apply(list, arguments)
    i = oldLength
    while i<list.length
      if itemWatchers[i]
        itemWatchers[i].invalidate()
      i++
    result

  list.reverse= ->
    if list.length <= 1 then return list
    tmp = list.slice()
    reverse.call(list)
    i = 0
    while i<list.length
      changed = false
      if list[i]!=tmp[i]
        if itemWatchers[i] then itemWatchers[i].invalidate()
        changed = true
      i++
    if changed then listWatcher.invalidate()
    list

  list.shift= ->
    if !list.length then return
    listWatcher.invalidate()
    tmp = list.slice()
    shift.call(list)
    i = 0
    while i<list.length
      if list[i]!=tmp[i] and itemWatchers[i]
        itemWatchers[i].invalidate()
      i++
    list

  list.unshift= ->
    listWatcher.invalidate()
    tmp = list.slice()
    unshift.call(list)
    i = 0
    while i<list.length
      if list[i]!=tmp[i] and itemWatchers[i]
        itemWatchers[i].invalidate()
      i++
    list

  list.sort= ->
    tmp = list.slice()
    sort.call(list)
    i = 0
    changed = false
    while i<list.length
      if list[i]!=tmp[i] and itemWatchers[i]
        changed = true
        itemWatchers[i].invalidate()
      i++
    if changed then listWatcher.invalidate()
    list

  list.splice = (start, deleteCount) ->
    len = arguments.length
    if !len then return []
    if start>>>0 >= list.length then return []
    if deleteCount>>>0 <= 0 then return []
    items = slice.call(arguments, 2)
    if deleteCount==items.length
      tmp = list.slice(start, deleteCount)
    else tmp = list.slice(start)
    result = splice.apply(this, arguments)
    if deleteCount==items.length
      i = start; j = 0
      changed = false
      while j<deleteCount
        if list[i]!=items[i]
          if itemWatchers[i] then itemWatchers[i].invalidate()
          changed = true
        i++; j++
      if changed then listWatcher.invalidate()
    else
      listWatcher.invalidate()
      i = start; j = 0;
      while i<Math.max(list.length, i+deleteCount)
        if list[i]!=tmp[i] and itemWatchers[i]
          itemWatchers[i].invalidate()
        i++; j++
    result

module.exports = flow

dc.watchList = flow.watchList = (list) ->
  mixinListWatchHandlers(list)
  list.listWatcher

dc.watchItem = flow.watchItem = (list, index) ->
  if list instanceof Array
    mixinListWatchHandlers(list)
    cacheValue =  list[index]
    itemWatchers = list.itemWatchers
    if !itemWatchers[index]
      itemWatchers[index] = method = (value) ->
        if !arguments.length then cacheValue
        else
          if value!=cacheValue
            cacheValue = value
            list[index] = value
            method.invalidate()
          value
      method.toString = () ->  "watchItem: #{list}[#{index}]"
      react method
    else itemWatchers[index]
  else if typeof list == 'funtion'
    binary(list, index, (x, y) -> x[y])
  else throw new Error 'watchItem expect list to be an array or a function'
