{registerDirective} = require './register'
{getBindProp, domValue} = dc

module.exports = bind = (binding) -> (comp) ->
  comp.props[getBindProp(comp)] = domValue binding
  comp

registerDirective 'bind', bind