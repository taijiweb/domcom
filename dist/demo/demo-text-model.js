var a, bindings, checkbox, list, text;

list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, bindings = dc.bindings;

module.exports = function() {
  var $a, attrs, comp;
  $a = bindings({
    a: 1
  }).$a;
  attrs = {
    onchange: function() {
      return comp.update();
    }
  };
  return comp = list(a = text(attrs, $a), text(attrs, $a));
};
