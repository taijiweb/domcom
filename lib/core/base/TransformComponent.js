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
    if (this.transformValid) {
      this.transformValid = false;
      this.invalidate();
    }
    return this;
  };

  TransformComponent.prototype.refreshDom = function(oldBaseComponent) {
    this.renderDom(oldBaseComponent);
    return this.attachParent();
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
      this.content.clearRemoving();
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

  TransformComponent.prototype.markRemovingDom = function() {
    this.removing = true;
    this.holder = null;
    dc.removingChildren[this.dcid] = this;
    if (this.content) {
      this.content.markRemoving();
    }
    return this;
  };

  TransformComponent.prototype.markRemoving = function() {
    this.removing = true;
    if (this.content) {
      this.content.markRemoving();
    }
  };

  TransformComponent.prototype.clearRemoving = function() {
    this.removing = this.removed = false;
    if (this.content) {
      this.content.clearRemoving();
    }
  };

  TransformComponent.prototype.removeDom = function() {
    if (this.removing) {
      this.removing = false;
      this.removed = true;
      if (this.content) {
        this.content.removeDom();
      }
    }
    return this;
  };

  TransformComponent.prototype.removeNode = function() {
    this.removing = false;
    this.removed = true;
    if (this.content) {
      this.content.removeNode();
    }
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
      this.holder.propagateChildNextNode(this, nextNode);
    }
  };

  TransformComponent.prototype.linkNextNode = function(child, oldNode, nextNode) {
    if (this.holder) {
      this.holder.linkNextNode(this, oldNode, nextNode);
    }
  };

  TransformComponent.prototype.resetAttach = function() {
    this.attachValid = false;
    return this.content.resetAttach();
  };

  return TransformComponent;

})(Component);
