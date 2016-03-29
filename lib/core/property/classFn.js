var classFn, domField, isArray, react,
  __slice = [].slice;

react = require('lazy-flow').react;

domField = require('../../dom-util').domField;

isArray = require('dc-util').isArray;

module.exports = classFn = function() {
  var classMap, extendClassMap, items, method, processClassValue;
  items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  classMap = {};
  method = function() {
    var klass, lst, value;
    if (!arguments.length) {
      lst = [];
      method.valid = true;
      for (klass in classMap) {
        value = classMap[klass];
        if (typeof value === 'function') {
          value = value.call(this);
        }
        if (value) {
          lst.push(klass);
        }
      }
      return lst.join(' ');
    } else {
      extendClassMap([].slice(arguments));
    }
  };
  processClassValue = function(name, value) {
    var oldValue;
    value = domField(value);
    oldValue = classMap[name];
    if (typeof oldValue === 'function') {
      oldValue.offInvalidate(method.invalidate);
    }
    if (!value && oldValue) {
      method.invalidate();
      return delete classMap[name];
    } else {
      if (oldValue !== value) {
        method.invalidate();
        if (typeof value === 'function') {
          value.onInvalidate(method.invalidate);
        }
        return classMap[name] = value;
      }
    }
  };
  extendClassMap = function(items) {
    var item, name, names, value, _i, _j, _len, _len1, _ref;
    if (!items) {
      return;
    }
    if (!isArray(items)) {
      items = [items];
    }
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        names = item.trim().split(/\s+(?:,\s+)?/);
        for (_j = 0, _len1 = names.length; _j < _len1; _j++) {
          name = names[_j];
          if (name[0] === '!') {
            processClassValue(name.slice(1), false);
          } else {
            processClassValue(name, true);
          }
        }
      } else if (item instanceof Array) {
        extendClassMap(item);
      } else if (item && item.classMap) {
        _ref = item.classMap;
        for (name in _ref) {
          value = _ref[name];
          if (typeof value !== 'function') {
            value = true;
          }
          processClassValue(name, value);
        }
      } else if (typeof item === 'object') {
        for (name in item) {
          value = item[name];
          if (typeof value !== 'function') {
            value = true;
          }
          processClassValue(name, value);
        }
      }
    }
  };
  react(method);
  extendClassMap(items);
  method.classMap = classMap;
  method.valid = !Object.keys(classMap).length;
  method.removeClass = function() {
    var item, items, _i, _len, _results;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(processClassValue(item, false));
    }
    return _results;
  };
  method.extend = function() {
    var items;
    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return extendClassMap(items);
  };
  method.clone = function() {
    var newClassName;
    newClassName = classFn();
    return newClassName.extend(method);
  };
  return method;
};
