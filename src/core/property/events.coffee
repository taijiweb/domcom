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

exports.domEventHandler = (event) ->
  if component = this.component
    eventType = 'on' + event.type
    domEventCallbacks = component.domEventCallbackMap[eventType]
    for fn in domEventCallbacks
      if fn
        fn.call(this, event)

    if componentMap = component.eventUpdateConfig[eventType]
      for _, component of componentMap
        component.render()

    if event
      if !event.executeDefault && event.preventDefault
        event.preventDefault()
      if !event.continuePropagation && event.stopPropagation
        event.stopPropagation()

  return

exports.domEventHandlerFromArray = (callbackArray) ->
  (event) ->
    for fn in callbackArray
      fn && fn.call(this, event)
    return
