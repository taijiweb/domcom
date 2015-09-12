{registerDirective} = require './register'
{getBindProp, domValue} = dc

module.exports = registerDirective '$bind', (binding) -> (comp) ->
  comp.props[getBindProp(comp)] = domValue binding
  comp