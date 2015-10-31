{list,
text, div, p, see, flow} = dc

toggle = flow.toggle

module.exports = ->
  x = see true
  comp = list(
    div({onclick: -> toggle x; comp.update()}, 'show/hide by changing style.display'),
    p({class:{}, style:{display: -> if x() then 'block' else 'none'}}, 'asdfdfs')
  )
  #comp.mount()

