{list,
a, checkbox, text, p
bindings} = dc
{$a, $b, _a, _b} = bindings({a: 1, b: 2})

module.exports = ->
  checkboxes = list(cbx=checkbox($a), cbx=checkbox($a))
  #checkboxes.mount()
  texts = list(a=text($a), text($a))
  #texts.mount()
  #text1 = text($a)
  #text1.mount()
  $a(6)
  comps = list(checkboxes, texts)
  comps.create()
  cbx.node.addEventListener('change', -> $a(@value); comps.update())
  #setInterval((-> render()), 16)
  comps