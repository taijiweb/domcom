var Text, isComponent, react, toComponent;

isComponent = require('./isComponent');

Text = require('./Text');

react = require('lazy-flow').react;

module.exports = toComponent = function(item) {
  var Func, List, component, e;
  if (isComponent(item)) {
    return item;
  } else if (typeof item === 'function') {
    return new Text(item);
  } else if (item instanceof Array) {
    List = require('./List');
    return new List((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = item.length; _i < _len; _i++) {
        e = item[_i];
        _results.push(toComponent(e));
      }
      return _results;
    })());
  } else if (item == null) {
    return new Text('');
  } else if (item.then && item["catch"]) {
    Func = require('./Func');
    component = new Func(react(function() {
      return component.promiseResult;
    }));
    item.then(function(value) {
      component.promiseResult = value;
      return component.invalideTransform();
    })["catch"](function(error) {
      component.promiseResult = error;
      return component.invalideTransform();
    });
    return component;
  } else {
    return new Text(item);
  }
};
