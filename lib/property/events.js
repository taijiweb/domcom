var addEventListenerMap, eventName, extendEventValue, i, len, ref;

exports.domEventHandler = function(event) {
  var _, comp, component, componentMap, domEventCallbacks, eventType, fn, i, len, result;
  if (component = this.component) {
    eventType = 'on' + event.type;
    domEventCallbacks = component.domEventCallbackMap[eventType];
    for (i = 0, len = domEventCallbacks.length; i < len; i++) {
      fn = domEventCallbacks[i];
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

// the event in addEventListenerMap do not execute node[eventName]
// e.g. https://developer.mozilla.org/en/docs/Web/Events/compositionstart
// [2] The event was fired in versions of Gecko before 9.0, but didn't have the DOM Level 3 attributes and methods.
// so it's necessary to addEventListener
exports.addEventListenerMap = addEventListenerMap = {};

ref = 'compositionstart compositionupdate compositionend'.split(/\s/);
// todo: finish the full list
for (i = 0, len = ref.length; i < len; i++) {
  eventName = ref[i];
  addEventListenerMap['on' + eventName] = true;
}

exports.domEventHandlerFromArray = function(callbackArray) {
  return function(event) {
    var fn, j, len1;
    for (j = 0, len1 = callbackArray.length; j < len1; j++) {
      fn = callbackArray[j];
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
  var callback, index, j, len1;
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
    for (j = 0, len1 = handler.length; j < len1; j++) {
      callback = handler[j];
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
