{see, flow} = require("../flow/index")

module.exports = (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.on 'beforeMount', (baseComponent) -> -> timer = setInterval (-> visible(!visible()); comp.update()), interval
  comp.on 'afterUnmount', (baseComponent) -> -> clearInterval timer
  visible = see true
  @style.visibility = flow visible, ->
    if visible() then 'visible'
    else 'hidden'
  comp