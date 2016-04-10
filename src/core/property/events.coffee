exports.extendEventValue = extendEventValue = (props, prop, value, before) ->
  oldValue = props[prop]

  if !oldValue
    oldValue = []
  else if oldValue not instanceof Array
    oldValue = [oldValue]

  if !value
    value = []
  else if value not instanceof Array
    value = [value]

  if before
    props[prop] = value.concat(oldValue)
  else
    props[prop] = oldValue.concat(value)

exports.domEventHandler = (event) ->
  eventType = 'on' + event.type
  component = this.component
  domEventCallbacks = component.domEventCallbackMap[eventType]
  for fn in domEventCallbacks
    if fn
      fn.call(this, event)

  # it is necessary to check "this.component"
  # because maybe "this.component" is destroyed in fn.call(this, event)
  # and node.component is set to null
  if (updating = this.component && this.component.eventUpdateConfig[eventType])?
    dc.update(updating)
  else dc.update()

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
