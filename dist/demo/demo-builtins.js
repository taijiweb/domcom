var comboEdit, div, duplex, hcombo, list, triangle, vcombo;

duplex = dc.duplex, div = dc.div, triangle = dc.triangle, list = dc.list, comboEdit = dc.comboEdit, hcombo = dc.hcombo, vcombo = dc.vcombo;

exports.demoTriangle = function() {
  var triangles;
  return triangles = div({}, triangle({}, 'top', 10, 'blue'), triangle({}, 'bottom', 10, 'black'), triangle({}, 'left', 10, 'red'), triangle({}, 'right', 10, 'green'));
};

exports.demoCombo = function() {
  var a, combo1, combo2, comp;
  a = {};
  combo1 = hcombo({
    style: {
      display: 'inline-block'
    }
  }, duplex(a, 'x'), 'a b'.split(' '));
  combo2 = vcombo({
    style: {
      display: 'inline-block'
    }
  }, duplex(a, 'x'), 'a b'.split(' '));
  comp = list(combo2, combo1);
  combo1.on('update', function() {
    return comp.update();
  });
  combo2.on('update', function() {
    return comp.update();
  });
  return comp;
};
