{extendEventValue} = require '../core'
{getInputValueProp} = require '../dom-util'

{registerDirective} = require './register'

registerDirective 'model',  (exp, eventName) -> (comp) ->
  {attrs} = comp
  prop = getInputValueProp(attrs.type)
  attrs[prop] = exp
  extendEventValue attrs, eventName or 'onchange', (-> exp(@[prop])), 'before'
  return