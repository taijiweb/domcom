var attrPropNameMap, classFn, domField, extend, extendEventValue, isComponent, styleFrom;

extend = require('extend');

({isComponent} = require('../components/isComponent'));

({extendEventValue} = require('./events'));

classFn = require('./classFn');

({styleFrom} = require('./style'));

({domField} = require('../dom-util'));

exports.extendAttrs = function(attrs, obj, options = {}) {
  var key, objClass, style, value;
  if (!obj) {
    return attrs;
  } else if (!attrs) {
    return obj;
  }
  objClass = classFn([obj.class, obj.className]);
  if (options.replaceClass) {
    attrs.className = objClass;
  } else {
    attrs.className = classFn([attrs.class, attrs.className]);
    delete attrs.class;
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
      // class and className have been processed in advance
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

attrPropNameMap = {
  'for': 'htmlFor'
};

exports.attrToPropName = function(name) {
  var i, len, newName, pieces;
  if (newName = attrPropNameMap[name]) {
    return newName;
  } else {
    pieces = name.split('-');
    if (pieces.length === 1) {
      return name;
    } else {
      i = 1;
      len = pieces.length;
      while (i < len) {
        pieces[i] = pieces[i][0].toUpperCase() + pieces[i].slice(1);
        i++;
      }
      return pieces.join('');
    }
  }
};

exports.setText = function(text) {
  var me;
  text = domField(text, this);
  if (this._text === text) {
    return this;
  }
  this._text = text;
  me = this;
  if (typeof text === 'function') {
    text.onInvalidate(function() {
      return me.invalidate();
    });
  }
  this.invalidate();
  return this;
};
