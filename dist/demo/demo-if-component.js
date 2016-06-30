var div, if_, list, see, text;

list = dc.list, if_ = dc.if_, text = dc.text, div = dc.div, see = dc.see;

module.exports = function() {
  var comp, x;
  x = see(0, parseNumber);
  return comp = list(text({
    onchange: function() {
      x = parseInt(this.node.value);
      comp.render();
      return dc.clean();
    }
  }, x), if_(x, div(1), div(2)));
};

module.exports = function() {
  var comp, x;
  x = see(0, parseFloat);
  return comp = list(text({
    onchange: function() {
      comp.render();
      return dc.clean();
    }
  }, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')));
};
