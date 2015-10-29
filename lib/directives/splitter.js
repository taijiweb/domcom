var Component, classFn, div, pairListDict, span;

pairListDict = dc.pairListDict, classFn = dc.classFn, Component = dc.Component, div = dc.div, span = dc.span;

module.exports = function(direction) {
  return function(comp) {
    var arrawAAttr, arrawBAttr, arrowA, arrowAHovering, arrowB, arrowBHovering, attrs, barsize, buttonClass, children, clientX, cursor, drag, getSize, left, minAWidth, minBWidth, paneA, paneB, percent, pos, right, size, splitBar, splitBarAttr, splitBarAttrCss, splitbarClass, width;
    dc.directives({
      $show: dc.$show
    });
    attrs = comp.attrs;
    direction = direction || 'vertical';
    if (direction === 'vertical') {
      left = "top";
      right = "bottom";
      width = "height";
      clientX = "clientY";
      splitbarClass = "splitbarH";
      buttonClass = "splitbuttonH";
      cursor = "s-resize";
    } else {
      left = "left";
      right = "right";
      width = "width";
      clientX = "clientX";
      splitbarClass = "splitbarV";
      buttonClass = "splitbuttonV";
      cursor = "e-resize";
    }
    pos = 200;
    percent = 0.5;
    size = null;
    drag = false;
    getSize = function() {
      return size || 600;
    };
    children = comp.children;
    paneA = children[0];
    paneB = children[1];
    minAWidth = attrs.minAWidth || 0;
    minBWidth = attrs.minBWidth || 0;
    splitBarAttr = {
      "class": splitbarClass,
      unselectable: "on",
      style: splitBarAttrCss = {
        "cursor": cursor,
        "user-select": "none",
        "-webkit-user-select": "none",
        "-khtml-user-select": "none",
        "-moz-user-select": "none"
      }
    };
    splitBarAttrCss[left] = function() {
      return pos + 'px';
    };
    splitBarAttrCss[width] = barsize = 6;
    arrowAHovering = false;
    arrawAAttr = {
      "class": classFn(buttonClass, {
        'inactive': function() {
          return arrowAHovering;
        }
      }),
      unselectable: "on",
      style: {
        cursor: 'pointer'
      },
      onmouseover: function() {
        arrowAHovering = true;
        return comp.update();
      },
      onmouseleave: function() {
        arrowAHovering = false;
        return comp.update();
      },
      onclick: function(e) {
        pos = minAWidth;
        return comp.update();
      },
      $show: function() {
        return pos > minAWidth;
      }
    };
    arrowBHovering = false;
    arrawBAttr = {
      "class": classFn(buttonClass + ' invert', {
        'inactive': function() {
          return arrowBHovering;
        }
      }),
      unselectable: "on",
      style: {
        cursor: 'pointer'
      },
      onmouseover: function() {
        arrowBHovering = true;
        return comp.update();
      },
      onmouseleave: function() {
        arrowBHovering = false;
        return comp.update();
      },
      onclick: function(e) {
        pos = getSize() - minBWidth;
        return comp.update();
      },
      $show: function() {
        return getSize() - pos > minBWidth;
      }
    };
    arrowA = div(arrawAAttr);
    arrowB = div(arrawBAttr);
    splitBar = div(splitBarAttr, span(), arrowA, arrowB);
    comp.setChildren(1, splitBar, paneB);
    splitBar.bind('mousedown', function(event) {
      return drag = true;
    });
    dc(document).bind('mouseup', function() {
      return drag = false;
    });
    comp.bind('mousemove', function(event) {
      var bounds, pencent, w;
      event.continuePropagation = true;
      event.executeDefault = true;
      if (!drag) {
        return;
      }
      event.continuePropagation = false;
      event.executeDefault = false;
      bounds = comp.node.getBoundingClientRect();
      size = w = bounds[right] - bounds[left];
      pos = Math.max(event[clientX] - bounds[left], 0);
      pencent = pos / w;
      return comp.update();
    });
    paneA.css(pairListDict('position', 'absolute', width, (function() {
      return pos + 'px';
    })));
    paneB.css(pairListDict('position', 'absolute', left, (function() {
      return (pos + barsize) + 'px';
    }), width, (function() {
      return getSize() - (pos + barsize) + 'px';
    })));
    comp.css(pairListDict('position', 'absolute'));
    comp.bind('resize', function(event) {
      var bounds, w;
      event.preventDefault();
      event.stopPropagation();
      bounds = comp.node.getBoundingClientRect();
      w = bounds[right] - bounds[left];
      pos = percent * w;
      if (pos < minAWidth) {
        pos = minAWidth;
      } else if (w - pos < minBWidth) {
        pos = w - minBWidth;
      }
      return comp.update();
    });
    return comp;
  };
};
