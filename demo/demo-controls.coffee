{list,
a, checkbox, text, p
bindings} = dc


module.exports = ->
  {a$} = bindings({a: 1})
  checkboxes = list(cbx1=checkbox(a$), cbx2=checkbox(a$))
  texts = list((text1=text(a$)), (text2=text(a$)))
  a$(6)
  comp = list(checkboxes, texts)
  dc.updateWhen([cbx1, cbx2, text1, text2], 'change', comp)
  comp