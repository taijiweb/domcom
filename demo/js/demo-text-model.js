var a, bindings, checkbox, list, text;

({list, bindings, a, checkbox, text} = dc);

module.exports = function() {
  var a$, attrs, comp;
  ({a$} = bindings({
    a: 1
  }));
  attrs = {
    onchange: function() {
      return comp.render();
    }
  };
  return comp = list(a = text(attrs, a$), text(attrs, a$));
};
