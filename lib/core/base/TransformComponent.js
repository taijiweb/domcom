var Component, TransformComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

module.exports = TransformComponent = (function(_super) {
  __extends(TransformComponent, _super);

  function TransformComponent() {
    TransformComponent.__super__.constructor.call(this);
    this.valid = false;
    this.transformValid = false;
    this.isTransformComponent = true;
  }

  TransformComponent.prototype.invalidate = function() {
    if (!this.valid) {
      return;
    }
    this.valid = false;
    return this.holder && this.holder.invalidateContent(this);
  };

  TransformComponent.prototype.invalidateContent = function(content) {
    return this.invalidate();
  };

  TransformComponent.prototype.invalidateTransform = function() {
    this.transformValid = false;
    return this.invalidate();
  };

  TransformComponent.prototype.getBaseComponent = function() {
    var content, oldContent;
    if (!this.node) {
      this.emit('beforeAttach');
    }
    if (this.transformValid) {
      content = this.content;
    } else {
      this.transformValid = true;
      this.valid = true;
      oldContent = this.content;
      content = this.getContentComponent();
      if (content !== oldContent) {
        this.emit('contentChanged', oldContent, content);
        if (oldContent && oldContent.holder === this) {
          oldContent.holder = null;
        }
        this.content = content;
      }
    }
    content.holder = this;
    return this.baseComponent = content.getBaseComponent();
  };

  TransformComponent.prototype.renderDom = function() {
    var baseComponent, node, oldBaseComponent, parentNode;
    parentNode = this.parentNode, node = this.node;
    if (this.valid) {
      if (parentNode && !node.parentNode) {
        baseComponent = this.baseComponent;
        baseComponent.markRemovingDom(false);
        baseComponent.parentNode = parentNode;
        baseComponent.nextNode = this.nextNode;
        baseComponent.attachNode();
      }
      return this;
    }
    this.valid = true;
    oldBaseComponent = this.baseComponent;
    baseComponent = this.getBaseComponent();
    if (baseComponent !== oldBaseComponent) {
      if (oldBaseComponent) {
        oldBaseComponent.markRemovingDom(true);
      }
      baseComponent.setParentNode(parentNode);
      baseComponent.setNextNode(this.nextNode);
      baseComponent.renderDom();
      if (this.node !== baseComponent.node) {
        this.setNode(baseComponent.node);
      }
      if (this.firstNode !== baseComponent.firstNode) {
        this.setFirstNode(baseComponent.firstNode);
      }
      if (oldBaseComponent) {
        oldBaseComponent.removeDom();
      }
    } else {
      baseComponent.renderDom();
    }
    return this;
  };

  TransformComponent.prototype.setParentNode = function(parentNode) {
    if (this.parentNode !== parentNode) {
      this.parentNode = parentNode;
      this.content && this.content.setParentNode(parentNode);
    }
  };

  TransformComponent.prototype.setNextNode = function(nextNode) {
    this.nextNode = nextNode;
    this.content && this.content.setNextNode(nextNode);
  };

  TransformComponent.prototype.markRemovingDom = function(removing) {
    return this.baseComponent && this.baseComponent.markRemovingDom(removing);
  };

  TransformComponent.prototype.removeDom = function() {
    this.baseComponent.removeDom();
    return this;
  };

  return TransformComponent;

})(Component);
