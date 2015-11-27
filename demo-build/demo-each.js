var each, list, p, txt;

list = dc.list, each = dc.each, p = dc.p, txt = dc.txt;

exports.eachDemo1 = function() {
  var comp, lst1;
  lst1 = [1, 2];
  return comp = list(lst1);
};

exports.eachDemo2 = function() {
  var comp, lst2;
  lst2 = [1, 2];
  return comp = each(lst2, function(item) {
    return p(item);
  });
};

exports.eachDemo3 = function() {
  var comp, lst3;
  lst3 = [1, 2, 3, 4, 5, 6];
  comp = each(lst3, function(item) {
    return p(item);
  });
  comp.on('beforeAttach', function() {
    setTimeout((function() {
      lst3.push(7);
      return comp.update();
    }), 1000);
    return setTimeout((function() {
      lst3.setLength(4);
      return comp.update();
    }), 2000);
  });
  return comp;
};

exports.eachDemo4 = function() {
  var comp, lst4;
  lst4 = [1, 2, 3, 4, 5, 6];
  comp = each(lst4, function(item) {
    return txt(item);
  });
  comp.on('beforeAttach', function() {
    setTimeout((function() {
      lst4.push(7);
      return comp.update();
    }), 1000);
    return setTimeout((function() {
      lst4.setLength(4);
      return comp.update();
    }), 2000);
  });
  return comp;
};
