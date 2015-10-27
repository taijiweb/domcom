var extend, getBindProp, input, inputTypes, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref,
  __slice = [].slice;

extend = require('../extend');

tag = require('./instantiate').tag;

getBindProp = require('../dom-util').getBindProp;

tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section";

tagNames = tagNames.split(' ');

_fn = function(tagName) {
  return exports[tagName] = function() {
    return tag.apply(null, [tagName].concat(__slice.call(arguments)));
  };
};
for (_i = 0, _len = tagNames.length; _i < _len; _i++) {
  tagName = tagNames[_i];
  _fn(tagName);
}

exports.tagHtml = tag.apply(null, [tagName].concat(__slice.call(arguments)));

inputTypes = 'text textarea checkbox radio date email number'.split(' ');

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
      component.bind('onchange', (function(event, comp) {
        return value(this.value);
      }), 'before');
    }
  }
  return component;
};

_ref = 'text checkbox radio date email tel number'.split(' ');
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
for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
  type = _ref[_j];
  _fn1(type);
}
