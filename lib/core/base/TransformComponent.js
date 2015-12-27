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
    if (!parentNode) {
      this.holder = null;
      return this.removeDom();
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
    oldBaseComponent = this.baseComponent;
    baseComponent = this.getBaseComponent();
    if (baseComponent !== oldBaseComponent) {
      if (oldBaseComponent) {
        oldBaseComponent.markRemovingDom(parentNode);
      }
      this.setParentAndNextNode();
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

  TransformComponent.prototype.setParentAndNextNode = function() {
    var child, children, content, i, len, nextNode, parentNode;
    content = this.content, parentNode = this.parentNode, nextNode = this.nextNode;
    while (content) {
      content.parentNode = parentNode;
      content.nextNode = nextNode;
      if (content.isBaseComponent) {
        if (content.isList) {
          children = content.children;
          i = 0;
          len = children.length;
          if (len) {
            while (i < len - 1) {
              child = children[i];
              child.parentNode = parentNode;
              child.setParentAndNextNode();
              i++;
            }
            child = children[i];
            child.parentNode = parentNode;
            child.nextNode = nextNode;
            child.setParentAndNextNode();
          }
        }
        break;
      } else {
        content = content.content;
      }
    }
  };

  TransformComponent.prototype.markRemovingDom = function(parentNode) {
    var content;
    if (this.parentNode !== parentNode) {

    } else {
      this.removing = false;
      this.parentNode = null;
      while (content = this.content) {
        content.markRemovingDom(parentNode);
        if (content.isBaseComponent) {
          break;
        }
      }
    }
  };

  TransformComponent.prototype.removeDom = function() {
    if (this.parentNode || !this.node || !this.node.parentNode) {
      return this;
    } else {
      this.emit('removeDom');
      this.baseComponent.removeDom();
      return this;
    }
  };

  return TransformComponent;

})(Component);
