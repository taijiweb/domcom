var Component, componentId, dc, extend, isComponent, mountList, newDcid, normalizeDomElement,
  __slice = [].slice;

extend = require('extend');

normalizeDomElement = require('../../dom-util').normalizeDomElement;

newDcid = require('dc-util').newDcid;

isComponent = require('./isComponent');

dc = require('../../dc');

componentId = 1;

mountList = [];

module.exports = Component = (function() {
  function Component() {
    this.listeners = {};
    this.baseComponent = null;
    this.parentNode = null;
    this.node = null;
    this.dcid = newDcid();
  }

  Component.prototype.on = function(event, callback) {
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
      listeners = this.listeners;
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
  };

  Component.prototype.off = function(event, callback) {
    var callbacks, listeners, _i, _j, _len, _len1, _ref, _ref1;
    if (this.argmuents.length) {
      dc.error('missing arguments for Component.off(event, callback)');
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
        if (callbacks && callbacks.indexOf(callback) >= 0) {
          callbacks.splice(index, 1);
          if (!callbacks.length) {
            listeners[event] = null;
          }
        }
      }
    }
    return this;
  };

  Component.prototype.emit = function() {
    var args, callback, callbacks, event, _i, _len;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!(callbacks = this.listeners[event])) {
      return;
    }
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      callback.apply(this, args);
    }
    return this;
  };


  /* if mountNode is given, it should not the node of any Component
  only use beforeNode if mountNode is given
   */

  Component.prototype.mount = function(mountNode, beforeNode) {
    this.emit('beforeMount');
    this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.getElementsByTagName('body')[0];
    this.renderDom();
    this.emit('afterMount');
    return this;
  };

  Component.prototype.create = function() {
    return this.renderDom();
  };

  Component.prototype.render = function() {
    return this.renderDom();
  };

  Component.prototype.update = function() {
    this.emit('update');
    this.renderDom();
    return this;
  };

  Component.prototype.unmount = function() {
    var component, holder;
    this.emit('beforeUnmount');
    if (!this.node || !this.node.parentNode) {
      this.emit('afterUnmount');
      return this;
    } else {
      component = this;
      holder = this.holder;
      while (holder && !holder.isBaseComponent) {
        component = holder;
        holder = holder.holder;
      }
      if (holder && (holder.isList || holder.isTag)) {
        holder.removeChild(holder.dcidIndexMap[component.dcid]);
      }
      component.markRemovingDom(true);
      component.removeDom();
      this.emit('afterUnmount');
      return this;
    }
  };

  Component.prototype.remount = function(parentNode) {
    var child, holder, index;
    this.emit('beforeMount');
    child = this;
    holder = this.holder;
    while (holder && !holder.isBaseComponent) {
      child = holder;
      holder = holder.holder;
    }
    if ((holder && (holder.isList || holder.isTag)) && (index = holder.dcidIndexMap[child.dcid])) {
      index = index != null ? index : holder.children.length;
      holder.insertChild(index, child);
    }
    child.parentNode = holder ? holder.parentNode : parentNode ? parentNode : document.body;
    child.invalidate();
    if (holder && (holder.isList || holder.isTag)) {
      holder.renderDom();
    } else {
      child.renderDom();
    }
    this.emit('afterMount');
    return child;
  };

  Component.prototype.destroy = function() {
    this.listeners = null;
    this.node = null;
    this.baseComponent = null;
    return this.parentNode = null;
  };


  /*
  component.updateWhen components, events
  component.updateWhen setInterval, interval, options
  component.updateWhen dc.raf, options
   */

  Component.prototype.updateWhen = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._renderWhenBy('update', args);
  };

  Component.prototype.renderWhen = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this._renderWhenBy('render', args);
  };

  Component.prototype._renderWhenBy = function(method, args) {
    if (args[0] === setInterval) {
      if (args[1] === 'number') {
        dc._renderWhenBy(method, setInterval, args[1], [this], args[2]);
      } else {
        dc._renderWhenBy(method, setInterval, [this], args[1]);
      }
    } else if (args[1] === dc.raf) {
      dc._renderWhenBy(method, dc.raf, [this], args[1]);
    } else {
      dc._renderWhenBy(method, args[0], args[1], [this]);
    }
    return this;
  };

  Component.prototype.setNode = function(node) {
    var holder;
    holder = this;
    while (1) {
      holder.node = node;
      holder = holder.holder;
      if (!holder || holder.isBaseComponent) {
        return;
      }
    }
  };

  Component.prototype.setFirstNode = function(firstNode) {
    var holder;
    holder = this;
    while (1) {
      holder.firstNode = firstNode;
      holder = holder.holder;
      if (!holder || holder.isBaseComponent) {
        break;
      }
    }
  };

  Component.prototype.reachTag = function() {
    var holder;
    holder = this.holder;
    while (!holder.isTag && holder.holder) {
      holder = holder.holder;
    }
    return holder;
  };

  Component.prototype.addController = function(controller) {
    return controller.component = this;
  };

  Component.prototype.copyEventListeners = function(srcComponent) {
    var event, myListeners, srcListeners;
    myListeners = this.listeners;
    srcListeners = srcComponent.listeners;
    for (event in srcListeners) {
      srcListeners[event] && (myListeners[event] = srcListeners[event].splice());
    }
    return this;
  };

  return Component;

})();
