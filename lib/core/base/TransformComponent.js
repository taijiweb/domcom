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
    if (this.transformValid) {
      content = this.content;
    } else {
      this.transformValid = true;
      this.valid = true;
      oldContent = this.content;
      content = this.getContentComponent();
      if (content !== oldContent) {
        this.emit('contentChanged', oldContent, content);
        this.content = content;
      }
    }
    content.holder = this;
    return this.baseComponent = content.getBaseComponent();
  };

  TransformComponent.prototype.renderDom = function() {
    var baseComponent, node, oldBaseComponent, parentNode;
    parentNode = this.parentNode, node = this.node;
    if (!parentNode) {
      this.holder = null;
      if (node && node.parentNode) {
        return this.removeDom();
      } else {
        return this;
      }
    }
    if (this.valid) {
      if (parentNode && !node.parentNode) {
        baseComponent = this.baseComponent;
        baseComponent.parentNode = parentNode;
        baseComponent.nextNode = this.nextNode;
        baseComponent.attachNode();
      }
      return this;
    } else {
      this.valid = true;
    }
    !this.node && this.emit('beforeAttach');
    oldBaseComponent = this.baseComponent;
    baseComponent = this.getBaseComponent();
    if (baseComponent !== oldBaseComponent) {
      if (oldBaseComponent) {
        oldBaseComponent.parentNode = null;
        if (oldBaseComponent.node && oldBaseComponent.node.parentNode) {
          oldBaseComponent.removeDom();
        }
      }
      this.setParentAndNextNode(baseComponent);
      baseComponent.renderDom();
      if (this.node !== baseComponent.node) {
        this.setNode(baseComponent.node);
      }
      if (this.firstNode !== baseComponent.firstNode) {
        this.setFirstNode(baseComponent.firstNode);
      }
    } else {
      this.setParentAndNextNode(baseComponent);
      baseComponent.renderDom();
    }
    return this;
  };

  TransformComponent.prototype.setParentAndNextNode = function(baseComponent) {
    var content, nextNode, parentNode;
    content = this.content, parentNode = this.parentNode, nextNode = this.nextNode;
    while (true) {
      content.parentNode = parentNode;
      content.nextNode = nextNode;
      if (content === baseComponent) {
        break;
      } else {
        content = content.content;
      }
    }
  };

  TransformComponent.prototype.removeDom = function() {
    var content;
    content = this.content;
    content.holder = null;
    content.parentNode = null;
    content.removeDom();
    this.emit('afterRemoveDom');
    return this;
  };

  return TransformComponent;

})(Component);
