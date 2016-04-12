module.exports = {
  initTransformComponent: function() {
    this.valid = false;
    return this.transformValid = false;
  },
  invalidate: function() {
    if (this.valid) {
      this.valid = false;
      if (this.holder) {
        this.holder.invalidateContent(this);
      }
    }
    return this;
  },
  invalidateContent: function(content) {
    return this.invalidate();
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
  renderDom: function(oldBaseComponent) {
    var attached, baseComponent, content, needRemoveOld, oldContent;
    this.emit('willRenderDom');
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
        if (oldContent && oldContent !== content && oldContent.holder === this) {
          needRemoveOld = true;
          oldContent.markRemovingDom(true);
        }
        if (content !== this) {
          content.holder = this;
        }
      } else {
        content = this.content;
      }
      content.parentNode = this.parentNode;
      content.nextNode = this.nextNode;
      content.renderContent(oldBaseComponent);
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
    this.emit('didRenderDom');
    return this;
  },
  renderContent: function(oldBaseComponent) {
    return this.renderDom(oldBaseComponent);
  },
  removeDom: function() {
    return this.baseComponent.removeDom();
  }
};
