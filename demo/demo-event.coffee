{list,
a, checkbox, text, p
bindings} = dc
{$a, $b, _a, _b} = bindings({a: 1, b: 2})

module.exports = ->
  propagation = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child'); event.continuePropagation = true}, 'propagation'))
  #propagation.mount()
  noPropagation = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child')}, 'do not propagation'))
  noPropagation.mount()
  # below run ok
  #  comp3 = a({onmouseleave: -> alert('parent')},
  #    p({onmouseleave: (event) -> alert('child'); event.continuePropagation = true}, 'propagation leave'))
  #  comp3.mount()
  list(propagation, noPropagation)