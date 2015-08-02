{list,
a, checkbox, text, p
bindings} = require 'domcom/src/index'
{$a, $b, _a, _b} = bindings({a: 1, b: 2})

module.exports = ->
  comp1 = list(cbx=checkbox($a), checkbox($a), text($a), text($a))
  comp1.mount()
  comp2 = list(a=text($a), text($a))
  comp2.mount()
  comp3 = text($a)
  comp3.mount()
  $a(6)
  render = ->
    comp1.update()
    comp2.update()
    comp3.update()
  render()
  comp3.node.value = 10
  render()
  cbx.node.addEventListener('change', -> $a(@value); render())
#setInterval((-> render()), 16)