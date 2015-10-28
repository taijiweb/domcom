{getBindProp, domField} = require("../dom-util")

module.exports = (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, props, 'Props')
  comp