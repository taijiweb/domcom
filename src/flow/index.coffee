{newLine, funcString} = require '../util'

makeReactive = (method) ->

  method.invalid = true

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
    method.invalid = true
    return

  method

dependent = (computation) ->
  cacheValue = null

  method = ->
    if !arguments.length
      if method.invalid
        method.invalid = false
        cacheValue = computation()
      else cacheValue
    else throw new Error 'flow.dependent is not allowed to accept arguments'

  method.toString = () ->  "dependent: #{funcString(computation)}"

  makeReactive method

module.exports = flow = (deps..., computation) ->
  if !computation.invalidate
    reactive = dependent(computation)
    reactive.toString = () ->  "flow: [#{(for dep in deps then dep.toString()).join(',')}] --> #{funcString(computation)}"
  else reactive = computation
  for dep in deps
    if dep and dep.onInvalidate
      dep.onInvalidate(reactive.invalidate)
  reactive

flow.makeReactive = makeReactive
flow.dependent = dependent
flow.flow = flow

flow.see = see = (value) ->
  cacheValue = value

  method = (value) ->
    if !arguments.length then cacheValue
    else
      if value!=cacheValue
        cacheValue = value
        method.invalidate()
      value

  method.toString = () ->  "see: #{@tagName}"
  makeReactive method

flow.see2 = (computation) ->
  reactive = see computation
  reactive.isDuplex = true
  method.toString = () ->  "see2: #{@tagName}"
  reactive

flow.seen = (computations...) ->
  for computation in computations then see computation

flow.renew = (computation) ->

  method = ->
    if !arguments.length
      method.invalidate()
      value = computation()
    else throw new Error 'flow.dynamic is not allowed to accept arguments'

  method.toString = () ->  "renew: #{funcString(computation)}"

  makeReactive method

flow.bound = bound = (obj, attr, name) ->

  d = Object.getOwnPropertyDescriptor(obj, attr)
  if d then {get, set} = d

  if !set or !set.invalidate
    cacheValue = obj[attr]
    method = (value) ->
      if !arguments.length
        if get then get()
        else cacheValue
      else if value!=obj[attr]
        if set then set(value)
        method.invalidate()
        cacheValue = value
    makeReactive method
    Object.defineProperty(obj, attr, {get:method, set:method})
  else method = set

  reactive = makeReactive (value) ->
    if !arguments.length then obj[attr]
    else if value!=obj[attr] then obj[attr] = value else value

  reactive = flow method, reactive

  reactive.toString = () ->  "#{name or 'm'}[#{attr}]"

  reactive

flow.duplex = (obj, attr, name) ->
  reactive = bound(obj, attr)
  reactive.isDuplex = true
  reactive.toString = () ->  "#{name or 'm'}[#{attr}]"
  reactive
