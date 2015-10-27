var Component, componentId, dc, extend, isComponent, mountList, newDcid, normalizeDomElement,
  __slice = [].slice;

extend = require('../../extend');

normalizeDomElement = require('../../dom-util').normalizeDomElement;

newDcid = require('../../util').newDcid;

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
    var callbacks;
    callbacks = this.listeners[event] || (this.listeners[event] = []);
    callbacks.push(callback);
    return this;
  };

  Component.prototype.off = function(event, callback) {
    var callbacks;
    callbacks = this.listeners[event] || (this.listeners[event] = []);
    callbacks.indexOf(callback) >= 0 && callbacks.splice(index, 1);
    !callbacks.length && (this.listeners[event] = null);
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
    var child, holder;
    this.emit('beforeUnmount');
    if (!this.node || !this.node.parentNode) {
      this.emit('afterUnmount');
      return this;
    }
    child = this;
    holder = this.holder;
    while (holder && !holder.isBaseComponent) {
      child = holder;
      holder = holder.holder;
    }
    if (holder && (holder.isList || holder.isTag)) {
      holder.removeChild(holder.dcidIndexMap[child.dcid]);
    }
    child.parentNode = null;
    if (holder && (holder.isList || holder.isTag)) {
      holder.renderDom();
    } else {
      child.renderDom();
    }
    this.emit('afterUnmount');
    return child;
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
    if ((holder.isList || holder.isTag) && (index = holder.dcidIndexMap[child.dcid])) {
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


  /* component.updateWhen [components, events] ...
  component.updateWhen components..., events...
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
    var i, item, length, _i, _len;
    if (args[0] instanceof Array) {
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        item = args[_i];
        dc._renderWhenBy.apply(dc, [method].concat(__slice.call(item), [[this]]));
      }
    } else {
      i = 0;
      length = args.length;
      while (i < length) {
        if (!isComponent(args[i])) {
          break;
        }
        i++;
      }
      if (i > 0) {
        dc._renderWhenBy(method, args.slice(0, i), args.slice(i), [this]);
      } else {
        if (args[0] === setInterval) {
          if (args[1] === 'number') {
            dc._renderWhenBy(method, setInterval, args[1], [this], args[2]);
          } else {
            dc._renderWhenBy(setInterval, [this], args[1]);
          }
        } else if (args[1] === dc.raf) {
          dc._renderWhenBy(method, dc.raf, [this], args[1]);
        }
      }
    }
    return this;
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
