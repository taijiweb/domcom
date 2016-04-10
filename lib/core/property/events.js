var extendEventValue;

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

exports.domEventHandler = function(event) {
  var component, domEventCallbacks, eventType, fn, updating, _i, _len;
  eventType = 'on' + event.type;
  component = this.component;
  domEventCallbacks = component.domEventCallbackMap[eventType];
  for (_i = 0, _len = domEventCallbacks.length; _i < _len; _i++) {
    fn = domEventCallbacks[_i];
    if (fn) {
      fn.call(this, event);
    }
  }
  if ((updating = this.component && this.component.eventUpdateConfig[eventType]) != null) {
    dc.update(updating);
  } else {
    dc.update();
  }
  if (event) {
    if (!event.executeDefault && event.preventDefault) {
      event.preventDefault();
    }
    if (!event.continuePropagation && event.stopPropagation) {
      event.stopPropagation();
    }
  }
};

exports.domEventHandlerFromArray = function(callbackArray) {
  return function(event) {
    var fn, _i, _len;
    for (_i = 0, _len = callbackArray.length; _i < _len; _i++) {
      fn = callbackArray[_i];
      fn && fn.call(this, event);
    }
  };
};
