var Tag, every, option, txt, _ref;

_ref = require('../core/instantiate'), every = _ref.every, txt = _ref.txt;

option = require('../core/tag').option;

Tag = require('../core/base/Tag');

module.exports = function(items, attrs) {
  return function(comp) {
    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
      throw new Error('options should be only used in select tag');
    }
    comp.setChildren(0, every(items, function(item) {
      return option(attrs, [txt(item)]);
    }));
    return comp;
  };
};
