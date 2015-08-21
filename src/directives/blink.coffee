{registerDirective} = require './register'

module.exports = blink = (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.beforeMount (vtree) -> -> timer = setInterval (-> visible = !visible), interval
  comp.afterUnmount (vtree) -> -> clearInterval timer
  visible = true
  @attrs.style.visibility = ->
    if visible then 'visible'
    else 'hidden'
  return

registerDirective 'blink', blink