var cloneObject, styleFrom;

({cloneObject} = require('dc-util'));

exports.styleFrom = styleFrom = function(value) {
  var i, item, j, key, len, len1, result, v;
  if (typeof value === 'string') {
    result = {};
    value = value.trim().split(/\s*;\s*/);
    for (i = 0, len = value.length; i < len; i++) {
      item = value[i];
      item = item.trim();
      if (!item) {
        continue;
      }
      [key, v] = item.split(/\s*:\s*/);
      result[key] = v;
    }
    return result;
  } else if (value instanceof Array) {
    result = {};
    for (j = 0, len1 = value.length; j < len1; j++) {
      item = value[j];
      if (typeof item === 'string') {
        item = item.trim();
        if (!item) {
          continue;
        }
        [key, value] = item.split(/\s*:\s*/);
      } else {
        [key, value] = item;
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
