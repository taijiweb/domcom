var $a, $b, a, bindings, checkbox, list, p, text, _a, _b, _ref;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

_ref = bindings({
  a: 1,
  b: 2
}), $a = _ref.$a, $b = _ref.$b, _a = _ref._a, _b = _ref._b;

module.exports = function() {
  var noPropagation, propagation;
  propagation = a({
    onclick: function() {
      return alert('parent');
    }
  }, p({
    onclick: function(event) {
      alert('child');
      return event.continuePropagation = true;
    }
  }, 'propagation'));
  noPropagation = a({
    onclick: function() {
      return alert('parent');
    }
  }, p({
    onclick: function(event) {
      return alert('child');
    }
  }, 'do not propagation'));
  noPropagation.mount();
  return list(propagation, noPropagation);
};
