{registerDirective} = require './register'
{getBindProp, domValue} = dc

module.exports = registerDirective '$bind', (binding) -> (comp) ->
  comp.setProp(getBindProp(comp), binding, props, 'Props')
  comp