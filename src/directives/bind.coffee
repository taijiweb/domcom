{registerDirective} = require './register'
{getInputValueProp} = require '../dom-util'

module.exports = bind = (binding) -> (comp) ->
  {attrs} = comp
  attrs[getInputValueProp(attrs.type)] = binding
  return

registerDirective 'bind', bind