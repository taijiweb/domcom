var extendEventValue;

exports.domEventHandler = function(event) {
  var comp, component, componentMap, domEventCallbacks, eventType, fn, result, _, _i, _len;
  if (component = this.component) {
    eventType = 'on' + event.type;
    domEventCallbacks = component.domEventCallbackMap[eventType];
    for (_i = 0, _len = domEventCallbacks.length; _i < _len; _i++) {
      fn = domEventCallbacks[_i];
      result = fn.call(component, event, this);
    }
    if (componentMap = component.eventUpdateConfig[eventType]) {
      for (_ in componentMap) {
        comp = componentMap[_];
        comp.render();
      }
    }
    if (event) {
      if (!event.executeDefault && event.preventDefault) {
        event.preventDefault();
      }
      if (!event.continuePropagation && event.stopPropagation) {
        event.stopPropagation();
      }
    }
  }
  if (event && (event.dcEventResult != null)) {
    return event.dcEventResult;
  } else {
    return result;
  }
};

exports.domEventHandlerFromArray = function(callbackArray) {
  return function(event) {
    var fn, _i, _len;
    for (_i = 0, _len = callbackArray.length; _i < _len; _i++) {
      fn = callbackArray[_i];
      fn && fn.call(this.component, event, this);
    }
  };
};

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

exports.addHandlerToCallbackArray = function(handler, callbacks, before) {
  var callback, index, _i, _len;
  if (typeof handler === 'function') {
    handler = [handler];
  }
  if (before) {
    callback = handler.pop();
    while (callback) {
      index = callbacks.indexOf(callback);
      if (index <= 0) {
        callbacks.unshift(callback);
      }
      callback = handler.pop();
    }
  } else {
    for (_i = 0, _len = handler.length; _i < _len; _i++) {
      callback = handler[_i];
      index = callbacks.indexOf(callback);
      if (index <= 0) {
        callbacks.push(callback);
      }
    }
  }
};
