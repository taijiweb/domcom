{styleDisplayOfShow} = require '../core'

### @param test - paramenter expression for directive
###
showHide = (needShow) -> (test, showDisplay) ->
  (comp) ->
    display = comp.style.display
    if !display? then comp.activePropertiesCount++
    if typeof display == 'function' then display = display()
    comp.cacheStyle.oldDisplay = display or ''
    comp.style.display = ->
      if typeof test == 'function' then testValue = !!test()
      else testValue = !!test
      comp.styleDisplayOfShow(testValue==needShow, showDisplay)
    comp
    
exports.show = showHide(true)
exports.hide = showHide(false)