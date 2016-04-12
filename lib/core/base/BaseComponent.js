var BaseComponent, Component, cloneObject,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./Component');

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
    this.emit('willRenderDom');
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
    this.emit('didRenderDom');
    return this;
  };

  BaseComponent.prototype.invalidate = function() {
    if (this.valid) {
      this.valid = false;
      return this.holder && this.holder.invalidateContent(this);
    } else {
      return this;
    }
  };

  BaseComponent.prototype.markRemovingDom = function(removing) {
    this.removing = removing;
    if (removing) {
      if (this.node && this.node.parentNode) {
        dc.valid = false;
      }
    }
    return this;
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
    node.parentNode.removeChild(node);
  };

  BaseComponent.prototype.executeAttachNode = function() {
    var e, nextNode, node, parentNode;
    node = this.node;
    parentNode = this.parentNode;
    nextNode = this.nextNode;
    this.removing = false;
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
    var attached;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    this.executeAttachNode();
    if (!attached) {
      this.emit('didAttach');
    }
    return this.node;
  };

  BaseComponent.prototype.renderContent = function(oldBaseComponent) {
    return this.renderDom(oldBaseComponent);
  };

  return BaseComponent;

})(Component);
