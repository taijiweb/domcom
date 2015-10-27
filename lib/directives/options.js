var List, Tag, each, option, txt;

Tag = dc.Tag, List = dc.List, each = dc.each, txt = dc.txt, option = dc.option;

module.exports = function(items, attrs) {
  return function(comp) {
    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
      throw new Error('options should be only used in select tag');
    }
    comp.setChildren(0, each(items, function(item) {
      return option(attrs, [txt(item)]);
    }));
    return comp;
  };
};
