var div, duplex, each, if_, list, p, see, text;

see = dc.see, if_ = dc.if_, list = dc.list, each = dc.each, div = dc.div, p = dc.p, text = dc.text, duplex = dc.duplex;

exports.demoEachPush = function() {
  var comp, lst;
  lst = [1, 2];
  comp = list(each(lst, function(item) {
    return p(item);
  }), 'some other thing');
  comp.mount();
  lst.push(3);
  return dc.update();
};

exports.demoIfEach = function() {
  var comp, lst4, showingEach$;
  showingEach$ = see(true);
  lst4 = [1, 2];
  comp = if_(showingEach$, each(lst4, function(item) {
    return div(item);
  }));
  comp.mount();
  showingEach$(false);
  dc.update();
  showingEach$(true);
  return dc.update();
};

exports.demoModelOnMultipleInput = function() {
  var a, text1, text2;
  a = {};
  text1 = text({
    $model: duplex(a, 'x')
  });
  text2 = text({
    $model: duplex(a, 'x')
  });
  return list(text1, text2).updateWhen([text1, text2], 'change').mount();
};
