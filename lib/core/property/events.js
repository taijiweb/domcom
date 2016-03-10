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
    var comp, component, fn, options, updateList, _i, _j, _len, _len1, _ref;
    component = this.component;
    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
      fn = callbackList[_i];
      if (fn) {
        fn.call(this, event, component);
      }
    }
    updateList = component.eventUpdateConfig[eventName];
    if (updateList) {
      for (_j = 0, _len1 = updateList.length; _j < _len1; _j++) {
        _ref = updateList[_j], comp = _ref[0], options = _ref[1];
        if (options.alwaysUpdating || !config.useSystemUpdating) {
          dc.update();
        }
      }
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
