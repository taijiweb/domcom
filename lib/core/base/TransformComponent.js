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

  TransformComponent.prototype.renderDom = function() {
    var content, oldContent;
    if (!this.parentNode) {
      if (this.node && this.node.parentNode) {
        return this.removeDom();
      } else {
        return this;
      }
    }
    if (this.valid) {
      return this;
    }
    this.valid = true;
    if (!this.parentNode && this.node.parentNode) {
      this.removeDom();
    }
    !this.node && this.emit('beforeAttach');
    oldContent = this.content;
    if (!this.transformValid) {
      this.transformValid = true;
      content = this.getContentComponent();
      if (oldContent && content !== oldContent) {
        this.emit('contentChanged', oldContent, content);
        oldContent.parentNode = null;
        if (oldContent.node && oldContent.node.parentNode) {
          oldContent.removeDom();
        }
      }
      this.content = content;
    } else {
      content = oldContent;
    }
    content.holder = this;
    content.parentNode = this.parentNode;
    content.nextNode = this.nextNode;
    content.renderDom();
    this.node = content.node;
    this.firstNode = content.firstNode;
    this.baseComponent = content.baseComponent;
    return this;
  };

  TransformComponent.prototype.removeDom = function() {
    var content;
    content = this.content;
    if (content.holder === this) {
      content.parentNode = null;
      content.removeDom();
    }
    this.emit('afterRemoveDom');
    return this;
  };

  return TransformComponent;

})(Component);
