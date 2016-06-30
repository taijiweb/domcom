var div, each, flow, func, list, number, see;

func = dc.func, see = dc.see, flow = dc.flow, each = dc.each, list = dc.list, div = dc.div, number = dc.number;

module.exports = function() {
  var comp, indexInput, lst, x;
  x = 0;
  comp = null;
  indexInput = number({
    onchange: function() {
      x = parseInt(this.node.value);
      comp.render();
      return dc.clean();
    }
  });
  lst = each([0, 1, 2, 3], function(item) {
    return div({
      style: {
        display: function() {
          if (item === x) {
            return 'block';
          } else {
            return 'none';
          }
        }
      }
    }, item);
  });
  return comp = list(indexInput, lst);
};

module.exports = function() {
  var comp, indexInput, x;
  x = 0;
  comp = null;
  indexInput = number({
    onchange: function() {
      x = parseInt(this.node.value);
      comp.render();
      return dc.clean();
    }
  });
  return comp = list(indexInput, func(function() {
    if (x >= 0 && x <= 3) {
      return div(x);
    }
  }));
};

module.exports = function() {
  var comp, num, x;
  x = see(0);
  comp = list(num = number(x), func(flow(x, function() {
    var v;
    v = x();
    if (v >= 0 && v <= 3) {
      return div(v);
    }
  })));
  return comp.renderWhen(num, 'change');
};
