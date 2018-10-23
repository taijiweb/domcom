var a, bindings, checkbox, list, p, text;

({list, a, checkbox, text, p, bindings} = dc);

module.exports = function() {
  var a$, cbx1, cbx2, checkboxes, text1, text2, texts;
  ({a$} = bindings({
    a: 1
  }));
  checkboxes = list(cbx1 = checkbox(a$), cbx2 = checkbox(a$));
  texts = list((text1 = text(a$)), (text2 = text(a$)));
  a$(6);
  return list(checkboxes, texts).renderWhen([cbx1, cbx2, text1, text2], 'change');
};
