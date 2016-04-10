var BaseComponent, Component, cloneObject, refreshComponents,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./Component');

cloneObject = require('dc-util').cloneObject;

refreshComponents = require('../../dc').refreshComponents;

module.exports = BaseComponent = (function(_super) {
  __extends(BaseComponent, _super);

  function BaseComponent() {
    BaseComponent.__super__.constructor.call(this);
    this.isBaseComponent = true;
    this.removing = false;
    this.baseComponent = this;
  }

  BaseComponent.prototype.invalidate = function() {
    if (this.valid) {
      this.valid = false;
      return this.holder && this.holder.invalidateOffspring(this);
    } else {
      return this;
    }
  };

  BaseComponent.prototype.invalidateOffspring = function(offspring) {
    var holder;
    if (this !== offspring && !this.node) {
      return this;
    } else if (!(holder = this.holder)) {
      this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
      return this;
    } else {
      if (holder === dc) {
        dc.invalidateOffspring(offspring);
      } else {
        if (!holder.isBaseComponent) {
          this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
          offspring.renderingHolder = this;
          holder.invalidate();
        } else {
          holder.invalidateOffspring(offspring);
        }
      }
      return this;
    }
  };

  BaseComponent.prototype.markRemovingDom = function(removing) {
    var renderingHolder;
    this.removing = removing;
    if (removing) {
      if (this.node && this.node.parentNode) {
        dc.valid = false;
        dc.removingMap[this.dcid] = this;
      }
      if (this.renderingHolder) {
        renderingHolder = this.renderingHolder;
        this.renerHolder = null;
        delete renderingHolder.renderingMap[this.dcid];
        delete renderingHolder.oldRenderingMap[this.dcid];
      }
      this.holder = null;
    }
    return this;
  };

  BaseComponent.prototype.updateBaseComponent = function() {
    return this;
  };

  BaseComponent.prototype.renderContent = function(oldBaseComponent) {
    var holder;
    this.renderDom(oldBaseComponent);
    if (holder = this.holder) {
      holder.raiseNode(this);
      return holder.raiseFirstNextNode(this);
    }
  };

  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
    this.emit('willRender');
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.markRemovingDom(true);
    }
    if (!this.node) {
      this.valid = true;
      this.renderingMap = {};
      this.createDom();
    } else {
      this.refreshDom();
    }
    this.attachNode(this.parentNode, this.nextNode);
    this.emit('didRender');
    return this;
  };

  BaseComponent.prototype.removeDom = function() {
    if (this.removing && this.attached) {
      this.removing = false;
      this.emit('willDetach');
      this.removeNode();
      this.emit('didDetach');
      this.attached = false;
    }
    return this;
  };

  BaseComponent.prototype.removeNode = function() {
    var component, holder, nextNode, node, prevNode;
    node = this.node;
    prevNode = node.previousSibling;
    nextNode = node.nextSibling;
    node.parentNode.removeChild(node);
    if (prevNode && (component = prevNode.component)) {
      component.nextNode = nextNode;
      if (holder = component.holder) {
        holder.linkNextNode(component);
      }
    }
  };

  BaseComponent.prototype.executeAttachNode = function() {
    var e, nextNode, node, parentNode;
    this.removing = false;
    node = this.node;
    parentNode = this.parentNode;
    nextNode = this.nextNode;
    if (parentNode && (parentNode !== node.parentNode || nextNode !== node.nextSibling)) {
      node = this.node;
      try {
        return parentNode.insertBefore(node, nextNode);
      } catch (_error) {
        e = _error;
        return dc.error(e);
      }
    }
  };

  BaseComponent.prototype.attachNode = function() {
    var attached, holder;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    this.executeAttachNode();
    if (holder = this.holder) {
      holder.raiseNode(this);
      holder.raiseFirstNextNode(this);
    }
    if (!attached) {
      this.emit('didAttach');
    }
    return this.node;
  };

  BaseComponent.prototype.setParentNode = function(parentNode) {
    this.parentNode = parentNode;
  };

  BaseComponent.prototype.sinkNextNode = function(nextNode) {
    var holder, index, nextNodes;
    if (nextNode !== this.nextNode) {
      this.nextNode = nextNode;
      if ((holder = this.holder) && (nextNodes = holder.nextNodes)) {
        index = holder.dcidIndexMap[this.dcid];
        return nextNodes[index] = nextNode;
      }
    }
  };

  return BaseComponent;

})(Component);
