var extend, getBindProp, input, inputTypes, isAttrs, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
  __slice = [].slice;

extend = require('extend');

_ref = require('./instantiate'), tag = _ref.tag, isAttrs = _ref.isAttrs;

getBindProp = require('../dom-util').getBindProp;

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section" + " svg iframe";

tagNames = tagNames.split(' ');

_fn = function(tagName) {
  return exports[tagName] = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return tag.apply(null, [tagName].concat(__slice.call(args)));
  };
};
for (_i = 0, _len = tagNames.length; _i < _len; _i++) {
  tagName = tagNames[_i];
  _fn(tagName);
}

exports.tagHtml = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return tag.apply(null, ['html'].concat(__slice.call(args)));
};

inputTypes = 'text checkbox radio date email number'.split(' ');

input = exports.input = function(type, attrs, value) {
  var component;
  if (typeof type === 'object') {
    value = attrs;
    attrs = type;
    type = 'text';
  }
  attrs = extend({
    type: type
  }, attrs);
  component = tag('input', attrs);
  if (value != null) {
    component.prop(getBindProp(component), value);
    if (value.isDuplex) {
      component.bind('onchange', (function(event) {
        return value.call(this.component, this.value);
      }), 'before');
    }
  }
  return component;
};

_ref1 = 'text checkbox radio date email tel number'.split(' ');
_fn1 = function(type) {
  return exports[type] = function(value, attrs) {
    var temp;
    if (typeof value === 'object') {
      temp = attrs;
      attrs = value;
      value = temp;
    }
    attrs = attrs || {};
    return input(type, attrs, value);
  };
};
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  type = _ref1[_j];
  _fn1(type);
}

exports.textarea = function(attrs, value) {
  var component;
  if (isAttrs(attrs)) {
    if (value != null) {
      attrs = extend({
        value: value
      }, attrs);
      component = tag('textarea', attrs);
      if (value.isDuplex) {
        component.bind('onchange', (function(event) {
          return value.call(this.component, this.value);
        }), 'before');
      }
    } else {
      component = tag('textarea', attrs);
    }
  } else {
    if (attrs != null) {
      component = tag('textarea', {
        value: attrs
      });
      if (attrs.isDuplex) {
        component.bind('onchange', (function(event) {
          return attrs.call(this.component, this.value);
        }), 'before');
      }
    } else {
      component = tag('textarea');
    }
  }
  return component;
};
