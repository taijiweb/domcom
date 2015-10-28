var hasOwn, isPlainObject, toString;

hasOwn = Object.prototype.hasOwnProperty;

toString = Object.prototype.toString;

isPlainObject = function(obj) {
  'use strict';
  var has_is_property_of_method, has_own_constructor, key;
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }
  has_own_constructor = hasOwn.call(obj, 'constructor');
  has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
    return false;
  }
  for (key in obj) {
    key = key;
  }
  return key === void 0 || hasOwn.call(obj, key);
};

module.exports = function() {
  var clone, copy, copyIsArray, deep, i, length, name, options, src, target;
  target = arguments[0];
  i = 1;
  length = arguments.length;
  deep = false;
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  } else if (typeof target !== 'object' && typeof target !== 'function' || target === null) {
    target = {};
  }
  while (i < length) {
    options = arguments[i];
    if (options !== null) {
      for (name in options) {
        name = name;
        src = target[name];
        copy = options[name];
        if (target === copy) {
          ++i;
          continue;
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[name] = extend(deep, clone, copy);
        } else if (copy !== void 0) {
          target[name] = copy;
        }
      }
    }
    ++i;
  }
  return target;
};
