var Tag, option, txt;

txt = require('../core/instantiate').txt;

option = require('../core/tag').option;

Tag = require('../core/base/Tag');

module.exports = function(items, attrs) {
  return function(comp) {
    var item, options, _i, _len;
    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
      throw new Error('options should be only used in select tag');
    }
    options = [];
    if (items) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        options.push(option(attrs, [txt(item)]));
      }
    }
    return comp.setChildren(0, options);
  };
};
