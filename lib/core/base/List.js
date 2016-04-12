var BaseComponent, List, ListMixin, dc, exports, isArray, mixin, newLine, refreshComponents, toComponentArray, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

_ref = require('dc-util'), newLine = _ref.newLine, isArray = _ref.isArray;

refreshComponents = (dc = require('../../dc')).refreshComponents;

toComponentArray = require('./toComponentArray');

module.exports = exports = List = (function(_super) {
  __extends(List, _super);

  function List(children) {
    List.__super__.constructor.call(this);
    this.children = toComponentArray(children);
    this.initListMixin();
    this.isList = true;
    return;
  }

  List.prototype.createDom = function() {
    var children, node;
    this.valid = true;
    children = this.children;
    this.node = this.childNodes = node = [];
    this.childNextNode = this.nextNode;
    this.createChildrenDom();
    this.firstNode = this.childFirstNode;
    return node;
  };

  List.prototype.updateDom = function() {
    var children, index, invalidIndexes, parentNode, _i, _len;
    children = this.children, parentNode = this.parentNode, invalidIndexes = this.invalidIndexes;
    for (_i = 0, _len = invalidIndexes.length; _i < _len; _i++) {
      index = invalidIndexes[_i];
      children[index].parentNode = parentNode;
    }
    this.childrenNextNode = this.nextNode;
    this.updateChildrenDom();
    this.firstNode = this.childFirstNode;
    return this.node;
  };

  List.prototype.markRemovingDom = function(removing) {
    var child, node, _i, _len, _ref1;
    this.removing = removing;
    if (removing) {
      if ((node = this.node) && node.parentNode) {
        node.parentNode = null;
        _ref1 = this.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          child = _ref1[_i];
          child.markRemovingDom(removing);
        }
      }
      this.holder = null;
    }
    return this;
  };

  List.prototype.removeDom = function() {
    var child, _i, _len, _ref1;
    if (this.removing && this.attached) {
      this.removing = false;
      this.attached = false;
      this.emit('willDetach');
      _ref1 = this.children;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        child.removeDom();
      }
      this.emit('didDetach');
    }
    return this;
  };

  List.prototype.removeNode = function() {
    var child, _i, _len, _ref1;
    this.node.parentNode = null;
    _ref1 = this.children;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      child.baseComponent.removeNode();
    }
  };

  List.prototype.attachNode = function() {
    var attached, baseComponent, child, children, index, length, nextNode, node, parentNode;
    children = this.children, parentNode = this.parentNode, nextNode = this.nextNode, node = this.node;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    if (parentNode !== node.parentNode || nextNode !== node.nextSibling) {
      node.parentNode = parentNode;
      length = children.length;
      if (length) {
        index = length - 1;
        children[index].nextNode = nextNode;
        while (index >= 0) {
          child = children[index];
          if (child.holder && child.holder !== this) {
            child.invalidate();
            child.holder = this.holder;
          }
          child.parentNode = parentNode;
          baseComponent = child.baseComponent;
          baseComponent.parentNode = parentNode;
          baseComponent.nextNode = child.nextNode;
          baseComponent.attachNode();
          if (index) {
            children[index - 1].nextNode = child.firstNode || child.nextNode;
          }
          index--;
        }
      }
    }
    if (!attached) {
      this.emit('didAttach');
    }
    return this.node;
  };

  List.prototype.clone = function(arg) {
    var result;
    result = new List(this.cloneChildren(arg));
    result.constructor = this.constructor;
    return result.copyEventListeners(this);
  };

  List.prototype.toString = function(indent, addNewLine) {
    var child, s, _i, _len, _ref1;
    if (indent == null) {
      indent = 0;
    }
    if (!this.children.length) {
      return newLine("<List/>", indent, addNewLine);
    } else {
      s = newLine("<List>", indent, addNewLine);
      _ref1 = this.children;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        s += child.toString(indent + 2, true);
      }
      return s += newLine('</List>', indent, true);
    }
  };

  return List;

})(BaseComponent);

mixin = require('dc-util').mixin;

ListMixin = require('./ListMixin');

mixin(List.prototype, ListMixin);
