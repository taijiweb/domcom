{
duplex
div
triangle
list
hcombo, vcombo} = dc

exports.demoTriangle =  ->
  div({},
    triangle({}, 'top', 10, 'blue'),
    triangle({}, 'bottom', 10, 'black'),
    triangle({}, 'left', 10, 'red')
    triangle({}, 'right', 10, 'green'))

exports.demoCombo =  ->
  a = {}
  a_x$ = duplex(a, 'x')
  combo1 = hcombo({style:{display:'inline-block'}}, a_x$, 'a b'.split(' '))
  #comp.mount()
  combo2 = vcombo({style:{display:'inline-block'}}, a_x$, 'a b'.split(' '))
  #  comp.mount()
  comp = list(combo2, combo1)
  combo1.on 'update', -> comp.update()
  combo2.on 'update', -> comp.update()
  comp