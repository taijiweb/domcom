# blink
module.exports = (interval) -> (comp) ->
  if !interval? then interval = 500
  timer = null
  comp.beforeMount -> timer = setInterval (-> visible = !visible), interval
  comp.afterUnmount -> clearInterval timer
  visible = true
  if !comp.style.visibility? then comp.activePropertiesCount++
  @style.visibility = ->
    if visible then 'visible'
    else 'hidden'
  comp
