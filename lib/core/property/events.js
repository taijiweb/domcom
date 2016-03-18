var config, extendEventValue;

config = require('../../config');

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

exports.eventHandlerFromArray = function(callbackList, eventName) {
  return function(event) {
    var component, fn, updating, _i, _len;
    component = this.component;
    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
      fn = callbackList[_i];
      if (fn) {
        fn.call(this, event, component);
      }
    }
    if ((updating = component.eventUpdateConfig[eventName]) != null) {
      dc.update(updating);
    }
    if (!event) {
      return;
    }
    if (!event.executeDefault) {
      event.preventDefault();
    }
    if (!event.continuePropagation) {
      event.stopPropagation();
    }
  };
};
