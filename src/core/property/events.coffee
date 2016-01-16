config = require '../../config'

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

exports.eventHandlerFromArray = (callbackList, eventName, component) ->
  (event) ->
    node = component.node

    for fn in callbackList
      if fn
        fn.call(node, event, component)

    updateList = component.eventUpdateConfig[eventName]
    if updateList
      for [comp, options] in updateList
        # the comp is in updateList, so it need to be updated
        # if config.useSystemUpdating then update this component in dc's system update scheme
        if options.alwaysUpdating or !config.useSystemUpdating
          comp[options.method]()

    if !event
      return

    if !event.executeDefault
      event.preventDefault()
    if !event.continuePropagation
      event.stopPropagation()

    return