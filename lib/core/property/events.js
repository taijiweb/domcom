var addEventListenerMap, eventName, extendEventValue, _i, _len, _ref;

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
      dc.clean();
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

exports.addEventListenerMap = addEventListenerMap = {};

_ref = 'compositionstart compositionupdate compositionend'.split(/\s/);
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  eventName = _ref[_i];
  addEventListenerMap['on' + eventName] = true;
}

exports.domEventHandlerFromArray = function(callbackArray) {
  return function(event) {
    var fn, _j, _len1;
    for (_j = 0, _len1 = callbackArray.length; _j < _len1; _j++) {
      fn = callbackArray[_j];
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
  var callback, index, _j, _len1;
  if (typeof handler === 'function') {
    handler = [handler];
  }
  if (before) {
    callback = handler.pop();
    while (callback) {
      if (!callback) {
        dc.error('addHandlerToCallbackArray: callback is undefined');
      }
      index = callbacks.indexOf(callback);
      if (index <= 0) {
        callbacks.unshift(callback);
      }
      callback = handler.pop();
    }
  } else {
    for (_j = 0, _len1 = handler.length; _j < _len1; _j++) {
      callback = handler[_j];
      if (!callback) {
        dc.error('addHandlerToCallbackArray: callback is undefined');
      }
      index = callbacks.indexOf(callback);
      if (index <= 0) {
        callbacks.push(callback);
      }
    }
  }
};
