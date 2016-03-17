var div, flow, list, p, see, text, toggle;

list = dc.list, text = dc.text, div = dc.div, p = dc.p, see = dc.see, flow = dc.flow;

toggle = flow.toggle;

module.exports = function() {
  var comp, x;
  x = see(true);
  return comp = list(div({
    onclick: function() {
      toggle(x);
      return dc.update();
    }
  }, 'show/hide by changing style.display'), p({
    "class": {},
    style: {
      display: function() {
        if (x()) {
          return 'block';
        } else {
          return 'none';
        }
      }
    }
  }, 'asdfdfs'));
};
