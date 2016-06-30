module.exports = dcEventMixin =
  on: (event, callback) ->
    if !arguments.length
      dc.error('missing arguments for Component.on(event, callback)')
    if arguments.length == 1
      if !event || typeof event != 'object'
        dc.error('wrong arguments for Component.on(event, callback)')
      else
        for eventName, callback of event
          this.on(eventName, callback)
    else
      if !(listeners = this.listeners)
        this.listeners = listeners = {}
      for event in event.split(/\s*,\s*|\s+/)
        if callbacks = listeners[event]
          if callbacks.indexOf(callback) < 0
            callbacks.push(callback)
        else
          listeners[event] = [callback]
    this

  off: (event, callback) ->
    if !arguments.length
      this.listeners = {}
    else if arguments.length==1
      listeners = this.listeners
      for event in event.split(/\s*,\s*|\s+/)
        listeners[event] = null
    else
      listeners = this.listeners
      for event in event.split(/\s*,\s*|\s+/)
        callbacks = listeners[event]
        if callbacks && (index = callbacks.indexOf(callback)) >= 0
          callbacks.splice(index, 1)
          if !callbacks.length
            listeners[event] = null
    this

  once: (event, callback) ->
    onceCallback = (args...) ->
      this.off(event, onceCallback)
      callback.apply(this, args)
    this.on(event, onceCallback)

  emit: (event, args...) ->
    if !this.destroyed
      if this.listeners && callbacks = this.listeners[event]
        # need to be copied, because onceCallback will be removed from this.listeners[event]
        callbacks = callbacks.slice()
        for callback in callbacks
          callback.apply(this, args)
      else
        if method = this['on'+event]
          method.apply(this, args)
    this
