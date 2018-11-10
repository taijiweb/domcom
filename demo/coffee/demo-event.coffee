{list,
a, checkbox, text, p} = dc

export default  ->
  propagation = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child'); event.continuePropagation = true}, 'propagation'))
  noPropagation = a({onclick: -> alert('parent')},
    p({onclick: (event) -> alert('child')}, 'do not propagation'))
  # below run ok
  #  comp3 = a({onmouseleave: -> alert('parent')},
  #    p({onmouseleave: (event) -> alert('child'); event.continuePropagation = true}, 'propagation leave'))
  #  comp3.mount()
  list(propagation, noPropagation)
