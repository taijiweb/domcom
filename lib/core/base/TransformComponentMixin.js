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
    var baseComponent;
    this.rendering = true;
    this.emit('willRender');
    if (this.node && this.valid && oldBaseComponent === this.baseComponent) {
      this.baseComponent.attachNode(this.parentNode, this.nextNode);
    } else {
      this.valid = true;
      baseComponent = this.updateBaseComponent();
      baseComponent.renderContent(oldBaseComponent);
    }
    this.rendering = false;
    this.emit('didRender');
    return this;
  },
  getChildParentNode: function(child) {
    return this.parentNode;
  },
  setParentNode: function(parentNode) {
    if (this.parentNode !== parentNode) {
      this.parentNode = parentNode;
      this.content && this.content.setParentNode(parentNode);
    }
  }
};
