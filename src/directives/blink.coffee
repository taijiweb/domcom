{see, flow} = require('lazy-flow')

module.exports = (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.on 'willMount', (baseComponent) -> -> timer = setInterval (-> visible(!visible()); dc.update()), interval
  comp.on 'unmount', (baseComponent) -> -> clearInterval timer
  visible = see true
  @style.visibility = flow visible, ->
    if visible() then 'visible'
    else 'hidden'
  comp