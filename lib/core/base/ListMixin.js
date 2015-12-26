var Nothing, binaryInsert, binarySearch, checkConflictOffspring, substractSet, toComponent, toComponentList, _ref,
  __slice = [].slice;

toComponent = require('./toComponent');

toComponentList = require('./toComponentList');

Nothing = require('./Nothing');

_ref = require('dc-util'), binarySearch = _ref.binarySearch, binaryInsert = _ref.binaryInsert, substractSet = _ref.substractSet;

checkConflictOffspring = require('../../dom-util').checkConflictOffspring;

module.exports = {
  initChildren: function(children) {
    var child, dcidIndexMap, family, i, _i, _len;
    children = toComponentList(children);
    this.family = family = {};
    family[this.dcid] = true;
    this.dcidIndexMap = dcidIndexMap = {};
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      child = children[i];
      checkConflictOffspring(family, child);
      child.holder = this;
      dcidIndexMap[child.dcid] = i;
    }
    return this.children = children;
  },
  createChildrenDom: function() {
    var child, children, e, firstNode, index, node;
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
      try {
        child.renderDom();
      } catch (_error) {
        e = _error;
        dc.onerror(e);
      }
      node.unshift(child.node);
      firstNode = child.firstNode || firstNode;
      index && (children[index - 1].nextNode = firstNode || child.nextNode);
      index--;
    }
    this.childFirstNode = firstNode;
    return node;
  },
  updateChildrenDom: function() {
    var child, childFirstNode, childNodes, children, e, i, invalidIndexes, listIndex, nextNode, _, _ref1;
    invalidIndexes = this.invalidIndexes;
    if (invalidIndexes.length) {
      children = this.children;
      this.invalidIndexes = [];
      childNodes = this.childNodes;
      nextNode = this.childrenNextNode;
      children[children.length - 1].nextNode = nextNode;
      childFirstNode = null;
      i = invalidIndexes.length - 1;
      while (i >= 0) {
        listIndex = invalidIndexes[i];
        child = children[listIndex];
        if (child.holder !== this) {
          child.invalidate();
          child.holder = this;
        }
        try {
          child.renderDom();
        } catch (_error) {
          e = _error;
          dc.onerror(e);
        }
        childNodes[listIndex] = child.node;
        nextNode = child.firstNode || nextNode;
        if (listIndex) {
          children[listIndex - 1].nextNode = nextNode;
        }
        i--;
      }
      while (listIndex >= 0) {
        child = children[listIndex];
        childFirstNode = child.firstNode || nextNode;
        listIndex--;
      }
      this.childFirstNode = childFirstNode;
    }
    _ref1 = this.removedChildren;
    for (_ in _ref1) {
      child = _ref1[_];
      child.removeDom();
    }
    this.removedChildren = {};
    return childNodes;
  },
  invalidateContent: function(child) {
    this.valid = false;
    this.contentValid = false;
    this.node && binaryInsert(this.dcidIndexMap[child.dcid], this.invalidIndexes);
    return this.holder && this.holder.invalidateContent(this);
  },
  pushChild: function(child) {
    return this.setChildren(this.children.length, child);
  },
  unshiftChild: function(child) {
    return this.insertChild(0, child);
  },
  insertChild: function(index, child) {
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
  },
  removeChild: function(index) {
    var child, children, invalidIndex, invalidIndexes, prevIndex;
    children = this.children;
    if (index > children.length) {
      return this;
    }
    this.invalidate();
    child = children[index];
    child.markRemovingDom(this.parentNode);
    substractSet(this.family, child.family);
    children.splice(index, 1);
    if (this.node) {
      invalidIndexes = this.invalidIndexes;
      invalidIndex = binarySearch(index, invalidIndexes);
      if (invalidIndexes[invalidIndex] === index) {
        invalidIndexes.splice(invalidIndexes, 1);
      }
      prevIndex = index - 1;
      if (prevIndex >= 0) {
        children[prevIndex].nextNode = child.nextNode;
      }
      this.node.splice(index, 1);
      this.removedChildren[child.dcid] = child;
    }
    return this;
  },
  invalidChildren: function(startIndex, stopIndex) {
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
  },
  setChildren: function() {
    var child, children, dcidIndexMap, family, i, insertLocation, invalidIndex, invalidIndexes, newChildren, node, oldChild, oldChildrenLength, startIndex, stopIndex;
    startIndex = arguments[0], newChildren = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    this.invalidate();
    children = this.children, family = this.family, node = this.node, dcidIndexMap = this.dcidIndexMap;
    oldChildrenLength = children.length;
    if (startIndex > oldChildrenLength) {
      i = oldChildrenLength;
      while (i < startIndex) {
        child = new Nothing();
        child.holder = this;
        newChildren.unshift(child);
        i++;
      }
      startIndex = oldChildrenLength;
    }
    if (node) {
      invalidIndexes = this.invalidIndexes;
      insertLocation = binarySearch(startIndex, this.invalidIndexes);
    }
    stopIndex = startIndex + newChildren.length;
    i = 0;
    while (startIndex < stopIndex) {
      child = toComponent(newChildren[i]);
      child.holder = this;
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
  },
  setLength: function(newLength) {
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
  }
};
