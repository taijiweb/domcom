var attrPropNameMap, classFn, extend, extendEventValue, isComponent, overAttrs, styleFrom;

extend = require('extend');

isComponent = require('../base/isComponent').isComponent;

extendEventValue = require('./events').extendEventValue;

classFn = require('./classFn');

styleFrom = require('./style').styleFrom;

exports.extendAttrs = function(attrs, obj, options) {
  var key, objClass, style, value;
  if (options == null) {
    options = {};
  }
  if (!obj) {
    return attrs;
  } else if (!attrs) {
    return obj;
  }
  objClass = classFn([obj["class"], obj.className]);
  if (options.replaceClass) {
    attrs.className = objClass;
  } else {
    attrs.className = classFn([attrs["class"], attrs.className]);
    delete attrs["class"];
    attrs.className = classFn([attrs.className, objClass]);
  }
  style = styleFrom(attrs.style);
  if (obj.style) {
    attrs.style = extend(style, obj.style);
  } else {
    attrs.style = style;
  }
  for (key in obj) {
    value = obj[key];
    if (key === 'class' || key === 'className') {
      continue;
    } else if (key.slice(0, 2) === 'on') {
      if (options['replace_' + key] || options.replaceEvents) {
        attrs[key] = value;
      } else {
        extendEventValue(attrs, key, value);
      }
    } else if (key === 'style') {
      continue;
    } else {
      attrs[key] = value;
    }
  }
  return attrs;
};

exports.overAttrs = overAttrs = function(attrs, obj) {
  var key, value;
  if (!obj) {
    attrs = extend({}, attrs);
    if (attrs.style) {
      attrs.style = extend({}, styleFrom(attrs.style));
    }
    return attrs;
  } else if (!attrs) {
    return obj;
  } else {
    for (key in attrs) {
      value = attrs[key];
      if (obj[key] == null) {
        obj[key] = value;
      }
      if (key === 'style') {
        obj[key] = overAttrs(attrs[key], obj[key]);
      }
    }
    return obj;
  }
};

attrPropNameMap = {
  'for': 'htmlFor'
};

exports.attrToPropName = function(name) {
  var i, len, newName, pieces;
  if (newName = attrPropNameMap[name]) {
    return newName;
  }
  pieces = name.split('-');
  if (pieces.length === 1) {
    return name;
  }
  i = 1;
  len = pieces.length;
  while (i < len) {
    pieces[i] = pieces[i][0].toUpperCase() + pieces[i].slice(1);
    i++;
  }
  return pieces.join('');
};
