var toComponent, toComponentArray;

toComponent = require('./toComponent');

module.exports = toComponentArray = function(item) {
  var e, i, len, results;
  if (!item) {
    return [];
  } else if (item instanceof Array) {
    results = [];
    for (i = 0, len = item.length; i < len; i++) {
      e = item[i];
      results.push(toComponent(e));
    }
    return results;
  } else {
    return [toComponent(item)];
  }
};
