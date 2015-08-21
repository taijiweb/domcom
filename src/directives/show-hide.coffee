{registerDirective} = require './register'

### @param test - paramenter expression for directive
###
showHide = (needShow) -> (test, showDisplay) ->
  (comp) ->
    style = comp.attrs.style
    display = style.display
    if typeof display == 'function' then display = display()
    style.display = ->
      if typeof test == 'function' then testValue = !!test()
      else testValue = !!test
      comp.styleDisplayOfShow(testValue==needShow, showDisplay)
    return

exports.show = show = showHide(true)
registerDirective 'show', show

exports.hide = hide = showHide(false)
registerDirective 'hide', hide