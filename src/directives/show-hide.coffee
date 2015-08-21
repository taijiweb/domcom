{registerDirective} = require './register'

### @param test - paramenter expression for directive
###
showHide = (showing) -> (test, display) -> (comp) ->
  comp.showHide(showing, test, display)

exports.show = show = showHide(true)
registerDirective 'show', show

exports.hide = hide = showHide(false)
registerDirective 'hide', hide