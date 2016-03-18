config = require('../../config')

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

exports.eventHandlerFromArray = (callbackList, eventName) ->
  (event) ->
    component = this.component

    for fn in callbackList
      if fn
        fn.call(this, event, component)

    if (updating = component.eventUpdateConfig[eventName])?
      dc.update(updating)

    if !event
      return

    if !event.executeDefault
      event.preventDefault()
    if !event.continuePropagation
      event.stopPropagation()

    return
