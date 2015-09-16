{list, div} = dc

module.exports = ->
  div1 = div 'toggle me'
  list \
    div onclick: (-> div1.mount()), 'mount',
    div onclick:  (-> div1.unmount()), 'unmount'
