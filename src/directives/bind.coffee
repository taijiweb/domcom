{registerDirective} = require './register'
{getBindProp} = dc

module.exports = bind = (binding) -> (comp) ->
  comp.props[getBindProp(comp)] = binding
  comp

registerDirective 'bind', bind