var Component, TransformComponent;

Component = require('./Component');

module.exports = TransformComponent = (function() {
  class TransformComponent extends Component {
    constructor() {
      super();
      this.transformValid = false;
    }

    invalidate() {
      if (this.valid) {
        this.valid = false;
        this.holder && this.holder.invalidateContent(this);
      }
      return this;
    }

    invalidateContent(content) {
      return this.invalidate();
    }

    invalidateAttach(content) {
      if (this.attachValid) {
        this.attachValid = false;
        if (this.holder) {
          this.holder.invalidateAttach(this);
        }
      }
      return this;
    }

    invalidateTransform() {
      if (this.transformValid) {
        this.transformValid = false;
        this.invalidate();
      }
      return this;
    }

    refreshDom(oldBaseComponent) {
      this.renderDom(oldBaseComponent);
      return this.attachParent();
    }

    renderDom(oldBaseComponent) {
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
    }

    markRemovingDom() {
      this.removing = true;
      this.holder = null;
      dc.removingChildren[this.dcid] = this;
      if (this.content) {
        this.content.markRemoving();
      }
      return this;
    }

    markRemoving() {
      this.removing = true;
      if (this.content) {
        this.content.markRemoving();
      }
    }

    clearRemoving() {
      this.removing = this.removed = false;
      if (this.content) {
        this.content.clearRemoving();
      }
    }

    removeDom() {
      if (this.removing) {
        this.removing = false;
        this.removed = true;
        if (this.content) {
          this.content.removeDom();
        }
      }
      return this;
    }

    removeNode() {
      this.removing = false;
      this.removed = true;
      if (this.content) {
        this.content.removeNode();
      }
    }

    attachParent() {
      var content;
      if (!this.attachValid) {
        this.attachValid = true;
        content = this.content;
        content.parentNode = this.parentNode;
        content.nextNode = this.nextNode;
        content.attachParent();
      }
    }

    propagateChildNextNode(child, nextNode) {
      if (this.holder) {
        this.holder.propagateChildNextNode(this, nextNode);
      }
    }

    linkNextNode(child, oldNode, nextNode) {
      if (this.holder) {
        this.holder.linkNextNode(this, oldNode, nextNode);
      }
    }

    resetAttach() {
      this.attachValid = false;
      return this.content.resetAttach();
    }

  };

  TransformComponent.prototype.isTransformComponent = true;

  return TransformComponent;

}).call(this);
