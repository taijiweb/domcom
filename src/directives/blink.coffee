{registerDirective} = require './register'

module.exports = blink = (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.beforeMount (baseComponent) -> -> timer = setInterval (-> visible = !visible), interval
  comp.afterUnmount (baseComponent) -> -> clearInterval timer
  visible = true
  @attrs.style.visibility = ->
    if visible then 'visible'
    else 'hidden'
  comp

registerDirective 'blink', blink