var p, see, txt;

txt = dc.txt, p = dc.p, see = dc.see;

module.exports = function() {
  var comp, counter, counter$, txt1;
  counter$ = see(counter = 0);
  comp = p(txt1 = txt(counter$));
  comp.on('beforeAttach', function() {
    var count, countHandle;
    count = function() {
      counter$(counter++);
      if (counter === 1000) {
        return clearInterval(countHandle);
      }
    };
    return countHandle = setInterval(count, 1);
  });
  dc.updateWhen(setInterval, txt1, {
    interval: 16,
    clear: function() {
      return counter >= 1000;
    }
  });
  return comp;
};
