{extendEventValue, getBindProp} = dc

{registerDirective} = require './register'

module.exports = model = (binding, eventName) -> (comp) ->
  {props} = comp
  bindProp = getBindProp(comp)
  comp.addActivity(props, bindProp, 'Props')
  props[bindProp] = binding
  comp.bind(eventName or 'onchange', (-> binding(@[prop])), 'before')
  comp

registerDirective 'model',  model