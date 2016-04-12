var Component, dc, dcEventMixin, extend, flow, isArray, isComponent, newDcid, normalizeDomElement, _ref;

extend = require('extend');

normalizeDomElement = require('../../dom-util').normalizeDomElement;

_ref = require('dc-util'), newDcid = _ref.newDcid, isArray = _ref.isArray;

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

  Component.prototype.create = function(mountNode, beforeNode, cancelUpdate) {
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
      this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body;
      this.nextNode = beforeNode || this.nextNode;
      this.holder = dc;
      dc.rootComponentMap[this.dcid] = this;
    }
    if (!cancelUpdate) {
      this.render();
    }
    return this;
  };

  Component.prototype.mount = function(mountNode, beforeNode) {
    this.emit('willMount');
    this.create(mountNode, beforeNode);
    return this.emit('didMount');
  };

  Component.prototype.render = function(force) {
    if (!this.destroyed && (force || dc.alwaysRender || !dc.renderBySystemLoop)) {
      this.emit('willRender');
      if (this.removing) {
        this.removeDom();
      } else {
        this.renderDom(this.baseComponent);
      }
      this.emit('didRender');
    }
    return this;
  };

  Component.prototype.unmount = function() {
    this.emit('willUnmount');
    this.remove();
    this.emit('didUnmount');
    return this;
  };

  Component.prototype.remove = function(cancelUpdate) {
    var component, holder;
    holder = this.holder;
    component = this;
    while (holder && holder !== dc && !holder.isBaseComponent) {
      component = holder;
      holder = holder.holder;
    }
    if (holder === dc) {
      component.markRemovingDom(true);
      dc.rootComponentMap[component.dcid] = component;
      if (!cancelUpdate) {
        component.render();
      }
    } else if (!holder) {
      this;
    } else if (holder.children) {
      holder.removeChild(component);
      if (!cancelUpdate) {
        component.render();
      }
    } else {
      dc.error('Should not remove the content of TransformComponent');
    }
    return this;
  };

  Component.prototype.replace = function(oldComponent, cancelUpdate) {
    var holder;
    if (this.destroyed || this === oldComponent) {
      return;
    }
    holder = oldComponent.holder;
    if (holder && holder !== dc) {
      if (holder.isTransformComponent) {
        dc.error('Should not replace the content of TransformComponent');
      } else {
        holder.replaceChild(oldComponent, this);
        if (!cancelUpdate) {
          this.render();
          oldComponent.render();
        }
      }
    } else if (holder === dc) {
      this.parentNode = oldComponent.parentNode;
      this.nextNode = oldComponent.nextNode;
      oldComponent.markRemovingDom(true);
      this.holder = holder;
      this.invalidate();
      dc.rootComponentMap[this.dcid] = this;
      dc.rootComponentMap[oldComponent.dcid] = oldComponent;
      if (!cancelUpdate) {
        this.render();
        oldComponent.render();
      }
    }
    return this;
  };


  /*
  component.renderWhen components, events
  component.renderWhen setInterval, interval, options
  component.renderWhen setTimeout, interval, options
   */

  Component.prototype.renderWhen = function(component, events, options) {
    if (isArray(component) || isComponent(component)) {
      options = [this];
    } else {
      options = options || {};
      options.components = [this];
    }
    dc.renderWhen(component, events, options);
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

  Component.prototype.getPrevSibling = function() {
    var dcidIndexMap, holder;
    if (!(holder = this.holder)) {
      return null;
    } else if (dcidIndexMap = holder.dcidIndexMap) {
      return holder.children[dcidIndexMap[this.dcid] - 1];
    }
  };

  Component.prototype.getNextSibling = function() {
    var dcidIndexMap, holder;
    if (!(holder = this.holder)) {
      return null;
    } else if (dcidIndexMap = holder.dcidIndexMap) {
      return holder.children[dcidIndexMap[this.dcid] + 1];
    }
  };

  Component.prototype.setReactive = function() {
    var invalidateThis, me, reactField, reactive, srcField, _ref1;
    if (this.reactMap) {
      me = this;
      invalidateThis = function() {
        return me.invalidate();
      };
      _ref1 = this.reactMap;
      for (srcField in _ref1) {
        reactField = _ref1[srcField];
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
