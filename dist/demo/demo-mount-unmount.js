var div, if_, list, see;

list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

module.exports = function() {
  var active, comp, div1;
  active = see(true);
  return comp = list(div({
    onclick: function() {
      active(true);
      return div1.render();
    }
  }, 'mount'), div({
    onclick: function() {
      active(false);
      return div1.render();
    }
  }, 'unmount'), div1 = if_(active, div('toggle me')));
};
