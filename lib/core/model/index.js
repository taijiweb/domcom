
/*
  绑定访问器
  @param path：可以是绑定字段名列表、字符串(列表或单个名字）
*/
var at, isArray;

({isArray} = require('dc-util'));

at = function(path) {
  var sep;
  if (typeof path === 'string') {
    sep = /(\s+)|\s+,\s+/;
    path = path.trim();
    if (path.match(/(\s+)|\s+,\s+/)) {
      path = path.split(sep);
    }
    if (isArray(path)) {
      return path.map(function(item) {
        return new bind(item);
      });
    } else {
      return bind(path);
    }
  }
};

export default {at};
