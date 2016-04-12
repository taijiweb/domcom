{list, bindings
a, checkbox, text} = dc

module.exports = ->
  {a$} = bindings({a: 1})
  attrs = {onchange: -> comp.render()}
  comp = list(a=text(attrs, a$), text(attrs, a$))
