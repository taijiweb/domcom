var a, bindings, checkbox, list, p, text;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

module.exports = function() {
  var a$, cbx1, cbx2, checkboxes, comp, text1, text2, texts;
  a$ = bindings({
    a: 1
  }).a$;
  checkboxes = list(cbx1 = checkbox(a$), cbx2 = checkbox(a$));
  texts = list((text1 = text(a$)), (text2 = text(a$)));
  a$(6);
  comp = list(checkboxes, texts);
  dc.updateWhen([cbx1, cbx2, text1, text2], 'change', comp);
  return comp;
};
