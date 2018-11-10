var BaseComponent, BaseComponentAttachParent, BaseComponentRemoveNode, BaseComponentRenderBaseComponent, ListMixin, Nothing, NullableTagMixin, Tag, TransformComponentMixin, exports;

TransformComponentMixin = dc.TransformComponentMixin, Tag = dc.Tag, Nothing = dc.Nothing, BaseComponent = dc.BaseComponent, ListMixin = dc.ListMixin;

BaseComponentAttachParent = BaseComponent.prototype.attachParent;

BaseComponentRemoveNode = BaseComponent.prototype.removeNode;

BaseComponentRenderBaseComponent = BaseComponent.prototype.renderBaseComponent;

module.exports = exports = NullableTagMixin = {
  initNullableTag: function() {
    this.hidden = false;
    this.tagNode = null;
    return this.nothingNode = [];
  },
  renderBaseComponent: function(oldBaseComponent) {
    var nextNode, nodeChanged;
    if (!this.isHidden()) {
      nodeChanged = !this.tagNode || this.node !== this.tagNode;
      this.node = this.tagNode;
      BaseComponentRenderBaseComponent.call(this, oldBaseComponent);
      this.tagNode = nextNode = this.node;
      if (nodeChanged) {
        this.holder.propagateChildNextNode(this, nextNode);
        this.holder.invalidateAttach(this);
      }
    } else {
      this.valid = true;
      if (this.tagNode && this.node === this.tagNode) {
        this.removing = true;
        this.removeDom();
        this.removed = false;
        this.node = this.nothingNode;
        this.firstNode = null;
        this.holder.propagateChildNextNode(this, this.nextNode);
      }
    }
  },
  attachParent: function() {
    if (!this.isHidden()) {
      return BaseComponentAttachParent.call(this);
    }
  },
  removeNode: function() {
    if (this.node === this.tagNode) {
      return BaseComponentRemoveNode.call(this);
    }
  },
  isHidden: function() {
    return this.hidden;
  }
};
