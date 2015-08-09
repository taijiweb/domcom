# bind
module.exports = (value) -> (comp) ->
  if !comp.props.value? then comp.activePropertiesCount++
  props = comp.props
  props.value = value
  comp