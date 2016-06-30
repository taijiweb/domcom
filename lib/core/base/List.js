var BaseComponent, List, ListMixin, ListMixinAttachChildren, binaryInsert, exports, mixin, newLine, toComponentArray,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

newLine = require('dc-util').newLine;

toComponentArray = require('./toComponentArray');

mixin = require('dc-util').mixin;

ListMixin = require('./ListMixin');

binaryInsert = require('dc-util').binaryInsert;

module.exports = exports = List = (function(_super) {
  __extends(List, _super);

  function List(children) {
    List.__super__.constructor.call(this);
    this.children = toComponentArray(children);
    this.initListMixin();
    this.isList = true;
    return;
  }

  List.prototype.refreshDom = function(oldBaseComponent) {
    this.renderDom();
    this.attachChildren();
    return this;
  };

  List.prototype.createDom = function() {
    this.node = this.childNodes;
    this.createChildrenDom();
    this.firstNode = this.childrenFirstNode;
    return this.node;
  };

  List.prototype.updateDom = function() {
    this.updateChildrenDom();
    this.firstNode = this.childrenFirstNode;
    return this.node;
  };

  List.prototype.markRemovingDom = function() {
    var child, _i, _len, _ref;
    this.removing = true;
    this.holder = null;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.markRemoving();
    }
    dc.removingChildren[this.dcid] = this;
    return this;
  };

  List.prototype.markRemoving = function() {
    var child, _i, _len, _ref;
    this.removing = true;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.markRemoving();
    }
  };

  List.prototype.clearRemoving = function() {
    var child, _i, _len, _ref;
    this.removing = this.removed = false;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.clearRemoving();
    }
  };

  List.prototype.removeNode = function() {
    var child, _i, _len, _ref;
    this.removing = false;
    this.removed = true;
    this.node.parentNode = null;
    this.childParentNode = null;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.baseComponent.removeNode();
    }
  };

  List.prototype.invalidateAttach = function(child) {
    var index;
    index = this.children.indexOf(child);
    binaryInsert(index, this.attachParentIndexes);
    if (this.attachValid) {
      this.attachValid = false;
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
    }
    return this;
  };

  List.prototype.attachParent = function() {
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
  };

  List.prototype.setNextNode = function(nextNode) {
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
  };

  List.prototype.clone = function(arg) {
    var result;
    result = new List(this.cloneChildren(arg));
    result.constructor = this.constructor;
    return result.copyEventListeners(this);
  };

  List.prototype.toString = function(indent, addNewLine) {
    var child, s, _i, _len, _ref;
    if (indent == null) {
      indent = 0;
    }
    if (!this.children.length) {
      return newLine("<List/>", indent, addNewLine);
    } else {
      s = newLine("<List>", indent, addNewLine);
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine('</List>', indent, true);
    }
  };

  return List;

})(BaseComponent);

mixin(List.prototype, ListMixin);

ListMixinAttachChildren = ListMixin.attachChildren;
