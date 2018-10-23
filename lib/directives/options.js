var Tag, option, txt;

({txt} = require('../core/instantiate'));

({option} = require('../core/tag'));

Tag = require('../core/components/Tag');

// options directive，used for select tag
module.exports = function(items, attrs) {
  return function(comp) {
    var i, item, len, options;
    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
      throw new Error('options should be only used in select tag');
    }
    options = [];
    if (items) {
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        options.push(option(attrs, [txt(item)]));
      }
    }
    return comp.setChildren(0, options);
  };
};
