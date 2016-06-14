var Component, TransformComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./Component');

module.exports = TransformComponent = (function(_super) {
  __extends(TransformComponent, _super);

  TransformComponent.prototype.isTransformComponent = true;

  function TransformComponent() {
    TransformComponent.__super__.constructor.apply(this, arguments);
    this.transformValid = false;
  }

  TransformComponent.prototype.invalidate = function() {
    if (this.valid) {
      this.valid = false;
      this.holder && this.holder.invalidateContent(this);
    }
    return this;
  };

  TransformComponent.prototype.invalidateContent = function(content) {
    return this.invalidate();
  };

  TransformComponent.prototype.invalidateAttach = function(content) {
    if (this.attachValid) {
      this.attachValid = false;
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    }
    return this;
  };

  TransformComponent.prototype.invalidateTransform = function() {
    this.transformValid = false;
    return this.invalidate();
  };

  TransformComponent.prototype.invalidateAttachOnRemove = function(child, nextNode) {
    if (this.holder) {
      return this.holder.invalidateAttachOnRemove(this, nextNode);
    }
  };

  TransformComponent.prototype.refreshDom = function(oldBaseComponent) {
    this.renderDom(oldBaseComponent);
    this.attachParent();
    return this.removeChildrenDom();
  };

  TransformComponent.prototype.renderDom = function(oldBaseComponent) {
    var baseComponent, content;
    this.emit('willRenderDom');
    this.valid = true;
    this.attachValid = true;
    if (!this.transformValid) {
      this.transformValid = true;
      content = this.content;
      if (content && content.holder === this) {
        this.content.holder = null;
      }
      this.content = this.getContentComponent();
    }
    content = this.content;
    content.holder = this;
    content.parentNode = this.parentNode;
    content.nextNode = this.nextNode;
    content.renderDom(oldBaseComponent);
    baseComponent = content.baseComponent;
    this.baseComponent = baseComponent;
    this.node = baseComponent.node;
    this.firstNode = baseComponent.firstNode;
    if (!this.node.parentNode) {
      content.attachValid = false;
      this.invalidateAttach(content);
    }
    this.emit('didRenderDom');
    return this;
  };

  TransformComponent.prototype.markRemovingDom = function(holder) {
    if (this.baseComponent) {
      holder.markRemovingChild(this.baseComponent);
    }
    return this;
  };

  TransformComponent.prototype.markRemoving = function() {
    this.baseComponent.markRemoving();
  };

  TransformComponent.prototype.removeDom = function() {
    return this.baseComponent.removeDom();
  };

  TransformComponent.prototype.attachParent = function() {
    var content;
    if (!this.attachValid) {
      this.attachValid = true;
      content = this.content;
      content.parentNode = this.parentNode;
      content.nextNode = this.nextNode;
      content.attachParent();
    }
  };

  TransformComponent.prototype.propagateChildNextNode = function(child, nextNode) {
    if (this.holder) {
      this.holder.propagateChildNextNode(child, nextNode);
    }
  };

  return TransformComponent;

})(Component);
