var div, each, flow, func, list, number, see;

({func, see, flow, each, list, div, number} = dc);

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

// The above is just for demonstration
// it can be implemented like below:
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

// by using flow, it can be improved like below
module.exports = function() {
  var comp, num, x;
  x = see(0);
  //comp = list(number(x).bind('change', -> comp.render()), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  //  comp = list(number(x).bind('change', pane.update.bind(pane)), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))
  //list(num=number(x), func(flow x, -> v = x(); if v>=0 and v<=3 then div v)).renderWhen(num, 'change')
  comp = list(num = number(x), func(flow(x, function() {
    var v;
    v = x();
    if (v >= 0 && v <= 3) {
      return div(v);
    }
  })));
  return comp.renderWhen(num, 'change');
};
