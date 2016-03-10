var Nothing, extendChildFamily, getFirstNode, isArray, isComponent, substractSet, toComponent, toComponentList, updateChildHolder, updateDcidIndexMap, _ref,
  __slice = [].slice;

_ref = require('dc-util'), isArray = _ref.isArray, substractSet = _ref.substractSet;

isComponent = require('./isComponent');

toComponent = require('./toComponent');

toComponentList = require('./toComponentList');

Nothing = require('./Nothing');

extendChildFamily = require('../../dom-util').extendChildFamily;

updateChildHolder = require('../../dc').updateChildHolder;

updateDcidIndexMap = function(dcidIndexMap, children, start) {
  var i, length;
  length = children.length;
  i = start;
  while (i < length) {
    dcidIndexMap[children[i].dcid] = i;
    i++;
  }
};

getFirstNode = function(node) {
  var first, n, _i, _len;
  if (isArray(node)) {
    for (_i = 0, _len = node.length; _i < _len; _i++) {
      n = node[_i];
      if (first = getFirstNode(n)) {
        return first;
      }
    }
    return null;
  } else {
    return node;
  }
};

module.exports = {
  initChildren: function(children) {
    var child, dcidIndexMap, family, i, nextNodes, _i, _len;
    children = toComponentList(children);
    this.dcidIndexMap = dcidIndexMap = {};
    this.renderingMap = {};
    this.removingMap = {};
    this.nextNodes = nextNodes = [];
    this.family = family = {};
    family[this.dcid] = true;
    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
      child = children[i];
      child = children[i];
      child.holder = this;
      extendChildFamily(family, child);
      dcidIndexMap[child.dcid] = i;
    }
    return this.children = children;
  },
  getChildNextNode: function(child) {
    return this.nextNodes[this.dcidIndexMap[child.dcid]];
  },
  updateChildHolder: updateChildHolder,
  createChildrenDom: function() {
    var child, children, e, firstNode, i, nextNode, nextNodes, node;
    nextNodes = this.nextNodes;
    children = this.children;
    node = this.childNodes;
    node.nextSibling = nextNode = this.childNextNode;
    node.parentNode = this.childParentNode;
    i = children.length - 1;
    nextNodes[i] = nextNode;
    while (i >= 0) {
      child = children[i];
      child.parentNode = this.childParentNode;
      child.nextNode = nextNode;
      if (child.holder !== this) {
        if (child.node) {
          child.invalidate();
        }
        child.holder = this;
      }
      try {
        child.renderDom(child.baseComponent);
      } catch (_error) {
        e = _error;
        dc.onerror(e);
      }
      node[i] = child.node;
      i--;
      firstNode = child.firstNode;
      nextNodes[i] = nextNode = firstNode || nextNode;
    }
    this.childFirstNode = firstNode;
    return node;
  },
  insertChildBefore: function(child, refChild) {
    return this.insertChild(refChild, child);
  },
  insertChildAfter: function(child, refChild) {
    var children;
    children = this.children;
    if (isComponent(refChild)) {
      refChild = children.indexOf(refChild);
      if (refChild < 0) {
        refChild = children.length;
      }
    }
    return this.insertChild(refChild + 1, child);
  },
  pushChild: function(child) {
    return this.insertChild(this.children.length, child);
  },
  unshiftChild: function(child) {
    return this.insertChild(0, child);
  },
  insertChild: function(refChild, child) {
    var children, dcidIndexMap, index, length, nextNode;
    children = this.children, dcidIndexMap = this.dcidIndexMap;
    length = children.length;
    if (isComponent(refChild)) {
      index = dcidIndexMap[refChild.dcid];
      if (index == null) {
        index = length;
      }
    } else if (refChild > length) {
      index = length;
      refChild = null;
    } else if (refChild < 0) {
      index = 0;
      refChild = null;
    } else {
      index = refChild;
      refChild = children[index];
    }
    this.emit('onInsertChild', index, refChild, child);
    extendChildFamily(this.family, child);
    this.updateChildHolder(child);
    if (!refChild) {
      nextNode = this.nextNode;
    } else {
      nextNode = refChild.firstNode || refChild.nextNode;
    }
    child.setNextNode(nextNode);
    child.invalidate();
    dcidIndexMap[child.dcid] = index;
    children.splice(index, 1, child);
    if (this.childNodes) {
      this.childNodes.splice(index, 1, null);
    }
    updateDcidIndexMap(dcidIndexMap, children, index + 1, 0);
    return this;
  },
  removeChild: function(child) {
    var children, dcidIndexMap, index;
    if (child == null) {
      dc.error('child to be removed is undefined');
    }
    children = this.children;
    dcidIndexMap = this.dcidIndexMap;
    if (isComponent(child)) {
      index = dcidIndexMap[child.dcid];
      if (index == null) {
        dc.error('child to be removed is not in the children');
      }
    } else if (child >= children.length || child < 0) {
      dc.error('child to be removed is out of bound');
    } else {
      index = child;
      child = children[index];
    }
    delete dcidIndexMap[child.dcid];
    children[index].markRemovingDom(true);
    substractSet(this.family, child.family);
    children.splice(index, 1);
    if (this.childNodes) {
      this.childNodes.splice(index, 1);
    }
    updateDcidIndexMap(dcidIndexMap, children, index);
    return this;
  },
  shiftChild: function() {
    var child, children, i;
    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    children = [];
    i = children.length(-1);
    while (i >= 0) {
      child = toComponent(children[i]);
      this.insertChild(0, child);
    }
    return this;
  },
  unshiftChild: function() {
    return this.removeChild(0);
  },
  popChild: function() {
    var length;
    length = this.children.length;
    if (length) {
      return this.removeChild(length - 1);
    } else {
      return this;
    }
  },
  replaceChild: function(oldChild, newChild) {
    var children, dcidIndexMap, index;
    children = this.children, dcidIndexMap = this.dcidIndexMap;
    if (isComponent(oldChild)) {
      index = dcidIndexMap[oldChild.dcid];
      if (index == null) {
        dc.error('oldChild to be replaced is not in the children');
      }
      delete dcidIndexMap[oldChild.id];
    } else {
      if (oldChild >= children.length || oldChild < 0) {
        dc.error('oldChild to be replaced is out of bound');
      }
      index = oldChild;
      oldChild = children[index];
    }
    this.emit('onReplaceChild', index, oldChild, newChild);
    newChild = toComponent(newChild);
    if (oldChild === newChild) {
      return this;
    }
    delete dcidIndexMap[oldChild.dcid];
    children[index] = newChild;
    dcidIndexMap[newChild.dcid] = index;
    newChild.holder = this;
    newChild.setParentNode(this.childParentNode);
    newChild.setNextNode(oldChild.nextNode);
    newChild.invalidate();
    oldChild.markRemovingDom(true);
    substractSet(this.family, oldChild.family);
    extendChildFamily(this.family, newChild);
    return this;
  },
  invalidateChildren: function(startIndex, stopIndex) {
    var children;
    if (stopIndex == null) {
      stopIndex = startIndex + 1;
    }
    if (!this.node) {
      return this;
    }
    children = this.children;
    while (startIndex < stopIndex) {
      children[startIndex].invalidate();
      startIndex++;
    }
    return this;
  },
  setChildren: function() {
    var child, children, i, n, newChildren, oldChildrenLength, startIndex, _i, _len;
    startIndex = arguments[0], newChildren = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    children = this.children;
    oldChildrenLength = children.length;
    n = oldChildrenLength;
    while (n < startIndex) {
      this.pushChild(new Nothing());
      n++;
    }
    for (i = _i = 0, _len = newChildren.length; _i < _len; i = ++_i) {
      child = newChildren[i];
      if (startIndex + i < oldChildrenLength) {
        this.replaceChild(startIndex + i, newChildren[i]);
      } else {
        this.pushChild(newChildren[i]);
      }
    }
    return this;
  },
  setLength: function(newLength) {
    var last, length, n;
    length = this.children.length;
    if (newLength >= length) {
      n = length;
      while (n < newLength) {
        this.pushChild(new Nothing());
        n++;
      }
    } else {
      last = length - 1;
      while (last >= newLength) {
        this.removeChild(last);
        last--;
      }
    }
    return this;
  }
};
