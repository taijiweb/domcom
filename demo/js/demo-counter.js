export default module.exports = function() {
  var comp, startCounter, stopCounter, timer, view;
  timer = null;
  view = function() {
    var comp, reset, start, stop;
    comp = this;
    start = () => {
      startCounter();
    };
    stop = () => {
      return stopCounter();
    };
    reset = () => {
      stopCounter();
      return comp.count = 0;
    };
    return [
      'div',
      ['p',
      this.count],
      [
        'p',
        {
          onClick: stop,
          keepid: 101
        },
        'stop'
      ],
      [
        'p',
        {
          onClick: reset,
          keepid: 102
        },
        'reset'
      ],
      [
        'p',
        {
          onClick: start,
          keepid: 103
        },
        'start'
      ]
    ];
  };
  comp = dc({
    view,
    count: 0
  });
  startCounter = function() {
    timer = setInterval((function() {
      return comp.count++;
    }), 300);
  };
  startCounter();
  stopCounter = function() {
    return clearInterval(timer);
  };
  return comp;
};
