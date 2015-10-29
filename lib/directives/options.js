var Tag, every, option, txt;

every = dc.every, txt = dc.txt, option = dc.option, Tag = dc.Tag;

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
