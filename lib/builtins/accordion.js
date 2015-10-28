
/** @module accordion
 * @directive accordion
 */
var Component, a, accordion, accordionGroup, div, each, exports, extend, extendAttrs, h4, img, span, _ref;

_ref = require("../core/tag"), div = _ref.div, h4 = _ref.h4, a = _ref.a, span = _ref.span, img = _ref.img;

each = require("../core/instantiate").each;

extend = require("../util");

Component = require("../core/base/component");

extendAttrs = require("../core/property").extendAttrs;

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
