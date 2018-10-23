var dcEventMixin;

module.exports = dcEventMixin = {
  on: function(event, callback) {
    var callbacks, eventName, i, len, listeners, ref;
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
      if (!callback) {
        dc.error('Component.on: callback is undefined for event: ' + event);
      }
      if (!(listeners = this.listeners)) {
        this.listeners = listeners = {};
      }
      ref = event.split(/\s*,\s*|\s+/);
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
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
    var callbacks, i, index, j, len, len1, listeners, ref, ref1;
    if (!arguments.length) {
      this.listeners = {};
    } else if (arguments.length === 1) {
      listeners = this.listeners;
      ref = event.split(/\s*,\s*|\s+/);
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
        listeners[event] = null;
      }
    } else {
      listeners = this.listeners;
      ref1 = event.split(/\s*,\s*|\s+/);
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        event = ref1[j];
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
    if (!callback) {
      dc.error('Component.once: callback is undefined for event: ' + event);
    }
    onceCallback = function(...args) {
      this.off(event, onceCallback);
      return callback.apply(this, args);
    };
    return this.on(event, onceCallback);
  },
  emit: function(event, ...args) {
    var callback, callbacks, i, len, method;
    if (!this.destroyed) {
      if (this.listeners && (callbacks = this.listeners[event])) {
        // need to be copied, because onceCallback will be removed from this.listeners[event]
        callbacks = callbacks.slice();
        for (i = 0, len = callbacks.length; i < len; i++) {
          callback = callbacks[i];
          callback.apply(this, args);
        }
      } else {
        if (method = this['on' + event]) {
          method.apply(this, args);
        }
      }
    }
    return this;
  }
};
