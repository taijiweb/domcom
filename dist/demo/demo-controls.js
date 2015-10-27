var $a, $b, a, bindings, checkbox, list, p, text, _a, _b, _ref;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

_ref = bindings({
  a: 1,
  b: 2
}), $a = _ref.$a, $b = _ref.$b, _a = _ref._a, _b = _ref._b;

module.exports = function() {
  var cbx, checkboxes, comp, texts;
  checkboxes = list(cbx = checkbox($a), cbx = checkbox($a));
  texts = list(a = text($a), text($a));
  $a(6);
  comp = list(checkboxes, texts);
  dc.updateWhen(cbx, 'change', comp);
  return comp;
};
