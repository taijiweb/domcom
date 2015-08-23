{registerDirective} = require './register'
{getInputValueProp} = dc

module.exports = bind = (binding) -> (comp) ->
  {attrs} = comp
  attrs[getInputValueProp(attrs.type)] = binding
  comp

registerDirective 'bind', bind