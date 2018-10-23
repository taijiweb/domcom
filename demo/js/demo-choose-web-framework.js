let dc = global.dc;
var case_, div, each, every, flow, func, label, list, see, text;

({flow, see, case_, each, every, func, list, div, label, text} = global.dc);

module.exports = function() {
  var caseMap, choice, comp, firstLetter$, frameworks, i, item, items, len, prefered, prompt;
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
  //  items =  for item in frameworks then div "#{item[0]}. #{item}"  # (1)
  //  items = list items

  //  items = each frameworks, (item) -> div "#{item[0]}. #{item}" # (2)
  items = every(frameworks, function(item) {
    return div(`${item[0]}. ${item //(3)
}`);
  });
  caseMap = {};
  for (i = 0, len = frameworks.length; i < len; i++) {
    item = frameworks[i];
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
    return div(`${item[0]}. ${item}`);
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
    var firstLetter, i, item, len;
    firstLetter = firstLetter$();
    for (i = 0, len = frameworks.length; i < len; i++) {
      item = frameworks[i];
      if (item[0].toLowerCase() === firstLetter) {
        return item;
      }
    }
    return 'some other things';
  }));
  return comp = list(prompt, prefered, prompt2, added, items, div("You perfer ", choice, "."));
};
