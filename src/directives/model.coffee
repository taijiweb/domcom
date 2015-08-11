{extendEventValue} = require '../core'

# model directive
module.exports = (exp, eventName) -> (comp) ->
  comp.attrs.value = exp
  extendEventValue comp.attrs, eventName or 'onchange', (-> exp(@value)), 'before'
  comp