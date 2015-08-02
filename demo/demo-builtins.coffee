{
bibind
div
arrow
comboEdit
hcombo, vcombo} = require  'domcom/src/index'

module.exports =  ->
#  comp = arrow(Object.create(null), 'top', 10, 'blue')
#  comp.mount()
  a = {}
  #dom component: left(), top(), height(), width() is not implemented
#  comp = comboEdit(Object.create(null), bibind(a, 'x'), 'a b'.split(' '))
#  comp.mount()
  comp = div(Object.create(null),
    arrow(Object.create(null), 'top', 10, 'blue'),
    arrow(Object.create(null), 'bottom', 10, 'black'),
    arrow(Object.create(null), 'left', 10, 'red')
    arrow(Object.create(null), 'right', 10, 'green'))
  comp.mount()
  comp = hcombo({style:{display:'inline-block'}}, bibind(a, 'x'), 'a b'.split(' '))
  comp.mount()
  comp = vcombo({style:{display:'inline-block'}}, bibind(a, 'x'), 'a b'.split(' '))
  comp.mount()