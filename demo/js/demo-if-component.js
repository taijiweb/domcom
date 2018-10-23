var div, if_, list, see, text;

({list, if_, text, div, see} = dc);

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

//  comp = list(text({onchange: -> x = this.node.value; comp.render()}, (->x)), div(->x))
//  comp = list(number({onchange: -> x = parseInt(this.node.value); comp.render()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))
// comp.mount()
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
