
/** @module accordion
 * @directive accordion
 */
var Component, a, accordion, accordionGroup, div, each, exports, extend, extendAttrs, h4, img, span;

extend = dc.extend, div = dc.div, h4 = dc.h4, a = dc.a, span = dc.span, img = dc.img, Component = dc.Component, each = dc.each, extendAttrs = dc.extendAttrs;

module.exports = exports = accordion = function(attrs, accordionGroupList, options) {
  var accordionOptions, comp;
  attrs = extendAttrs({
    "class": "panel-group"
  }, attrs || {});
  accordionOptions = options || {};
  return comp = div(attrs, each(accordionGroupList, function(group, index) {
    var content, groupAttrs, groupOptions, heading;
    groupAttrs = group[0], heading = group[1], content = group[2], groupOptions = group[3];
    groupOptions = groupOptions || {};
    groupOptions.toggleOpen = function() {
      var group2, i, _i, _len;
      groupOptions.opened = !groupOptions.opened;
      if (accordionOptions.closeOthers && groupOptions.opened) {
        for (i = _i = 0, _len = accordionGroupList.length; _i < _len; i = ++_i) {
          group2 = accordionGroupList[i];
          if (i !== index) {
            group2[3].opened = false;
          }
        }
      }
      return comp.update();
    };
    return accordionGroup(groupAttrs, heading, content, groupOptions);
  }));
};

exports.accordionGroup = accordionGroup = function(attrs, heading, content, options) {
  return div({
    "class": "panel panel-default"
  }, div({
    "class": "panel-heading",
    onclick: options.toggleOpen
  }, h4({
    "class": "panel-title"
  }, div({
    "class": "accordion-toggle"
  }, span({
    "class": {
      'text-muted': function() {
        return options.disabled;
      }
    }
  }, heading)))), div({
    "class": {
      "panel-collapse": function() {
        return !options.opened;
      }
    },
    style: {
      display: function() {
        if (options.opened) {
          return 'block';
        } else {
          return 'none';
        }
      }
    }
  }, div({
    "class": "panel-body"
  }, content)));
};

exports.accordion = accordion;
