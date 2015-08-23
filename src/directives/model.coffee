{extendEventValue, getInputValueProp} = dc

{registerDirective} = require './register'

module.bindingorts = model = (binding, eventName) -> (comp) ->
  {attrs} = comp
  prop = getInputValueProp(attrs.type)
  attrs[prop] = binding
  extendEventValue attrs, eventName or 'onchange', (-> binding(@[prop])), 'before'
  comp

registerDirective 'model',  model