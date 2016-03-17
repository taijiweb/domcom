var div, if_, list, see;

list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

module.exports = function() {
  var active, comp, div1;
  active = see(true);
  return comp = list(div({
    onclick: (function() {
      active(true);
      return dc.update();
    })
  }, 'mount'), div({
    onclick: (function() {
      active(false);
      return dc.update();
    })
  }, 'unmount'), div1 = if_(active, div('toggle me')));
};
