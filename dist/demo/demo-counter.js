var p, see, txt;

txt = dc.txt, p = dc.p, see = dc.see;

module.exports = function() {
  var comp, count, countHandle, counter, seeCounter, txt1;
  seeCounter = see(counter = 0);
  comp = p(txt1 = txt(seeCounter));
  count = function() {
    seeCounter(counter++);
    if (counter === 1000) {
      return clearInterval(countHandle);
    }
  };
  countHandle = setInterval(count, 1);
  dc.updateWhen(setInterval, txt1, {
    interval: 16,
    clear: function() {
      return counter >= 1000;
    }
  });
  return comp;
};
