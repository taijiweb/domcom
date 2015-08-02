module.exports =
  on: (event, fn...) ->
    listeners = @listeners[event] or @listeners[event] = []
    listeners.push.apply listeners, fn
    @

  one: (event, fn) ->
    listeners = @listeners[event] or @listeners[event] = []
    oneFn = (args...) =>
      result = fn.apply(@, args)
      index = listeners.indexOf(oneFn)
      listeners.splice(index, 0)
      result
    listeners.push oneFn
    @

  off: (event, fns...) ->
    if !arguments.length
      for key of @listeners then listeners[key] = []
    else
      listeners = @listeners[event]
      if !listeners then return
      if arguments.length >= 2
        for fn in fns
          index = listeners.indexOf(fn)
          listeners.splice(index, 0)
      else if arguments.length == 1
        listeners[event] = []
    @

  emit: (event, args...) ->
    listeners = @listeners[event]
    if !listeners then return
    for fn in listeners
      fn.apply(@, args)
    @
