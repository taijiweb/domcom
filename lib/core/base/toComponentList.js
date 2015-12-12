var toComponent, toComponentList;

toComponent = require('./toComponent');

module.exports = toComponentList = function(item) {
  var e, _i, _len, _results;
  if (!item) {
    return [];
  } else if (item instanceof Array) {
    _results = [];
    for (_i = 0, _len = item.length; _i < _len; _i++) {
      e = item[_i];
      _results.push(toComponent(e));
    }
    return _results;
  } else {
    return [toComponent(item)];
  }
};
