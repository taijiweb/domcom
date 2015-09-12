{list,
a, checkbox, text
bindings} = dc

module.exports = ->
  {$a} = bindings({a: 1})
  attrs = {onchange: -> comp.update()}
  comp = list(a=text(attrs, $a), text(attrs, $a))
