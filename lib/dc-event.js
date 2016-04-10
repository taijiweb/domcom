var dcEventMixin,
  __slice = [].slice;

module.exports = dcEventMixin = {
  on: function(event, callback) {
    var callbacks, eventName, listeners, _i, _len, _ref;
    if (!arguments.length) {
      dc.error('missing arguments for Component.on(event, callback)');
    }
    if (arguments.length === 1) {
      if (!event || typeof event !== 'object') {
        dc.error('wrong arguments for Component.on(event, callback)');
      } else {
        for (eventName in event) {
          callback = event[eventName];
          this.on(eventName, callback);
        }
      }
    } else {
      if (!(listeners = this.listeners)) {
        this.listeners = listeners = {};
      }
      _ref = event.split(/\s*,\s*|\s+/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        if (callbacks = listeners[event]) {
          if (callbacks.indexOf(callback) < 0) {
            callbacks.push(callback);
          }
        } else {
          listeners[event] = [callback];
        }
      }
    }
    return this;
  },
  off: function(event, callback) {
    var callbacks, index, listeners, _i, _j, _len, _len1, _ref, _ref1;
    if (!arguments.length) {
      this.listeners = {};
    } else if (arguments.length === 1) {
      listeners = this.listeners;
      _ref = event.split(/\s*,\s*|\s+/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        listeners[event] = null;
      }
    } else {
      listeners = this.listeners;
      _ref1 = event.split(/\s*,\s*|\s+/);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        event = _ref1[_j];
        callbacks = listeners[event];
        if (callbacks && (index = callbacks.indexOf(callback)) >= 0) {
          callbacks.splice(index, 1);
          if (!callbacks.length) {
            listeners[event] = null;
          }
        }
      }
    }
    return this;
  },
  once: function(event, callback) {
    var onceCallback;
    onceCallback = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.off(event, onceCallback);
      return callback.apply(this, args);
    };
    return this.on(event, onceCallback);
  },
  emit: function() {
    var args, callback, callbacks, event, method, _i, _len;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.destroyed) {
      return this;
    }
    if (callbacks = this.listeners[event]) {
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        callback = callbacks[_i];
        callback.apply(this, args);
      }
    } else {
      if (method = this[event]) {
        method.apply(this, args);
      }
    }
    return this;
  }
};
