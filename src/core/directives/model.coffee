{extendEventValue} = require '../property'

# model directive
module.exports = (exp, event) -> (comp) ->
  if !comp.props.value? then comp.activePropertiesCount++
  comp.props.value = exp
  event = event or 'onchange'
  if !comp.events[event]? then comp.activePropertiesCount++
  extendEventValue comp.events, event, ((event, comp) -> exp(@value)), 'before'
  comp