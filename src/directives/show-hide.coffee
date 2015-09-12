{registerDirective} = require './register'

### @param test - paramenter expression for directive
###
showHide = (showing) -> (test, display) -> (comp) ->
  comp.showHide(showing, test, display)
  comp

exports.$show = registerDirective '$show',  showHide(true)

exports.$hide = registerDirective '$hide', showHide(false)