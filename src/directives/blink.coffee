{registerDirective} = require './register'
{see, flow} = dc
{toggle} = flow

module.exports = registerDirective '$blink', (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.beforeMount (baseComponent) -> -> timer = setInterval (-> visible(!visible()); comp.update()), interval
  comp.afterUnmount (baseComponent) -> -> clearInterval timer
  visible = see true
  @style.visibility = flow see, ->
    if visible() then 'visible'
    else 'hidden'
  comp