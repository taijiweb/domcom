var BaseComponent, Component, cloneObject, refreshComponents,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

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
      return this.invalidateOffspring(this);
    } else {
      return this;
    }
  };

  BaseComponent.prototype.invalidateOffspring = function(offspring) {
    var holder;
    holder = this.holder;
    if (!holder) {
      this;
    } else {
      if (this.inWillRenderender) {
        this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
      } else if (holder === dc) {
        dc.invalidateOffspring(offspring);
      } else if (!holder.isBaseComponent) {
        this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
        holder.invalidate();
      } else {
        holder.invalidateOffspring(offspring);
      }
    }
    return this;
  };

  BaseComponent.prototype.markRemovingDom = function(removing) {
    this.removing = removing;
    if (removing && this.node) {
      dc.valid = false;
      dc.removingMap[this.dcid] = this;
    }
    return this;
  };

  BaseComponent.prototype.updateBaseComponent = function() {
    return this;
  };

  BaseComponent.prototype.renderContent = function(oldBaseComponent) {
    var holder;
    this.renderDom(oldBaseComponent);
    holder = this.holder;
    holder.raiseNode(this);
    return holder.raiseFirstNextNode(this);
  };

  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
    this.rendering = true;
    this.inWillRenderender = true;
    this.emit('willRender');
    this.inWillRenderender = false;
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
    this.rendering = false;
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
    var node;
    node = this.node;
    return node.parentNode.removeChild(node);
  };

  BaseComponent.prototype.attachNode = function() {
    var attached, e, holder, nextNode, node, parentNode;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    this.removing = false;
    node = this.node;
    parentNode = this.parentNode;
    nextNode = this.nextNode;
    if (parentNode !== node.parentNode || nextNode !== node.nextSibling) {
      node = this.node;
      try {
        parentNode.insertBefore(node, nextNode);
      } catch (_error) {
        e = _error;
        dc.error(e);
      }
      holder = this.holder;
      if (holder.children) {
        holder.node[holder.dcidIndexMap[this.dcid]] = node;
      }
    }
    if (!attached) {
      this.emit('didAttach');
    }
    return node;
  };

  BaseComponent.prototype.setParentNode = function(parentNode) {
    this.parentNode = parentNode;
  };

  BaseComponent.prototype.getPrevChainComponentOf = function(child) {
    throw new Error('Atomic BaseComponent should not has child component.');
  };

  return BaseComponent;

})(Component);
