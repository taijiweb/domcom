{newLine, funcString} = require './util'

exports.makeReactive = makeReactive = (method) ->

  method.needUpdate = true

  invalidateCallbacks = []

  method.onInvalidate = (callback) ->
    invalidateCallbacks = invalidateCallbacks or []
    invalidateCallbacks.push(callback)

  method.offInvalidate = (callback) ->
    if !invalidateCallbacks then return
    index = invalidateCallbacks.indexOf(callback)
    if index<0 then return
    invalidateCallbacks.splice(index, 1)
    if !invalidateCallbacks then invalidateCallbacks = null

  method.invalidate = ->
    if !invalidateCallbacks then return
    for callback in invalidateCallbacks
     callback()
    method.needUpdate = true
    return

  method

exports.see = see = (value) ->
  cacheValue = value

  method = (value) ->
    if !arguments.length then cacheValue
    else
      if value!=cacheValue
        cacheValue = value
        method.invalidate()
      value

  method.toString = () ->  "see: #{@tagName}"
  makeReactive method, true

exports.see2 = (computation) ->
  reative = see computation
  reative.isDuplex = true
  method.toString = () ->  "see2: #{@tagName}"
  reative

exports.seen = (computations...) ->
  for computation in computations then see computation

exports.watch = watch = (computation) ->
  cacheValue = null

  method = ->
    if !arguments.length
      if method.needUpdate
        method.needUpdate = false
        cacheValue = computation()
      else cacheValue
    else throw new Error 'flow.watch is not allowed to accept arguments'

  method.toString = () ->  "watch: #{funcString(computation)}"

  makeReactive method, false

exports.renew = (computation) ->

  method = ->
    if !arguments.length
      method.invalidate()
      value = computation()
    else throw new Error 'flow.dynamic is not allowed to accept arguments'

  method.toString = () ->  "renew: #{funcString(computation)}"

  makeReactive method, false

exports.flow = flow = (deps..., computation) ->
  reative = watch(computation)
  for dep in deps
    dep.onInvalidate(reative.invalidate)
  reative.toString = () ->  "flow: [#{(for dep in deps then dep.toString()).join(',')}] --> #{funcString(computation)}"
  reative

exports.bound = bound = (obj, attr, name) ->
  cacheValue = null
  d = Object.getOwnPropertyDescriptor(obj, attr)
  {get, set} = d
  cacheValue = obj[attr]
  method = (value) ->
    if !arguments.length
      if get then get()
      else cacheValue
    else if value!=obj[attr]
      if set then set(value)
      method.invalidate()
      cacheValue = value

  Object.defineProperty obj, attr, {get:method, set: method}

  method.toString = () ->  "#{name or 'm'}[#{attr}]"

  makeReactive method, false

exports.duplex = (obj, attr, name) ->
  reative = bound(obj, attr)
  reative.isDuplex = true
  reative.toString = () ->  "#{name or 'm'}[#{attr}]"
  reative

exports.watchList = (list) ->
  mixinListWatchHandlers(list)
  list.listWatcher

exports.watchItem = (list, index) ->
  if list instanceof Array
    mixinListWatchHandlers(list)
    cacheValue =  list[index]
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
      method
  else if typeof list == 'funtion'
    flow.binary(list, index, (x, y) -> x[y])
  else throw new Error 'watchItem expect list to be an array or a function'

mixinListWatchHandlers = (list) ->
  if list.watching then return
  constructor = list.constructor
  pop = constructor.prototype.pop
  push = constructor.prototype.push
  reverse = constructor.prototype.reverse
  shift = constructor.prototype.shift
  sort =constructor.prototype.sort
  unshift  = constructor.prototype.unshift
  list.itemWatchers = itemWatchers = []
  list.watching = true

  list.listWatcher = listWatcher = -> list
  makeReactive listWatcher, true

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
        if itemWatcher[j] then itemWatcher[j].invalidate()
      if itemWatcher[i] then itemWatcher[i](value)
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