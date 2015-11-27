var accordion, div, duplex, each, span;

duplex = dc.duplex, accordion = dc.accordion, each = dc.each, div = dc.div, span = dc.span;

module.exports = function() {
  var accordionGroupList, comp, content, group, groupAttrs, groupOptions, groups;
  groups = [
    {
      heading: 'group1',
      items: 'a b c'.split(' ')
    }, {
      heading: 'group2',
      items: 'd e f'.split(' ')
    }, {
      heading: 'group3',
      items: 'x y z'.split(' ')
    }
  ];
  accordionGroupList = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = groups.length; _i < _len; _i++) {
      group = groups[_i];
      groupOptions = {
        opened: group.opened,
        disable: group.disable
      };
      groupAttrs = {};
      content = each(group.items, function(item) {
        return span({
          style: {
            margin: '5px'
          },
          onclick: function() {}
        }, item);
      });
      _results.push([groupAttrs, group.heading, content, groupOptions]);
    }
    return _results;
  })();
  return comp = accordion({}, accordionGroupList, {
    closeOthers: true
  });
};
