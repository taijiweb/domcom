var div, if_, list, see;

list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

module.exports = function() {
  var active, if1;
  active = see(true);
  return list(div({
    onclick: function() {
      active(true);
      return if1.render();
    }
  }, 'mount'), div({
    onclick: function() {
      active(false);
      if1.render();
      return dc.clean();
    }
  }, 'unmount'), if1 = if_(active, div('toggle me')));
};
