var case_, div, each, every, flow, func, label, list, see, text;

flow = dc.flow, see = dc.see, case_ = dc.case_, each = dc.each, every = dc.every, func = dc.func, list = dc.list, div = dc.div, label = dc.label, text = dc.text;

module.exports = function() {
  var caseMap, choice, comp, firstLetter$, frameworks, item, items, prefered, prompt, _i, _len;
  firstLetter$ = see('d', function(x) {
    return x.toLowerCase();
  });
  comp = null;
  prompt = label('Please choose: ');
  prefered = text({
    onchange: function() {
      comp.render();
      return dc.clean();
    }
  }, firstLetter$);
  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
  items = every(frameworks, function(item) {
    return div("" + item[0] + ". " + item);
  });
  caseMap = {};
  for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
    item = frameworks[_i];
    caseMap[item[0]] = item;
  }
  choice = case_(firstLetter$, caseMap, 'some other things');
  return comp = list(prompt, prefered, items, div("You perfer ", choice, "."));
};

module.exports = function() {
  var added, choice, comp, firstLetter$, frameworks, items, prefered, prompt, prompt2;
  firstLetter$ = see('d', function(x) {
    return x.toLowerCase();
  });
  comp = null;
  prompt = label('Please choose: ');
  prefered = text({
    onchange: function() {
      return comp.render();
    }
  }, firstLetter$);
  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
  items = each(frameworks, function(item) {
    return div("" + item[0] + ". " + item);
  });
  prompt2 = label('add some others: ');
  added = text({
    onchange: function(event, node) {
      var newFramework;
      newFramework = node.value;
      frameworks.push(newFramework);
      firstLetter$(newFramework[0]);
      comp.render();
      return dc.clean();
    }
  });
  choice = func(flow(firstLetter$, function() {
    var firstLetter, item, _i, _len;
    firstLetter = firstLetter$();
    for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
      item = frameworks[_i];
      if (item[0].toLowerCase() === firstLetter) {
        return item;
      }
    }
    return 'some other things';
  }));
  return comp = list(prompt, prefered, prompt2, added, items, div("You perfer ", choice, "."));
};
