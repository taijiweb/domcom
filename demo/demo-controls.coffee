{list,
a, checkbox, text, p
bindings} = dc
{$a, $b, _a, _b} = bindings({a: 1, b: 2})

module.exports = ->
  checkboxes = list(cbx=checkbox($a), cbx=checkbox($a))
  texts = list(a=text($a), text($a))
  $a(6)
  comp = list(checkboxes, texts)
  comp.mount()
  cbx.node.addEventListener('change', -> $a(@value); comps.update())
  comp