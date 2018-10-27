var classFn, domField, exports, isArray, react;

({react} = require('lazy-flow'));

({domField} = require('../dom-util'));

({isArray} = require('dc-util'));

module.exports = exports = classFn = function(...items) {
  var classMap, extendClassMap, method, processClassValue;
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
    oldValue = classMap[name];
    if (typeof oldValue === 'function') {
      oldValue.offInvalidate(method.invalidate);
    }
    if (oldValue !== value) { // value is a function or true
      method.invalidate();
      if (typeof value === 'function' && value.onInvalidate) {
        value.onInvalidate(method.invalidate);
      }
    }
    if (value) {
      return classMap[name] = value;
    } else {
      return delete classMap[name];
    }
  };
  extendClassMap = function(items) {
    var i, item, j, len, len1, name, names, ref, value;
    if (!items) {
      return;
    }
    if (!isArray(items)) {
      items = [items];
    }
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      if (!item) {
        continue;
      }
      if (typeof item === 'string') {
        names = item.trim().split(/\s+(?:,\s+)?/);
        for (j = 0, len1 = names.length; j < len1; j++) {
          name = names[j];
          if (name[0] === '!') {
            processClassValue(name.slice(1), false);
          } else {
            processClassValue(name, true);
          }
        }
      } else if (item instanceof Array) {
        extendClassMap(item);
      } else if (item && item.classMap) {
        ref = item.classMap;
        // another classFn
        for (name in ref) {
          value = ref[name];
          processClassValue(name, value);
        }
      } else if (typeof item === 'object') {
        for (name in item) {
          value = item[name];
          processClassValue(name, value);
        }
      }
    }
  };
  react(method);
  extendClassMap(items);
  method.classMap = classMap;
  method.valid = !Object.keys(classMap).length;
  method.removeClass = function(...items) {
    var i, item, len, results;
    results = [];
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      results.push(processClassValue(item, false));
    }
    return results;
  };
  method.extend = function(...items) {
    return extendClassMap(items);
  };
  method.clone = function() {
    var newClassName;
    newClassName = classFn();
    return newClassName.extend(method);
  };
  return method;
};

exports.classFn = classFn;
