var each, list, p, txt;

list = dc.list, each = dc.each, p = dc.p, txt = dc.txt;

exports.eachDemo1 = function() {
  var comp, lst;
  lst = [1, 2];
  return comp = list(lst);
};

exports.eachDemo2 = function() {
  var comp, lst;
  lst = [1, 2];
  return comp = each(lst, function(item) {
    return p(item);
  });
};

exports.eachDemo3 = function() {
  var comp, lst;
  lst = [1, 2, 3, 4, 5, 6];
  comp = each(lst, function(item) {
    return p(item);
  });
  setTimeout((function() {
    lst.push(7);
    return comp.update();
  }), 1000);
  setTimeout((function() {
    lst.setLength(4);
    return comp.update();
  }), 2000);
  return comp;
};

exports.eachDemo4 = function() {
  var comp, lst;
  lst = [1, 2, 3, 4, 5, 6];
  comp = each(lst, function(item) {
    return txt(item);
  });
  setTimeout((function() {
    lst.push(7);
    return comp.update();
  }), 1000);
  setTimeout((function() {
    lst.setLength(4);
    return comp.update();
  }), 2000);
  return comp;
};
