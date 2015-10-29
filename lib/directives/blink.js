var flow, see;

see = dc.see, flow = dc.flow;

module.exports = function(interval) {
  return function(comp) {
    var timer, visible;
    if (interval == null) {
      interval = 500;
    }
    timer = null;
    comp.on('beforeMount', function(baseComponent) {
      return function() {
        return timer = setInterval((function() {
          visible(!visible());
          return comp.update();
        }), interval);
      };
    });
    comp.on('afterUnmount', function(baseComponent) {
      return function() {
        return clearInterval(timer);
      };
    });
    visible = see(true);
    this.style.visibility = flow(visible, function() {
      if (visible()) {
        return 'visible';
      } else {
        return 'hidden';
      }
    });
    return comp;
  };
};
