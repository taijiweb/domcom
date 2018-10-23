var div, duplex, each, if_, list, p, see, text;

({see, if_, list, each, div, p, text, duplex} = dc);

exports.demoEachPush = function() {
  var comp, lst;
  lst = [1, 2];
  comp = list(each(lst, function(item) {
    return p(item);
  }), 'some other thing');
  comp.mount();
  lst.push(3);
  return comp.render();
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
  comp.render();
  dc.clean();
  showingEach$(true);
  comp.render();
  return dc.clean();
};

exports.demoModelOnMultipleInput = function() {
  var a, text1, text2;
  a = {};
  //a_x$ = duplex(a, 'x')
  text1 = text({
    $model: duplex(a, 'x')
  });
  text2 = text({
    $model: duplex(a, 'x')
  });
  return list(text1, text2).renderWhen([text1, text2], 'change').mount();
};
