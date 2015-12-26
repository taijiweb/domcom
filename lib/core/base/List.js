var BaseComponent, List, ListMixin, exports, extend, newLine,
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
    this.setNode(node);
    this.childNodes = node;
    node.parentNode = this.parentNode;
    this.createChildrenDom();
    this.setFirstNode(this.childFirstNode);
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
    this.setFirstNode(this.childFirstNode);
    return this.node;
  };

  List.prototype.removeDom = function() {
    var child, _i, _len, _ref;
    if (this.parentNode || !this.node || !this.node.parentNode) {
      return this;
    } else {
      this.emit('removeDom');
      this.node.parentNode = null;
      this.node.nextNode = null;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.removeDom();
      }
      return this;
    }
  };

  List.prototype.markRemovingDom = function(parentNode) {
    var child, _i, _len, _ref;
    if (this.parentNode !== parentNode) {

    } else {
      this.parentNode = null;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.markRemovingDom(parentNode);
      }
    }
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
    var baseComponent, child, children, index, nextNode, node, parentNode;
    children = this.children, parentNode = this.parentNode, nextNode = this.nextNode, node = this.node;
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

extend = require('extend');

ListMixin = require('./ListMixin');

extend(List.prototype, ListMixin);
