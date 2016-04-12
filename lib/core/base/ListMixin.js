var Nothing, addIndexes, binaryInsert, binarySearch, extendChildFamily, isArray, isComponent, substractSet, toComponent, updateDcidIndexMap, _ref, _ref1,
  __slice = [].slice;

_ref = require('dc-util'), isArray = _ref.isArray, substractSet = _ref.substractSet;

isComponent = require('./isComponent');

toComponent = require('./toComponent');

Nothing = require('./Nothing');

_ref1 = require('dc-util'), binarySearch = _ref1.binarySearch, binaryInsert = _ref1.binaryInsert, substractSet = _ref1.substractSet;

extendChildFamily = require('../../dom-util').extendChildFamily;

updateDcidIndexMap = function(dcidIndexMap, children, start) {
  var i, length;
  length = children.length;
  i = start;
  while (i < length) {
    dcidIndexMap[children[i].dcid] = i;
    i++;
  }
};

addIndexes = function(indexes, value, start) {
  var i, length;
  length = indexes.length;
  i = start;
  while (i < length) {
    indexes[i] += value;
    i++;
  }
};

module.exports = {
  initListMixin: function() {
    var child, dcidIndexMap, family, i, _i, _len, _ref2;
    this.dcidIndexMap = dcidIndexMap = {};
    this.family = family = {};
    family[this.dcid] = true;
    _ref2 = this.children;
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      child = _ref2[i];
      child.holder = this;
      extendChildFamily(family, child);
      dcidIndexMap[child.dcid] = i;
    }
  },
  cloneChildrenFrom: function(component, options) {
    var child, children, i, _i, _len, _ref2;
    children = [];
    _ref2 = component.children;
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      child = _ref2[i];
      children.push(this.cloneChild(child, i, options, component));
    }
    return this.setChildren(0, children);
  },
  cloneChild: function(child, index, options, srcComponent) {
    return child.clone(options);
  },
  createChildrenDom: function() {
    var child, children, e, firstNode, index, node;
    node = this.childNodes;
    this.invalidIndexes = [];
    this.removingChildren = {};
    children = this.children;
    index = children.length - 1;
    firstNode = null;
    while (index >= 0) {
      child = children[index];
      if (child.holder && child.holder !== this) {
        child.holder.invalidateContent(child);
      }
      child.holder = this;
      try {
        child.renderDom(child.baseComponent);
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
    var child, childNodes, children, childrenLength, e, i, invalidIndexes, j, lastChild, lastNextNode, listIndex, nextChild, nextChildFirstNode, nextNode, _, _ref2;
    invalidIndexes = this.invalidIndexes;
    if (invalidIndexes.length) {
      children = this.children;
      this.invalidIndexes = [];
      i = invalidIndexes.length - 1;
      childNodes = this.childNodes;
      lastNextNode = nextNode = this.childrenNextNode;
      childrenLength = children.length;
      if ((lastChild = children[childrenLength - 1]) && lastChild.nextNode !== nextNode) {
        lastChild.nextNode = nextNode;
        listIndex = invalidIndexes[i];
        j = childrenLength - 1;
        nextChild = children[j];
        j--;
        while (j >= listIndex) {
          child = children[j];
          if (nextChildFirstNode = nextChild.firstNode) {
            child.nextNode = nextNode = nextChildFirstNode;
            break;
          } else {
            if (child.nextNode !== nextNode) {
              child.nextNode = nextNode;
              nextChild = child;
              j--;
            } else {
              break;
            }
          }
        }
      }
      while (i >= 0) {
        listIndex = invalidIndexes[i];
        child = children[listIndex];
        if (child.holder && child.holder !== this) {
          child.holder.invalidateContent(child);
        }
        child.holder = this;
        if (listIndex === childrenLength - 1) {
          child.nextNode = lastNextNode;
        } else {
          child.nextNode = children[listIndex + 1].firstNode || children[listIndex + 1].nextNode;
        }
        try {
          child.renderDom(child.baseComponent);
        } catch (_error) {
          e = _error;
          dc.onerror(e);
        }
        childNodes[listIndex] = child.node;
        nextNode = child.firstNode || nextNode;
        i--;
        if (listIndex > 0) {
          nextChild = children[listIndex];
          j = listIndex - 1;
          if (i >= 0) {
            listIndex = invalidIndexes[i];
          } else {
            listIndex = 0;
          }
          while (j >= listIndex) {
            child = children[j];
            if (nextChildFirstNode = children[j + 1].firstNode) {
              child.nextNode = nextChildFirstNode;
              break;
            } else {
              if (child.nextNode !== nextNode) {
                child.nextNode = nextNode;
                nextChild = child;
                j--;
              } else {
                break;
              }
            }
          }
        }
      }
      this.childFirstNode = children[0].firstNode || children[0].nextNode;
    }
    _ref2 = this.removingChildren;
    for (_ in _ref2) {
      child = _ref2[_];
      child.removeDom();
    }
    this.removingChildren = {};
    return childNodes;
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
        refChild = 0;
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
    var children, dcidIndexMap, i, index, invalidIndexes, length;
    children = this.children, dcidIndexMap = this.dcidIndexMap;
    length = children.length;
    if (isComponent(refChild)) {
      index = this.dcidIndexMap[refChild.dcid];
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
    this.invalidate();
    child = toComponent(child);
    children.splice(index, 0, child);
    updateDcidIndexMap(dcidIndexMap, children, index);
    if (this.node) {
      invalidIndexes = this.invalidIndexes;
      if (i = binarySearch(index, invalidIndexes)) {
        invalidIndexes.splice(i, 0, index);
        addIndexes(invalidIndexes, 1, i + 1);
      } else {
        invalidIndexes.push(index);
      }
    }
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
  removeChild: function(child) {
    var children, dcidIndexMap, index, invalidIndex, invalidIndexes, prevIndex;
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
    this.invalidate();
    child = children[index];
    child.markRemovingDom(true);
    substractSet(this.family, child.family);
    children.splice(index, 1);
    updateDcidIndexMap(dcidIndexMap, children, index);
    if (this.node) {
      invalidIndexes = this.invalidIndexes;
      invalidIndex = binarySearch(index, invalidIndexes);
      if (invalidIndexes[invalidIndex] === index) {
        invalidIndexes.splice(invalidIndex, 1);
        addIndexes(invalidIndexes, -1, index);
      }
      prevIndex = index - 1;
      if (prevIndex >= 0) {
        children[prevIndex].nextNode = child.nextNode;
      }
      this.childNodes.splice(index, 1);
      this.removingChildren[child.dcid] = child;
    }
    return this;
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
    this.invalidate();
    oldChild.markRemovingDom(true);
    newChild.parentNode = oldChild.parentNode;
    newChild.nextNode = oldChild.nextNode;
    substractSet(this.family, oldChild.family);
    extendChildFamily(this.family, newChild);
    if (this.node) {
      binaryInsert(index, this.invalidIndexes);
      this.removingChildren[oldChild.dcid] = oldChild;
    }
    return this;
  },
  setChildren: function(startIndex, newChildren) {
    var child, children, i, n, oldChildrenLength, _i, _len;
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
    var children, insertLocation, last;
    children = this.children;
    if (newLength >= children.length) {
      return this;
    } else {
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
  },
  invalidateContent: function(child) {
    this.valid = false;
    this.contentValid = false;
    this.node && binaryInsert(this.dcidIndexMap[child.dcid], this.invalidIndexes);
    return this.holder && this.holder.invalidateContent(this);
  }
};
