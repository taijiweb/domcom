var BaseComponent, Component, cloneObject,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

cloneObject = require('../../util').cloneObject;

module.exports = BaseComponent = (function(_super) {
  __extends(BaseComponent, _super);

  function BaseComponent() {
    BaseComponent.__super__.constructor.call(this);
    this.isBaseComponent = true;
    this.baseComponent = this;
  }

  BaseComponent.prototype.renderDom = function() {
    if (!this.parentNode) {
      if (this.node && this.node.parentNode) {
        this.valid = true;
        return this.removeDom();
      } else {
        return this;
      }
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

  BaseComponent.prototype.removeDom = function() {
    this.removeNode();
    this.emit('afterRemoveDom');
    return this;
  };

  BaseComponent.prototype.removeNode = function() {
    return this.node.parentNode && this.node.parentNode.removeChild(this.node);
  };

  BaseComponent.prototype.attachNode = function() {
    var node;
    node = this.node;
    if (this.parentNode === node.parentNode) {
      return node;
    }
    this.parentNode.insertBefore(node, this.nextNode);
    return node;
  };

  return BaseComponent;

})(Component);
