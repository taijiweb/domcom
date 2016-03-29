var Component, dc, dcEventMixin, extend, flow, isComponent, newDcid, normalizeDomElement;

extend = require('extend');

normalizeDomElement = require('../../dom-util').normalizeDomElement;

newDcid = require('dc-util').newDcid;

flow = require('lazy-flow').flow;

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
    this.setReactive();
  }


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

  Component.prototype.updateWhen = function(component, event, options) {
    dc.updateWhen(component, event, options);
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

  Component.prototype.setReactive = function() {
    var invalidateThis, me, reactField, reactive, srcField, _ref;
    if (this.reactMap) {
      me = this;
      invalidateThis = function() {
        return me.invalidate();
      };
      _ref = this.reactMap;
      for (srcField in _ref) {
        reactField = _ref[srcField];
        reactive = flow.bind(this, srcField);
        if (typeof reactField === 'string') {
          reactive.onInvalidate(function() {
            var reaction;
            if (reaction = me[reactField]) {
              return reaction.invalidate();
            }
          });
        } else {
          reactive.onInvalidate(invalidateThis);
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

dcEventMixin = require('../../dc-event');

extend(Component.prototype, dcEventMixin);
