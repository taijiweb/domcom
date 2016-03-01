var BaseComponent, List, ListMixin, exports, mixin, newLine,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

newLine = require('dc-util').newLine;

module.exports = exports = List = (function(_super) {
  __extends(List, _super);

  function List(children) {
    List.__super__.constructor.call(this);
    this.initChildren(children);
    this.isList = true;
    return;
  }

  List.prototype.createDom = function() {
    var child, children, i, length, node, parentNode, _i, _len;
    if (length = this.children.length) {
      parentNode = this.parentNode, children = this.children;
      children[length - 1].nextNode = this.nextNode;
      for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
        child = children[i];
        child.parentNode = parentNode;
      }
    }
    node = [];
    this.node = node;
    this.childNodes = node;
    node.parentNode = this.parentNode;
    this.createChildrenDom();
    this.firstNode = this.childFirstNode;
    this.childrenNextNode = this.nextNode;
    return this.node;
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

  List.prototype.setParentNode = function(parentNode) {
    var child, _i, _len, _ref;
    if (this.parentNode !== parentNode) {
      this.parentNode = parentNode;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.setParentNode(parentNode);
      }
    }
  };

  List.prototype.setNextNode = function(nextNode) {
    var children, childrenLength;
    this.nextNode = nextNode;
    children = this.children;
    childrenLength = children.length;
    if (childrenLength) {
      children[childrenLength - 1].setNextNode(nextNode);
    }
  };

  List.prototype.markRemovingDom = function(removing) {
    var child, _i, _len, _ref;
    if (!removing || (this.node && this.node.parentNode)) {
      this.removing = removing;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.markRemovingDom(removing);
      }
    }
  };

  List.prototype.removeDom = function() {
    var child, _i, _len, _ref;
    if (this.removing && this.attached) {
      this.removing = false;
      this.attached = false;
      this.holder = null;
      this.node.parentNode = null;
      this.emit('willDetach');
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.removeDom();
      }
      this.emit('didDetach');
    }
    return this;
  };

  List.prototype.removeNode = function() {
    var child, _i, _len, _ref;
    this.node.parentNode = null;
    _ref = this.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.baseComponent.removeNode();
    }
  };

  List.prototype.attachNode = function() {
    var attached, baseComponent, child, children, index, nextNode, node, parentNode;
    children = this.children, parentNode = this.parentNode, nextNode = this.nextNode, node = this.node;
    if (!(attached = this.attached)) {
      this.attached = true;
      this.emit('willAttach');
    }
    if (parentNode !== this.node.parentNode || nextNode !== node.nextNode) {
      node.parentNode = parentNode;
      node.nextNode = nextNode;
      if (children.length) {
        nextNode = this.nextNode;
        index = children.length - 1;
        children[index].nextNode = nextNode;
        while (index >= 0) {
          child = children[index];
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

  List.prototype.clone = function() {
    var child;
    return (new List((function() {
      var _i, _len, _ref, _results;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.clone());
      }
      return _results;
    }).call(this))).copyEventListeners(this);
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

mixin = require('dc-util').mixin;

ListMixin = require('./ListMixin');

mixin(List.prototype, ListMixin);
