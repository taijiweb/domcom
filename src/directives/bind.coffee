{registerDirective} = require './register'
{getInputValueProp} = require '../dom-util'

registerDirective 'bind', (value) -> (comp) ->
  {attrs} = comp
  attrs[getInputValueProp(attrs.type)] = value
  return

