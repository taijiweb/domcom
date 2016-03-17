var Component, dc, extend, isComponent, newDcid, normalizeDomElement,
  __slice = [].slice;

extend = require('extend');

normalizeDomElement = require('../../dom-util').normalizeDomElement;

newDcid = require('dc-util').newDcid;

isComponent = require('./isComponent');

dc = require('../../dc');

module.exports = Component = (function() {
  function Component() {
    this.listeners = this.listeners || {};
    this.baseComponent = null;
    this.parentNode = null;
    this.nextNode = null;
    this.node = null;
    this.attached = false;
    this.destroyed = false;
    this.holder = null;
    this.dcid = newDcid();
    this.valid = true;
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
  };


  /* if mountNode is given, it should not be the node of any Component
  only use beforeNode if mountNode is given
   */

  Component.prototype.create = function(mountNode, beforeNode, force) {
    var listIndex;
    if (mountNode && mountNode.component) {
      mountNode = mountNode.component;
    } else if (beforeNode && beforeNode.component) {
      console.log(mountNode);
      console.log(beforeNode);
      throw new Error('error while mounting: mountNode is not a component, but beforeNode is a component');
    }
    if (isComponent(mountNode)) {
      if (!beforeNode) {
        if (!mountNode.children) {
          console.log(mountNode);
          throw new Error('error while mounting: mountNode is a component, but is not a Tag or List component');
        }
        mountNode.pushChild(this);
      } else {
        if (!isComponent(beforeNode)) {
          beforeNode = beforeNode.component;
          if (!beforeNode) {
            console.log(beforeNode);
            throw new Error('error while mounting: can not mount beforeNode');
          }
        }
        if (beforeNode.holder !== mountNode || !mountNode.children) {
          console.log(mountNode);
          console.log(beforeNode);
          throw new Error('both mountNode and beforeNode is component, but mountNode is not the parent of beforeNode');
        }
        this.emit('willMount');
        mountNode.insertChildBefore(this, beforeNode);
      }
    } else {
      this.emit('willMount');
      this.holder = dc;
      dc.dcidIndexMap[this.dcid] = listIndex = dc.listIndex;
      dc.invalidateOffspring(this);
      dc.parentNodes[listIndex] = this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body;
      dc.nextNodes[listIndex] = this.nextNode = beforeNode;
      dc.listIndex++;
    }
    dc.update(force);
    return this;
  };

  Component.prototype.mount = function(mountNode, beforeNode) {
    this.emit('willMount');
    this.create(mountNode, beforeNode, true);
    return this.emit('didMount');
  };

  Component.prototype.unmount = function() {
    this.emit('willUnmount');
    this.remove(true);
    this.emit('didUnmount');
    return this;
  };

  Component.prototype.remove = function(force) {
    var component, holder;
    holder = this.holder;
    if (holder === dc) {
      this.markRemovingDom(true);
    } else {
      component = this;
      while (holder && holder !== dc && !holder.isBaseComponent) {
        component = holder;
        holder = holder.holder;
      }
      if (!holder) {
        return this;
      } else if (holder.children) {
        holder.removeChild(component);
      } else if (holder !== dc) {
        dc.error('Should not remove the content of TransformComponent');
      }
    }
    return dc.update(force);
  };

  Component.prototype.replace = function(oldComponent, force) {
    var holder;
    if (this.destroyed || this === oldComponent) {
      return;
    }
    holder = oldComponent.holder;
    if (holder !== dc) {
      if (holder.isTransformComponent) {
        dc.error('Should not replace the content of TransformComponent');
      } else {
        holder.replaceChild(oldComponent, this);
      }
    } else {
      this.setParentNode(oldComponent.parentNode);
      this.sinkNextNode(oldComponent.nextNode);
      oldComponent.markRemovingDom(true);
      this.holder = holder;
      this.invalidate();
    }
    dc.update(force);
    return this;
  };

  Component.prototype.destroy = function() {
    this.destroyed = true;
    this.remove();
    this.listeners = null;
    if (this.node) {
      this.node.component = null;
      this.node = null;
    }
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
    if (args[0] === setInterval) {
      if (args[1] === 'number') {
        dc.updateWhen(setInterval, args[1], [this], args[2]);
      } else {
        dc.updateWhen(setInterval, [this], args[1]);
      }
    } else if (args[1] === dc.raf) {
      dc.updateWhen(dc.raf, [this], args[1]);
    } else {
      dc.updateWhen(args[0], args[1], [this]);
    }
    return this;
  };

  Component.prototype.raiseNode = function(child) {
    var e, holder, node;
    node = child.node;
    if (this.children) {
      try {
        return this.childNodes[this.dcidIndexMap[child.dcid]] = node;
      } catch (_error) {
        e = _error;
        throw e;
      }
    } else {
      this.node = node;
      if (holder = this.holder) {
        return holder.raiseNode(this);
      }
    }
  };

  Component.prototype.raiseFirstNextNode = function(child) {
    var children, firstNode, index, node;
    children = this.children;
    firstNode = child.firstNode;
    if (children) {
      index = this.dcidIndexMap[child.dcid];
      while (index) {
        index--;
        node = firstNode || child.nextNode;
        this.nextNodes[index] = children[index].nextNode = node;
        child = children[index];
        firstNode = child.firstNode;
      }
      if (!index && this.isList) {
        if (this.firstNode !== firstNode) {
          this.firstNode = firstNode;
          return this.holder.raiseFirstNextNode(this);
        }
      }
    } else {
      if (this.firstNode !== firstNode) {
        this.firstNode = firstNode;
        return this.holder.raiseFirstNextNode(this);
      }
    }
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
