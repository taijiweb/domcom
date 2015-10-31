var combobox, div, extendAttrs, input, list, see, span;

list = dc.list, input = dc.input, span = dc.span, div = dc.div, extendAttrs = dc.extendAttrs, see = dc.see;

exports.combobox = combobox = function(attrs, modelValue, valueList, direction) {
  var comp, disp, item, opts, showingItems;
  showingItems = see(false);
  disp = direction === 'v' || direction === 'vertical' ? 'block' : 'inline-block';
  comp = null;
  opts = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = valueList.length; _i < _len; _i++) {
      item = valueList[_i];
      _results.push((function(item) {
        return span({
          style: {
            display: disp,
            border: "1px solid blue",
            "min-width": "40px"
          },
          onclick: (function() {
            modelValue(item);
            return comp.update();
          })
        }, item);
      })(item));
    }
    return _results;
  })();
  attrs = extendAttrs(attrs, {
    onmouseleave: (function() {
      showingItems(false);
      return comp.update();
    })
  });
  return comp = div(attrs, input({
    $model: modelValue,
    onmouseenter: (function() {
      showingItems(true);
      return comp.update();
    })
  }), div({
    style: {
      display: function() {
        if (showingItems()) {
          return 'block';
        } else {
          return 'none';
        }
      }
    }
  }, opts));
};

exports.vcombo = function(attrs, modelValue, valueList) {
  return combobox(attrs, modelValue, valueList, 'vertical');
};

exports.hcombo = function(attrs, modelValue, valueList) {
  return combobox(attrs, modelValue, valueList, 'horizontal');
};
