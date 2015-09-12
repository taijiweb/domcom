{extendEventValue, getBindProp} = dc

{registerDirective} = require './register'

module.exports = registerDirective '$model', (binding, eventName) -> (comp) ->
  {props} = comp
  bindProp = getBindProp(comp)
  comp.setProp(bindProp, binding, props, 'Props')
  comp.bind(eventName or 'onchange', (-> binding(@[bindProp])), 'before')
  comp