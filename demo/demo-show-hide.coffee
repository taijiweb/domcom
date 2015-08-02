{bindings
list,
text, div, p} = require 'domcom/src/index'

module.exports = demoClickToChangeStyle = ->
  x = true
  comp = list(
    div({onclick: -> x = !x; comp.update()}, 'change style'),
    p({class:Object.create(null), style:{display: -> if x then 'block' else 'none'}}, 'asdfdfs')
  )
  comp.mount()

