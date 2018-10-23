var div, flow, list, p, see, text, toggle;

({list, text, div, p, see, flow} = dc);

toggle = flow.toggle;

module.exports = function() {
  var comp, x;
  x = see(true);
  return comp = list(div({
    onclick: function() {
      toggle(x);
      return comp.render();
    }
  }, 'show/hide by changing style.display'), p({
    class: {},
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

//comp.mount()
