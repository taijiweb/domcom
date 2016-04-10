module.exports = {
  initTransformComponent: function() {
    this.transformValid = false;
    return this.isTransformComponent = true;
  },
  invalidate: function() {
    return this.invalidateOffspring(this);
  },
  invalidateOffspring: function(offspring) {
    if (this.valid) {
      this.valid = false;
      if (this.holder) {
        this.holder.invalidateOffspring(this);
      }
    }
    return this;
  },
  invalidateTransform: function() {
    this.transformValid = false;
    return this.invalidate();
  },
  markRemovingDom: function(removing) {
    if (this.baseComponent) {
      this.baseComponent.markRemovingDom(removing);
    }
    this.holder = null;
    return this;
  },
  updateBaseComponent: function() {
    var content;
    if (!this.transformValid) {
      this.transformValid = true;
      this.content = content = this.getContentComponent();
      if (content !== this) {
        content.holder = this;
        content.parentNode = this.parentNode;
        content.nextNode = this.nextNode;
        this.baseComponent = content.updateBaseComponent();
      }
    }
    return this.baseComponent;
  },
  renderDom: function(oldBaseComponent) {
    this.emit('willRender');
    if (this.node && this.valid && oldBaseComponent === this.baseComponent) {
      this.baseComponent.attachNode();
    } else {
      this.valid = true;
      this.updateBaseComponent();
      this.renderContent(oldBaseComponent);
    }
    this.emit('didRender');
    return this;
  },
  renderContent: function(oldBaseComponent) {
    return this.baseComponent.renderDom(oldBaseComponent);
  },
  getChildParentNode: function(child) {
    return this.parentNode;
  },
  setParentNode: function(parentNode) {
    if (this.parentNode !== parentNode) {
      this.parentNode = parentNode;
      this.content && this.content.setParentNode(parentNode);
    }
  },
  linkNextNode: function(child) {
    var holder;
    this.nextNode = child.nextNode;
    if (holder = this.holder) {
      return holder.linkNextNode(this);
    }
  },
  sinkNextNode: function(nextNode) {
    if (nextNode !== this.nextNode) {
      this.nextNode = nextNode;
      return this.content.sinkNextNode(nextNode);
    }
  }
};
