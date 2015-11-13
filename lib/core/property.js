var attrPropNameMap, classFn, cloneObject, config, domField, extend, extendEventValue, isArray, isComponent, overAttrs, react, styleFrom, _ref,
  __slice = [].slice;

_ref = require('dc-util'), isArray = _ref.isArray, cloneObject = _ref.cloneObject;

domField = require('../dom-util').domField;

react = require('lazy-flow').react;

extend = require('extend');

isComponent = require('./base/isComponent').isComponent;

exports.extendEventValue = extendEventValue = function(props, prop, value, before) {
  var oldValue;
  oldValue = props[prop];
  if (!oldValue) {
    oldValue = [];
  } else if (!(oldValue instanceof Array)) {
    oldValue = [oldValue];
  }
  if (!value) {
    value = [];
  } else if (!(value instanceof Array)) {
    value = [value];
  }
  if (before) {
    return props[prop] = value.concat(oldValue);
  } else {
    return props[prop] = oldValue.concat(value);
  }
};

exports.extendAttrs = function(attrs, obj, options) {
  var key, objClass, value;
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
  if (obj.style) {
    extend(styleFrom(attrs.style), obj.style);
  }
  for (key in obj) {
    value = obj[key];
    if (key.slice(0, 2) === 'on') {
      if (options['replace_' + key] || options.replaceEvents) {
        attrs[key] = value;
      } else {
        extendEventValue(attrs, key, value);
      }
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

exports.classFn = classFn = function() {
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
          value = value();
        }
        if (value) {
          lst.push(klass);
        }
      }
      return lst.join(' ');
    } else {
      extendClassMap(arguments.slice());
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
    var item, name, names, value, _i, _j, _len, _len1, _ref1;
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
        _ref1 = item.classMap;
        for (name in _ref1) {
          value = _ref1[name];
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
  return method;
};

exports.styleFrom = styleFrom = function(value) {
  var item, key, result, v, _i, _j, _len, _len1, _ref1, _ref2;
  if (typeof value === 'string') {
    result = {};
    value = value.trim().split(/\s*;\s*/);
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      item = value[_i];
      item = item.trim();
      if (!item) {
        continue;
      }
      _ref1 = item.split(/\s*:\s*/), key = _ref1[0], v = _ref1[1];
      result[key] = v;
    }
    return result;
  } else if (value instanceof Array) {
    result = {};
    for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
      item = value[_j];
      if (typeof item === 'string') {
        item = item.trim();
        if (!item) {
          continue;
        }
        _ref2 = item.split(/\s*:\s*/), key = _ref2[0], value = _ref2[1];
      } else {
        key = item[0], value = item[1];
      }
      result[key] = value;
    }
    return result;
  } else if (value && typeof value !== 'object') {
    return {};
  } else {
    return cloneObject(value);
  }
};

config = require('../config');

exports.eventHandlerFromArray = function(callbackList, eventName, component) {
  return function(event) {
    var comp, fn, node, options, updateList, _i, _j, _len, _len1, _ref1;
    node = component.node;
    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
      fn = callbackList[_i];
      fn && fn.call(node, event, component);
    }
    updateList = component.eventUpdateConfig[eventName];
    if (updateList) {
      for (_j = 0, _len1 = updateList.length; _j < _len1; _j++) {
        _ref1 = updateList[_j], comp = _ref1[0], options = _ref1[1];
        if (options.alwaysUpdating || !config.useSystemUpdating) {
          comp[options.method]();
        }
      }
    }
    if (!event) {
      return;
    }
    !event.executeDefault && event.preventDefault();
    !event.continuePropagation && event.stopPropagation();
  };
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
