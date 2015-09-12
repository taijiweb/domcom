{extendEventValue, getBindProp} = dc

{registerDirective} = require './register'

module.exports = registerDirective '$model', (binding, eventName) -> (comp) ->
  {props} = comp
  bindProp = getBindProp(comp)
  comp.addActivity(props, bindProp, 'Props')
  props[bindProp] = binding
  comp.bind(eventName or 'onchange', (-> binding(@[bindProp])), 'before')
  comp