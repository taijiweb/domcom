var BaseComponent, List, ListMixin, dc, exports, getFirstNodeFromArray, isArray, mixin, newLine, refreshComponents, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseComponent = require('./BaseComponent');

_ref = require('dc-util'), newLine = _ref.newLine, isArray = _ref.isArray;

refreshComponents = (dc = require('../../dc')).refreshComponents;

getFirstNodeFromArray = function(nodes) {
  var node, _i, _len;
  if (!nodes.length) {
    return null;
  } else {
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      if (!isArray(node) && node) {
        return node;
      } else if (node = getFirstNodeFromArray(node)) {
        return node;
      }
    }
    return null;
  }
};

module.exports = exports = List = (function(_super) {
  __extends(List, _super);

  function List(children) {
    List.__super__.constructor.call(this);
    this.renderingMap = {};
    this.removingMap = {};
    this.initChildren(children);
    this.isList = true;
    return;
  }

  List.prototype.createDom = function() {
    var children, length, nextNodes, node;
    this.valid = true;
    children = this.children;
    nextNodes = this.nextNodes;
    this.node = this.childNodes = node = [];
    this.childParentNode = this.parentNode;
    this.childNextNode = this.nextNode;
    nextNodes.length = length = children.length;
    if (length) {
      nextNodes[length - 1] = this.nextNode;
      this.createChildrenDom();
    }
    this.firstNode = this.childFirstNode;
    return node;
  };

  List.prototype.getChildParentNode = function(child) {
    return this.parentNode;
  };

  List.prototype.updateChildHolder = function(child, listIndex) {
    if (child.holder !== this) {
      if (child.node) {
        child.invalidate();
      }
      child.setParentNode(this.parentNode);
      child.holder = this;
    }
  };

  List.prototype.refreshDom = function() {
    this.valid = true;
    refreshComponents.call(this);
    return this.node;
  };

  List.prototype.setParentNode = function(parentNode) {
    var child, _i, _len, _ref1;
    if (this.parentNode !== parentNode) {
      this.parentNode = parentNode;
      _ref1 = this.children;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        child.setParentNode(parentNode);
      }
    }
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
    var attached, baseComponent, child, children, holder, index, length, nextNode, node, parentNode;
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
      holder = this.holder;
      if (holder.children) {
        holder.node[holder.dcidIndexMap[this.dcid]] = node;
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
      var _i, _len, _ref1, _results;
      _ref1 = this.children;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        _results.push(child.clone());
      }
      return _results;
    }).call(this))).copyEventListeners(this);
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
