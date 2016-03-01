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

  TransformComponent.prototype.renderDom = function(oldBaseComponent) {
    var attached, baseComponent, content, needRemoveOld, oldContent;
    if (!(attached = this.attached)) {
      this.emit('willAttach');
    }
    if (this.valid) {
      if (oldBaseComponent === this.baseComponent) {
        if (attached) {
          return this;
        } else {
          this.attached = true;
          this.baseComponent.attachNode(this.parentNode, this.nextNode);
        }
      } else {
        this.attached = true;
        baseComponent = this.baseComponent;
        baseComponent.renderDom(oldBaseComponent);
        this.node = baseComponent.node;
        this.firstNode = baseComponent.firstNode;
      }
    } else {
      this.valid = true;
      this.attached = true;
      if (!this.transformValid) {
        this.transformValid = true;
        oldContent = this.content;
        this.content = content = this.getContentComponent();
        if (oldContent && oldContent !== content && oldContent.holder === this && oldContent !== oldBaseComponent) {
          needRemoveOld = true;
          oldContent.markRemovingDom(true);
        }
        content.holder = this;
      } else {
        content = this.content;
      }
      content.parentNode = this.parentNode;
      content.nextNode = this.nextNode;
      content.renderDom(oldBaseComponent);
      if (needRemoveOld) {
        oldContent.removeDom();
      }
      this.baseComponent = baseComponent = content.baseComponent;
      this.node = baseComponent.node;
      this.firstNode = baseComponent.firstNode;
    }
    if (!attached) {
      this.emit('didAttach');
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

  TransformComponent.prototype.getNode = function() {
    return this.content && this.content.getNode();
  };

  TransformComponent.prototype.markRemovingDom = function(removing) {
    this.holder = null;
    return this.baseComponent && this.baseComponent.markRemovingDom(removing);
  };

  TransformComponent.prototype.removeDom = function() {
    if (!this.attached) {
      return;
    }
    this.emit('willDetach');
    this.baseComponent.removeDom();
    this.emit('didDetach');
    this.attached = false;
    return this;
  };

  return TransformComponent;

})(Component);
