{
duplex
div
arrow
list
comboEdit
hcombo, vcombo} = dc

exports.demoArrow =  ->
#  comp = arrow(Object.create(null), 'top', 10, 'blue')
  arrows = div(Object.create(null),
    arrow(Object.create(null), 'top', 10, 'blue'),
    arrow(Object.create(null), 'bottom', 10, 'black'),
    arrow(Object.create(null), 'left', 10, 'red')
    arrow(Object.create(null), 'right', 10, 'green'))

exports.demoCombo =  ->
  a = {}
  #  comp = comboEdit(Object.create(null), duplex(a, 'x'), 'a b'.split(' '))
  #  comp.mount()
  combo1 = hcombo({style:{display:'inline-block'}}, duplex(a, 'x'), 'a b'.split(' '))
  #comp.mount()
  combo2 = vcombo({style:{display:'inline-block'}}, duplex(a, 'x'), 'a b'.split(' '))
  #  comp.mount()
  comp = list(combo2, combo1)
  combo1.onUpdate -> comp.update()
  combo2.onUpdate -> comp.update()
  comp