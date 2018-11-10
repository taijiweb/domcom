{list, bindings
a, checkbox, text} = dc

export default  ->
  {a$} = bindings({a: 1})
  attrs = {onchange: -> comp.render()}
  comp = list(a=text(attrs, a$), text(attrs, a$))
