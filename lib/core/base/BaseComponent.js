var BaseComponent, Component, cloneObject,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

cloneObject = require('dc-util').cloneObject;

module.exports = BaseComponent = (function(_super) {
  __extends(BaseComponent, _super);

  function BaseComponent() {
    BaseComponent.__super__.constructor.call(this);
    this.isBaseComponent = true;
    this.removing = false;
    this.baseComponent = this;
  }

  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.markRemovingDom(true);
    }
    if (!this.node) {
      this.valid = true;
      this.createDom();
    } else {
      this.removing = false;
      if (!this.valid) {
        this.valid = true;
        this.updateDom();
      }
    }
    this.attachNode(this.parentNode, this.nextNode);
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.removeDom();
    }
    return this;
  };

  BaseComponent.prototype.invalidate = function() {
    if (!this.valid) {
      return;
    }
    this.valid = false;
    return this.holder && this.holder.invalidateContent(this);
  };

  BaseComponent.prototype.markRemovingDom = function(removing) {
    if (!removing || (this.node && this.node.parentNode)) {
      this.removing = removing;
    }
  };

  BaseComponent.prototype.removeDom = function() {
    if (this.removing && this.attached) {
      this.removing = false;
      this.holder = null;
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
    var attached, e, nextNode, node, parentNode;
    node = this.node, parentNode = this.parentNode, nextNode = this.nextNode;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    this.removing = false;
    if (parentNode === node.parentNode && nextNode === node.nextNode) {
      return node;
    }
    try {
      parentNode.insertBefore(node, nextNode);
    } catch (_error) {
      e = _error;
      dc.error(e);
    }
    node.nextNode = nextNode;
    if (!attached) {
      this.emit('didAttach');
    }
    return node;
  };

  BaseComponent.prototype.setParentNode = function(parentNode) {
    this.parentNode = parentNode;
  };

  BaseComponent.prototype.setNextNode = function(nextNode) {
    this.nextNode = nextNode;
  };

  BaseComponent.prototype.getNode = function() {
    return this.node;
  };

  return BaseComponent;

})(Component);
