var arrowStyle, div, extendAttrs, reverseSide;

div = require('../core/instantiate').div;

extendAttrs = require('../core/property').extendAttrs;

reverseSide = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
};

arrowStyle = function(direction, size, color) {
  var props, sideStyle;
  props = {
    width: 0,
    height: 0
  };
  sideStyle = size + "px solid transparent";
  if (direction === 'left' || direction === 'right') {
    props["border-top"] = props["border-bottom"] = sideStyle;
  } else {
    props["border-left"] = props["border-right"] = sideStyle;
  }
  props["border-" + reverseSide[direction]] = size + "px solid " + color;
  return props;
};

module.exports = function(attrs, direction, size, color) {
  attrs = extendAttrs(attrs, {
    style: arrowStyle(direction, size, color)
  });
  return div(attrs);
};
