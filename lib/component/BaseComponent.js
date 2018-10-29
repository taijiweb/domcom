var BaseComponent, Component;

Component = require('./Component');

module.exports = BaseComponent = class BaseComponent extends Component {
  constructor() {
    super();
    this.isBaseComponent = true;
    this.removing = false;
    // the line below is moved from ListMixin
    // because the removing component of TransformComponent will be added to TransformComponent.content
    this.baseComponent = this;
  }

  refreshDom(oldBaseComponent) {
    this.renderDom();
    this.attachParent();
    return this;
  }

  renderDom(oldBaseComponent) {
    this.emit('willRenderDom');
    if (oldBaseComponent && oldBaseComponent !== this) {
      oldBaseComponent.markRemovingDom();
    }
    this.renderBaseComponent(oldBaseComponent);
    this.emit('didRenderDom');
    return this;
  }

  renderBaseComponent(oldBaseComponent) {
    if (oldBaseComponent && oldBaseComponent !== this) {
      this.attachValid = false;
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    }
    if (!this.node) {
      this.createDom();
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    } else {
      if (!this.valid) {
        this.updateDom();
      }
    }
  }

  invalidate() {
    if (this.valid) {
      this.valid = false;
      return this.holder && this.holder.invalidateContent(this);
    } else {
      return this;
    }
  }

  resetAttach() {
    return this.attachValid = false;
  }

  attachChildren() {}

  markRemovingDom() {
    this.removing = true;
    this.holder = null;
    dc.removingChildren[this.dcid] = this;
    return this;
  }

  markRemoving() {
    this.removing = true;
  }

  clearRemoving() {
    return this.removing = this.removed = false;
  }

  removeDom() {
    var child, i, len, ref;
    if (this.removing) {
      this.emit('willDetach');
      if (this.isList) {
        this.removing = false;
        this.removed = true;
        this.node.parentNode = null;
        this.childParentNode = null;
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          child.removeDom();
        }
      } else {
        this.removeNode();
      }
      this.emit('didDetach');
    }
    return this;
  }

  removeNode() {
    var node;
    this.removing = false;
    this.removed = true;
    if (node = this.node) {
      node.parentNode && node.parentNode.removeChild(node);
    }
  }

  attachParent() {
    var nextNode, node, parentNode;
    node = this.node;
    parentNode = this.parentNode;
    nextNode = this.nextNode;
    this.removing = false;
    if (parentNode && (parentNode !== node.parentNode || nextNode !== node.nextSibling)) {
      this.emit('willAttach');
      parentNode.insertBefore(node, nextNode);
      this.emit('didAttach');
    }
    return node;
  }

};
