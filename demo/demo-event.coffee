{list,
a, checkbox, text, p
bindings} = require 'domcom/src/index'
{$a, $b, _a, _b} = bindings({a: 1, b: 2})

module.exports = ->
  comp1 = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child'); event.continuePropagation = true}, 'propagation'))
  comp1.mount()
  comp2 = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child')}, 'do not propagation'))
  comp2.mount()
  # below run ok
  #  comp3 = a({onmouseleave: -> alert('parent')},
  #    p({onmouseleave: (event) -> alert('child'); event.continuePropagation = true}, 'propagation leave'))
  #  comp3.mount()
