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
    this.baseComponent = this;
  }

  BaseComponent.prototype.getBaseComponent = function() {
    return this;
  };

  BaseComponent.prototype.renderDom = function() {
    if (!this.parentNode) {
      this.valid = true;
      return this.removeDom();
    }
    if (!this.node) {
      this.valid = true;
      this.emit('beforeAttach');
      this.createDom();
    } else if (!this.valid) {
      this.valid = true;
      this.updateDom();
    }
    this.attachNode(this.parentNode, this.nextNode);
    return this;
  };

  BaseComponent.prototype.invalidate = function() {
    if (!this.valid) {
      return;
    }
    this.valid = false;
    return this.holder && this.holder.invalidateContent(this);
  };

  BaseComponent.prototype.removeReplacedDom = function(parentNode) {
    if (this.parentNode !== parentNode) {

    } else {
      this.parentNode = null;
      this.removeNode();
    }
  };

  BaseComponent.prototype.removeDom = function() {
    if (this.parentNode || !this.node || !this.node.parentNode) {
      return this;
    } else {
      this.emit('removeDom');
      this.removeNode();
      return this;
    }
  };

  BaseComponent.prototype.removeNode = function() {
    var node;
    node = this.node;
    return node.parentNode.removeChild(node);
  };

  BaseComponent.prototype.attachNode = function() {
    var nextNode, node, parentNode;
    node = this.node, parentNode = this.parentNode, nextNode = this.nextNode;
    if (parentNode === node.parentNode && nextNode === node.nextNode) {
      return node;
    }
    parentNode.insertBefore(node, nextNode);
    node.nextNode = nextNode;
    return node;
  };

  return BaseComponent;

})(Component);
