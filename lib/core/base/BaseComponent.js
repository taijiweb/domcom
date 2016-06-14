var BaseComponent, Component,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./Component');

module.exports = BaseComponent = (function(_super) {
  __extends(BaseComponent, _super);

  function BaseComponent() {
    BaseComponent.__super__.constructor.call(this);
    this.isBaseComponent = true;
    this.removing = false;
    this.removingChildren = {};
    this.baseComponent = this;
  }

  BaseComponent.prototype.refreshDom = function(oldBaseComponent) {
    this.renderDom();
    this.attachParent();
    this.removeChildrenDom();
    return this;
  };

  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
    this.emit('willRenderDom');
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.markRemovingDom(this);
    }
    this.renderBaseComponent(oldBaseComponent);
    this.emit('didRenderDom');
    return this;
  };

  BaseComponent.prototype.renderBaseComponent = function(oldBaseComponent) {
    if (oldBaseComponent && oldBaseComponent !== this) {
      this.attachValid = false;
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    }
    if (!this.node) {
      this.valid = true;
      this.createDom();
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    } else {
      if (!this.valid || this.isTag) {
        this.valid = true;
        this.updateDom();
      }
    }
  };

  BaseComponent.prototype.invalidate = function() {
    if (this.valid) {
      this.valid = false;
      return this.holder && this.holder.invalidateContent(this);
    } else {
      return this;
    }
  };

  BaseComponent.prototype.attachChildren = function() {};

  BaseComponent.prototype.markRemovingDom = function(holder) {
    if (this.parentNode && this.firstNode && this.firstNode.parentNode === this.parentNode) {
      this.removing = true;
      holder.memoRemoving(this);
    }
    return this;
  };

  BaseComponent.prototype.markRemoving = function() {
    if (this.parentNode && this.node) {
      this.removing = true;
    }
  };

  BaseComponent.prototype.removeDom = function() {
    var child, _i, _len, _ref;
    if (this.removing) {
      this.removing = false;
      this.emit('willDetach');
      if (this.isList) {
        this.node.parentNode = null;
        this.childParentNode = null;
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.removeDom();
        }
      } else {
        this.removeNode();
      }
      this.emit('didDetach');
    }
    return this;
  };

  BaseComponent.prototype.removeNode = function() {
    var node;
    this.removing = false;
    if (node = this.node) {
      node.parentNode && node.parentNode.removeChild(node);
    }
  };

  BaseComponent.prototype.executeAttachParent = function() {
    var nextNode, node, parentNode;
    node = this.node;
    parentNode = this.parentNode;
    nextNode = this.nextNode;
    this.removing = false;
    if (parentNode && (parentNode !== node.parentNode || nextNode !== node.nextSibling)) {
      parentNode.insertBefore(node, nextNode);
    }
  };

  BaseComponent.prototype.attachParent = function() {
    if (this.node.parentNode) {
      this.emit('willAttach');
      this.executeAttachParent();
      this.emit('didAttach');
    } else {
      this.executeAttachParent();
    }
    return this.node;
  };

  return BaseComponent;

})(Component);
