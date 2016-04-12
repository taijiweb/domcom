var p, see, txt;

txt = dc.txt, p = dc.p, see = dc.see;

module.exports = function() {
  var counter, counter$;
  counter$ = see(counter = 0);
  return p(txt(counter$)).on('willAttach', function() {
    var count, countHandle;
    count = function() {
      counter$(counter++);
      if (counter === 1001) {
        return clearInterval(countHandle);
      }
    };
    return countHandle = setInterval(count, 1);
  }).renderWhen(setInterval, 16, {
    clear: function() {
      return counter >= 1000;
    }
  });
};
