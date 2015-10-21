{getBindProp, domValue} = dc

module.exports = (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, props, 'Props')
  comp