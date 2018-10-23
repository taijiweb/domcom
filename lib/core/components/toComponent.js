var Nothing, Text, isComponent, react, toComponent;

isComponent = require('./isComponent');

Nothing = require('./Nothing');

Text = require('./Text');

({react} = require('lazy-flow'));

module.exports = toComponent = function(item) {
  var Func, List, component, e;
  if (isComponent(item)) {
    return item;
  } else if (typeof item === 'function') {
    return new Text(item);
  } else if (item instanceof Array) {
    List = require('./List'); // avoid loop require
    return new List((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = item.length; i < len; i++) {
        e = item[i];
        results.push(toComponent(e));
      }
      return results;
    })());
  } else if (item == null) {
    return new Nothing();
  } else if (item.then && item.catch) {
    Func = require('./Func'); // avoid loop require
    component = new Func(react(function() {
      return component.promiseResult;
    }));
    item.then(function(value) {
      component.promiseResult = value;
      return component.invalideTransform();
    }).catch(function(error) {
      component.promiseResult = error;
      return component.invalideTransform();
    });
    return component;
  } else {
    return new Text(item);
  }
};
