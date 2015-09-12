{bindings
list,
text, div, p, see, flow} = dc

toggle = flow.toggle

module.exports = ->
  x = see true
  comp = list(
    div({onclick: -> toggle x; comp.update()}, 'change style'),
    p({class:Object.create(null), style:{display: -> if x() then 'block' else 'none'}}, 'asdfdfs')
  )
  #comp.mount()

