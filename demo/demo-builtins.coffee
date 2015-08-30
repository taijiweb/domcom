{
duplex
div
arrow
list
comboEdit
hcombo, vcombo} = dc

module.exports =  ->
#  comp = arrow(Object.create(null), 'top', 10, 'blue')
#  comp.mount()
  a = {}
  #dom component: left(), top(), height(), width() is not implemented
#  comp = comboEdit(Object.create(null), duplex(a, 'x'), 'a b'.split(' '))
#  comp.mount()
  arrows = div(Object.create(null),
    arrow(Object.create(null), 'top', 10, 'blue'),
    arrow(Object.create(null), 'bottom', 10, 'black'),
    arrow(Object.create(null), 'left', 10, 'red')
    arrow(Object.create(null), 'right', 10, 'green'))
  #comp.mount()
  combo1 = hcombo({style:{display:'inline-block'}}, duplex(a, 'x'), 'a b'.split(' '))
  #comp.mount()
  combo2 = vcombo({style:{display:'inline-block'}}, duplex(a, 'x'), 'a b'.split(' '))
  #comp.mount()
  list(arrows, combo1, combo2)