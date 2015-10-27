var $b, a, a$, a_, b_, bindings, checkbox, list, p, text, _ref;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

_ref = bindings({
  a: 1,
  b: 2
}), a$ = _ref.a$, $b = _ref.$b, a_ = _ref.a_, b_ = _ref.b_;

module.exports = function() {
  var cbx, checkboxes, comp, texts;
  checkboxes = list(cbx = checkbox(a$), cbx = checkbox(a$));
  texts = list(a = text(a$), text(a$));
  a$(6);
  comp = list(checkboxes, texts);
  dc.updateWhen(cbx, 'change', comp);
  return comp;
};
