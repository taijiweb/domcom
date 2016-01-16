var cloneObject, styleFrom;

cloneObject = require('dc-util').cloneObject;

exports.styleFrom = styleFrom = function(value) {
  var item, key, result, v, _i, _j, _len, _len1, _ref, _ref1;
  if (typeof value === 'string') {
    result = {};
    value = value.trim().split(/\s*;\s*/);
    for (_i = 0, _len = value.length; _i < _len; _i++) {
      item = value[_i];
      item = item.trim();
      if (!item) {
        continue;
      }
      _ref = item.split(/\s*:\s*/), key = _ref[0], v = _ref[1];
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
        _ref1 = item.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
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
