{list,
a, checkbox, text
bindings} = dc

module.exports = ->
  {$a, $b, _a, _b} = bindings({a: 1,  b: 2})
  attrs = {onchange: -> comp.update()}
  comp = list(a=text(attrs, $a), text(attrs, $a))
