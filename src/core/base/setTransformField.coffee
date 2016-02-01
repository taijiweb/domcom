module.exports = (component, value, field) ->
  component.__originalValue = value
  if typeof value == 'function'
    if !value.invalidate
      component[field] = renew(value)
    else component[field] = value
    component[field].onInvalidate(-> component.invalidateTransform())
  else
    component[field] = value