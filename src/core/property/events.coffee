exports.domEventHandler = (event) ->
  if component = this.component
    eventType = 'on' + event.type

    domEventCallbacks = component.domEventCallbackMap[eventType]
    for fn in domEventCallbacks
      result = fn.call(component, event, this)

    if componentMap = component.eventUpdateConfig[eventType]
      for _, comp of componentMap
        comp.render()
      dc.clean()

    if event
      if !event.executeDefault && event.preventDefault
        event.preventDefault()
      if !event.continuePropagation && event.stopPropagation
        event.stopPropagation()

  if event && event.dcEventResult?
    event.dcEventResult
  else
    result

# the event in addEventListenerMap do not execute node[eventName]
# e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
# [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
# so it's necessary to addEventListener
exports.addEventListenerMap = addEventListenerMap = {}
# todo: finish the full list
for eventName in 'compositionstart compositionupdate compositionend'.split(/\s/)
  addEventListenerMap['on' + eventName] = true

exports.domEventHandlerFromArray = (callbackArray) ->
  (event) ->
    for fn in callbackArray
      fn && fn.call(this.component, event, this)
    return

exports.extendEventValue = extendEventValue = (props, prop, value, before) ->
  oldValue = props[prop]

  if !oldValue
    oldValue = []
  else if !(oldValue instanceof Array)
    oldValue = [oldValue]

  if !value
    value = []
  else if !(value instanceof Array)
    value = [value]

  if before
    props[prop] = value.concat(oldValue)
  else
    props[prop] = oldValue.concat(value)

exports.addHandlerToCallbackArray = (handler, callbacks, before) ->
  if typeof handler == 'function'
    handler = [handler]
  if before
    callback = handler.pop()
    while callback
      if !callback
        dc.error('addHandlerToCallbackArray: callback is undefined')
      index = callbacks.indexOf(callback)
      if index <= 0
        callbacks.unshift(callback)
      callback = handler.pop()
  else
    for callback in handler
      if !callback
        dc.error('addHandlerToCallbackArray: callback is undefined')
      index = callbacks.indexOf(callback)
      if index <= 0
        callbacks.push(callback)
  return