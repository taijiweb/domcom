var BaseComponent, List, ListMixin, ListMixinAttachChildren, binaryInsert, exports, mixin, newLine, toComponentArray;

BaseComponent = require('./BaseComponent');

({newLine} = require('dc-util'));

toComponentArray = require('./toComponentArray');

({mixin} = require('dc-util'));

ListMixin = require('./ListMixin');

({binaryInsert} = require('dc-util'));

module.exports = exports = List = class List extends BaseComponent {
  constructor(children) {
    super();
    this.children = toComponentArray(children);
    this.initListMixin();
    this.isList = true;
    return;
  }

  refreshDom(oldBaseComponent) {
    this.renderDom();
    this.attachChildren();
    return this;
  }

  createDom() {
    this.valid = true;
    this.node = this.childNodes;
    this.createChildrenDom();
    this.firstNode = this.childrenFirstNode;
    return this.node;
  }

  updateDom() {
    this.valid = true;
    this.updateChildrenDom();
    this.firstNode = this.childrenFirstNode;
    return this.node;
  }

  markRemovingDom() {
    var child, i, len, ref;
    this.removing = true;
    this.holder = null;
    ref = this.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.markRemoving();
    }
    dc.removingChildren[this.dcid] = this;
    return this;
  }

  markRemoving() {
    var child, i, len, ref;
    this.removing = true;
    ref = this.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.markRemoving();
    }
  }

  clearRemoving() {
    var child, i, len, ref;
    this.removing = this.removed = false;
    ref = this.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.clearRemoving();
    }
  }

  // removeDom: ->
  // this method is coded in BaseComponent.removeDom
  // the case for component.isList is considered there
  removeNode() {
    var child, i, len, ref;
    this.removing = false;
    this.removed = true;
    this.node.parentNode = null;
    this.childParentNode = null;
    ref = this.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.baseComponent.removeNode();
    }
  }

  invalidateAttach(child) {
    var index;
    index = this.children.indexOf(child);
    binaryInsert(index, this.attachingIndexes);
    if (this.attachValid) {
      this.attachValid = false;
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    }
    return this;
  }

  resetAttach() {
    var child, i, len, ref;
    this.attachValid = false;
    ref = this.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.resetAttach();
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
      ListMixinAttachChildren.call(this);
      return this.emit('didAttach');
    }
  }

  setNextNode(nextNode) {
    var child, children, index;
    this.nextNode = nextNode;
    this.childrenNextNode = nextNode;
    children = this.children;
    index = children.length - 1;
    while (child = children[index]) {
      child.setNextNode(nextNode);
      if (!child.firstNode) {
        index--;
      } else {
        break;
      }
    }
  }

  clone(options) {
    var result;
    result = new List(this.cloneChildren(options));
    result.constructor = this.constructor;
    return result.copyEventListeners(this);
  }

  toString(indent = 0, addNewLine) {
    var child, i, len, ref, s;
    if (!this.children.length) {
      return newLine("<List/>", indent, addNewLine);
    } else {
      s = newLine("<List>", indent, addNewLine);
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine('</List>', indent, true);
    }
  }

};

mixin(List.prototype, ListMixin);

ListMixinAttachChildren = ListMixin.attachChildren;
