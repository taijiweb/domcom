var BaseComponent, List, Nothing, binaryInsert, binarySearch, checkConflictOffspring, checkContainer, exports, newLine, substractSet, toComponent, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

toComponent = require('./toComponent');

BaseComponent = require('./BaseComponent');

Nothing = require('./Nothing');

_ref = require('../../util'), checkContainer = _ref.checkContainer, newLine = _ref.newLine, binarySearch = _ref.binarySearch, binaryInsert = _ref.binaryInsert, substractSet = _ref.substractSet;

checkConflictOffspring = require('../../dom-util').checkConflictOffspring;

module.exports = exports = List = (function(_super) {
  __extends(List, _super);

  function List(children) {
    var child, dcidIndexMap, family, i, _i, _len;
    this.children = children;
    List.__super__.constructor.call(this);
    this.family = family = {};
    family[this.dcid] = true;
    this.dcidIndexMap = dcidIndexMap = {};
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      children[i] = child = toComponent(child);
      checkConflictOffspring(family, child);
      child.holder = this;
      dcidIndexMap[child.dcid] = i;
    }
    this.isList = true;
    return;
  }

  List.prototype.invalidateContent = function(child) {
    this.valid = false;
    this.contentValid = false;
    this.node && binaryInsert(this.dcidIndexMap[child.dcid], this.invalidIndexes);
    return this.holder && this.holder.invalidateContent(this);
  };

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
    this.node = this.childNodes = node = [];
    node.parentNode = this.parentNode;
    this.createChildrenDom();
    this.firstNode = this.childFristNode;
    this.childrenNextNode = this.nextNode;
    return this.node;
  };

  List.prototype.createChildrenDom = function() {
    var child, children, firstNode, index, node;
    node = this.childNodes;
    this.invalidIndexes = [];
    this.removedChildren = {};
    children = this.children;
    index = children.length - 1;
    firstNode = null;
    while (index >= 0) {
      child = children[index];
      if (child.holder !== this) {
        child.invalidate();
        child.holder = this;
      }
      child.renderDom();
      node.unshift(child.node);
      firstNode = child.firstNode || firstNode;
      index && (children[index - 1].nextNode = firstNode || child.nextNode);
      index--;
    }
    this.childFristNode = firstNode;
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
    return this.updateChildrenDom();
  };

  List.prototype.updateChildrenDom = function() {
    var child, childNodes, children, i, invalidIndexes, listIndex, nextNode, parentNextNode, parentNode, _, _ref1, _ref2;
    invalidIndexes = this.invalidIndexes;
    if (!invalidIndexes.length) {
      _ref1 = this.removedChildren;
      for (_ in _ref1) {
        child = _ref1[_];
        child.removeDom();
      }
      this.removedChildren = {};
      return childNodes;
    }
    children = this.children;
    this.invalidIndexes = [];
    parentNode = this.parentNode, nextNode = this.nextNode, childNodes = this.childNodes;
    parentNextNode = nextNode;
    i = invalidIndexes.length - 1;
    children[children.length - 1].nextNode = this.childrenNextNode;
    while (i >= 0) {
      listIndex = invalidIndexes[i];
      child = children[listIndex];
      if (child.holder !== this) {
        child.invalidate();
        child.holder = this;
      }
      child.renderDom();
      childNodes[listIndex] = child.node;
      listIndex && (children[listIndex - 1].nextNode = child.firstNode || nextNode);
      i--;
    }
    _ref2 = this.removedChildren;
    for (_ in _ref2) {
      child = _ref2[_];
      child.removeDom();
    }
    this.removedChildren = {};
    return childNodes;
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

  List.prototype.pushChild = function(child) {
    return this.setChildren(this.children.length, child);
  };

  List.prototype.unshiftChild = function(child) {
    return this.insertChild(0, child);
  };

  List.prototype.insertChild = function(index, child) {
    var children, insertLocation, invalidIndexes, length;
    children = this.children;
    if (index >= children.length) {
      return this.setChildren(index, child);
    }
    this.invalidate();
    child = toComponent(child);
    children.splice(index, 0, child);
    this.dcidIndexMap[child.dcid] = index;
    if (this.node) {
      invalidIndexes = this.invalidIndexes;
      insertLocation = binaryInsert(index, invalidIndexes);
      length = invalidIndexes.length;
      insertLocation++;
      while (insertLocation < length) {
        invalidIndexes[insertLocation]++;
        insertLocation++;
      }
    }
    return this;
  };

  List.prototype.removeChild = function(index) {
    var child, children, invalidIndex, invalidIndexes;
    children = this.children;
    if (index > children.length) {
      return this;
    }
    this.invalidate();
    child = children[index];
    child.parentNode = null;
    substractSet(this.family, child.family);
    children.splice(index, 1);
    if (this.node) {
      invalidIndexes = this.invalidIndexes;
      invalidIndex = binarySearch(index, invalidIndexes);
      if (invalidIndexes[invalidIndex] === index) {
        invalidIndexes.splice(invalidIndexes, 1);
      }
      children[index - 1] && (children[index - 1].nextNode = child.nextNode);
      this.node.splice(index, 1);
      this.removedChildren[child.dcid] = child;
    }
    return this;
  };

  List.prototype.invalidChildren = function(startIndex, stopIndex) {
    var insertLocation, invalidIndex, invalidIndexes;
    if (stopIndex == null) {
      stopIndex = startIndex + 1;
    }
    if (!this.node) {
      return this;
    }
    this.invalidate();
    invalidIndexes = this.invalidIndexes;
    insertLocation = binarySearch(startIndex, this.invalidIndexes);
    while (startIndex < stopIndex) {
      invalidIndex = invalidIndexes[insertLocation];
      if (invalidIndex !== startIndex) {
        invalidIndexes.splice(insertLocation, 0, startIndex);
      }
      insertLocation++;
      startIndex++;
    }
    return this;
  };

  List.prototype.setChildren = function() {
    var child, children, dcidIndexMap, family, i, insertLocation, invalidIndex, invalidIndexes, newChildren, node, oldChild, oldChildrenLength, removedChildren, startIndex, stopIndex;
    startIndex = arguments[0], newChildren = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    this.invalidate();
    children = this.children, family = this.family, node = this.node, dcidIndexMap = this.dcidIndexMap;
    if (startIndex > (oldChildrenLength = children.length)) {
      i = oldChildrenLength;
      while (i < startIndex) {
        newChildren.unshift(new Nothing());
        i++;
      }
      startIndex = oldChildrenLength;
    }
    if (node) {
      invalidIndexes = this.invalidIndexes, removedChildren = this.removedChildren;
      insertLocation = binarySearch(startIndex, this.invalidIndexes);
    }
    stopIndex = startIndex + newChildren.length;
    i = 0;
    while (startIndex < stopIndex) {
      child = toComponent(newChildren[i]);
      oldChild = children[startIndex];
      if (oldChild == null) {
        children[startIndex] = new Nothing();
      }
      if (oldChild === child) {
        if (node) {
          invalidIndex = invalidIndexes[insertLocation];
          if (invalidIndex && invalidIndex < stopIndex) {
            insertLocation++;
          }
        }
      } else {
        if (oldChild) {
          substractSet(family, oldChild.family);
          if (node) {
            this.removedChildren[oldChild.dcid] = oldChild;
          }
        }
        checkConflictOffspring(family, child);
        children[startIndex] = child;
        dcidIndexMap[child.dcid] = startIndex;
        if (node) {
          invalidIndex = invalidIndexes[insertLocation];
          if (invalidIndex !== startIndex) {
            invalidIndexes.splice(insertLocation, 0, startIndex);
          }
          insertLocation++;
        }
      }
      startIndex++;
      i++;
    }
    return this;
  };

  List.prototype.setLength = function(newLength) {
    var children, insertLocation, last;
    children = this.children;
    if (newLength >= children.length) {
      return this;
    }
    last = children.length - 1;
    if (this.node) {
      insertLocation = binarySearch(newLength, this.invalidIndexes);
      this.invalidIndexes = this.invalidIndexes.slice(0, insertLocation);
    }
    while (last >= newLength) {
      this.removeChild(last);
      last--;
    }
    return this;
  };

  List.prototype.attachNode = function() {
    var baseComponent, child, children, index, nextNode, parentNode;
    children = this.children;
    if ((parentNode = this.parentNode) !== this.node.parentNode) {
      this.node.parentNode = parentNode;
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
          index && (children[index - 1].nextNode = child.firstNode || child.nextNode);
          index--;
        }
      }
    }
    return this.node;
  };

  List.prototype.removeDom = function() {
    var child, _i, _len, _ref1;
    this.node.parentNode = null;
    _ref1 = this.children;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      child.parentNode = null;
      child.removeDom();
    }
    this.emit('afterRemoveDom');
    return this;
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
