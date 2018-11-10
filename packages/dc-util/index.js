var dupStr, globalDcid, hasOwn, isArray,
  __slice = [].slice;

exports.isArray = isArray = function(item) {
  return Object.prototype.toString.call(item) === '[object Array]';
};

exports.isObject = function(item) {
  return typeof item === 'object' && item !== null;
};

exports.cloneObject = function(obj) {
  var key, result;
  result = {};
  for (key in obj) {
    result[key] = obj[key];
  }
  return result;
};

exports.pairListDict = function() {
  var i, keyValuePairs, len, result;
  keyValuePairs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if (keyValuePairs.length === 1) {
    keyValuePairs = keyValuePairs[0];
  }
  len = keyValuePairs.length;
  i = 0;
  result = {};
  while (i < len) {
    result[keyValuePairs[i]] = keyValuePairs[i + 1];
    i += 2;
  }
  return result;
};

dupStr = function(str, n) {
  var i, s;
  s = '';
  i = 0;
  while (i++ < n) {
    s += str;
  }
  return s;
};

exports.newLine = function(str, indent, addNewLine) {
  if (addNewLine) {
    return '\n' + dupStr(' ', indent) + str;
  } else {
    return str;
  }
};

exports.funcString = function(fn) {
  var e, s;
  if (typeof fn !== 'function') {
    if (fn == null) {
      return 'null';
    }
    if (fn.getBaseComponent) {
      return fn.toString();
    } else {
      try {
        return JSON.stringify(fn);
      } catch (_error) {
        e = _error;
        return fn.toString();
      }
    }
  }
  s = fn.toString();
  if (fn.invalidate) {
    return s;
  }
  if (s.slice(0, 12) === "function (){") {
    s = s.slice(12, s.length - 1);
  } else if (s.slice(0, 13) === "function () {") {
    s = s.slice(13, s.length - 1);
  } else {
    s = s.slice(9);
  }
  s = s.trim();
  if (s.slice(0, 7) === 'return ') {
    s = s.slice(7);
  }
  if (s[s.length - 1] === ';') {
    s = s.slice(0, s.length - 1);
  }
  return 'fn:' + s;
};

globalDcid = 1;

exports.newDcid = function() {
  return globalDcid++;
};

exports.isEven = function(n) {
  if (n < 0) {
    n = -n;
  }
  while (n > 0) {
    n -= 2;
  }
  return n === 0;
};

exports.matchCurvedString = function(str, i) {
  var ch, level;
  if (str[i] !== '(') {
    return;
  }
  level = 0;
  while (ch = str[++i]) {
    if (ch === '\\') {
      if (!(ch = str[++i])) {
        return;
      }
    } else if (ch === '(') {
      level++;
    } else if (ch === ')') {
      if (level === 0) {
        return ++i;
      } else {
        level--;
      }
    }
  }
};

exports.intersect = function(maps) {
  var isMember, key, m, m2, result, _i, _len, _ref;
  result = {};
  m = maps[0];
  for (key in m) {
    isMember = true;
    _ref = maps.slice(1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m2 = _ref[_i];
      if (!m2[key]) {
        isMember = false;
        break;
      }
    }
    isMember && (result[key] = m[key]);
  }
  return result;
};

exports.substractSet = function(whole, unit) {
  var key;
  for (key in unit) {
    delete whole[key];
  }
  return whole;
};

exports.binarySearch = function(item, items) {
  var end, index, length, start;
  length = items.length;
  if (!length) {
    return 0;
  }
  if (length === 1) {
    if (items[0] >= item) {
      return 0;
    } else {
      return 1;
    }
  }
  start = 0;
  end = length - 1;
  while (1) {
    index = start + Math.floor((end - start) / 2);
    if (start === end) {
      if (items[index] >= item) {
        return index;
      } else {
        return index + 1;
      }
    } else if (item === items[index]) {
      return index;
    }
    if (item === items[index + 1]) {
      return index + 1;
    } else if (item < items[index]) {
      end = index;
    } else if (item > items[index + 1]) {
      start = index + 1;
    } else {
      return index + 1;
    }
  }
};

exports.binaryInsert = function(item, items) {
  var end, index, length, start;
  length = items.length;
  if (!length) {
    items[0] = item;
    return 0;
  }
  if (length === 1) {
    if (items[0] === item) {
      return 0;
    } else if (items[0] > item) {
      items[1] = items[0];
      items[0] = item;
      return 0;
    } else {
      items[1] = item;
      return 1;
    }
  }
  start = 0;
  end = length - 1;
  while (1) {
    index = start + Math.floor((end - start) / 2);
    if (start === end) {
      if (items[index] === item) {
        return index;
      } else if (items[index] > item) {
        items.splice(index, 0, item);
        return index;
      } else {
        items.splice(index + 1, 0, item);
        return index + 1;
      }
    } else if (item === items[index]) {
      return index;
    }
    if (item === items[index + 1]) {
      return index + 1;
    } else if (item < items[index]) {
      end = index;
    } else if (item > items[index + 1]) {
      start = index + 1;
    } else {
      items.splice(index + 1, 0, item);
      return index + 1;
    }
  }
};

exports.foreach = function(items, callback) {
  var i, item, key, result, _i, _len;
  if (!items) {
    return;
  }
  if (isArray(items)) {
    result = [];
    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
      item = items[i];
      result.push(callback(item, i));
    }
  } else {
    result = {};
    for (key in items) {
      item = items[key];
      result[key] = callback(item, key);
    }
  }
  return result;
};

hasOwn = Object.hasOwnProperty;

exports.mixin = function(proto, mix) {
  var key, value;
  for (key in mix) {
    value = mix[key];
    if (hasOwn.call(proto, key)) {
      continue;
    } else {
      proto[key] = value;
    }
  }
  return proto;
};

exports.makeReactMap = function(description) {
  var field, item, items, pair, reactField, result, _i, _j, _len, _len1, _ref;
  result = {};
  items = description.split(/\s*,\s*/);
  for (_i = 0, _len = items.length; _i < _len; _i++) {
    item = items[_i];
    pair = item.trim().split(/\s*:\s*/);
    if (pair.length === 1) {
      result[pair[0]] = '';
    } else {
      reactField = pair[1];
      _ref = pair[0].split(/\s+/);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        field = _ref[_j];
        result[field] = reactField;
      }
    }
  }
  return result;
};
