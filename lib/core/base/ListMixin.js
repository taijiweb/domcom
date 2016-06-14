var Nothing, addIndexes, binaryInsert, binarySearch, extendChildFamily, isArray, isComponent, setNextNodes, substractSet, toComponent, _ref, _ref1,
  __slice = [].slice;

_ref = require('dc-util'), isArray = _ref.isArray, substractSet = _ref.substractSet;

isComponent = require('./isComponent');

toComponent = require('./toComponent');

Nothing = require('./Nothing');

_ref1 = require('dc-util'), binarySearch = _ref1.binarySearch, binaryInsert = _ref1.binaryInsert, substractSet = _ref1.substractSet;

extendChildFamily = require('../../dom-util').extendChildFamily;

addIndexes = function(indexes, value, start) {
  var i, length;
  length = indexes.length;
  i = start;
  while (i < length) {
    indexes[i] += value;
    if (indexes[i] < 0) {
      throw 'negative attach index in ListMixin component';
    }
    i++;
  }
};

setNextNodes = function(children, nextNode, last, first) {
  var child, i;
  i = last;
  while (i >= first) {
    child = children[i];
    if (child.nextNode !== nextNode) {
      child.nextNode = nextNode;
      if (!child.firstNode) {
        i--;
        nextNode = child.firstNode;
      } else {
        break;
      }
    } else {
      break;
    }
  }
};

module.exports = {
  initListMixin: function() {
    var child, family, i, _i, _len, _ref2;
    this.updatingChildren = {};
    this.attachingChildren = {};
    this.attachParentIndexes = [];
    this.childNodes = [];
    this.family = family = {};
    family[this.dcid] = true;
    _ref2 = this.children;
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      child = _ref2[i];
      child.setHolder(this);
      extendChildFamily(family, child);
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
    var child, firstNode, firstNodeIndex, index, node, _i, _len, _ref2;
    node = this.childNodes;
    firstNode = null;
    this.updatingChildren = {};
    _ref2 = this.children;
    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
      child = _ref2[index];
      child.setHolder(this);
      child.renderDom(child.baseComponent);
      node.push(child.node);
      if (!firstNode && child.firstNode) {
        firstNode = child.firstNode;
        firstNodeIndex = index;
      }
    }
    this.childrenFirstNode = firstNode;
    this.firstNodeIndex = firstNodeIndex;
  },
  updateChildrenDom: function() {
    var child, children, index, node, updatingChildren, _;
    updatingChildren = this.updatingChildren;
    this.updatingChildren = {};
    node = this.childNodes;
    children = this.children;
    for (_ in updatingChildren) {
      child = updatingChildren[_];
      child.setHolder(this);
      child.renderDom(child.baseComponent);
      index = children.indexOf(child);
      node[index] = child.node;
      this.updateChildrenFirstNode(child, index);
    }
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
  pushChild: function() {
    var children, i, length, thisChildren;
    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    thisChildren = this.children;
    length = children.length;
    i = 0;
    while (i < length) {
      this.insertChild(thisChildren.length, children[i]);
      i++;
    }
    return this;
  },
  insertChild: function(refChild, child) {
    var children, index, length;
    children = this.children;
    length = children.length;
    if (isComponent(refChild)) {
      index = children.indexOf(refChild);
      if (index < 0) {
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
    child = toComponent(child);
    return this._insertChild(index, child);
  },
  _insertChild: function(index, child) {
    var attachParentIndexes, children, i;
    children = this.children;
    children.splice(index, 0, child);
    child.setHolder(this);
    child.parentNode = this.childParentNode;
    if (index === children.length - 1) {
      child.setNextNode(this.childrenNextNode);
    } else {
      child.setNextNode(children[index + 1].firstNode || children[index + 1].nextNode);
    }
    if (this.node) {
      this.childNodes.splice(index, 0, child.node);
      if (!child.node || !child.valid) {
        this.invalidateContent(child);
      }
      if (this.holder) {
        this.holder.invalidateAttach(this);
      }
      this.attachValid = false;
      attachParentIndexes = this.attachParentIndexes;
      i = binaryInsert(index, attachParentIndexes);
      addIndexes(attachParentIndexes, 1, i + 1);
      if (child.firstNode && (!this.childrenFirstNode || index <= this.firstNodeIndex)) {
        this.childrenFirstNode = child.firstNode;
        this.firstNodeIndex = index;
      }
    }
    return this;
  },
  unshiftChild: function() {
    var children, i;
    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    i = children.length - 1;
    while (i >= 0) {
      this.insertChild(0, children[i]);
      i--;
    }
    return this;
  },
  shiftChild: function() {
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
    var attachParentIndexes, childFirstNode, children, i, index;
    if (child == null) {
      dc.error('child to be removed is undefined');
    }
    children = this.children;
    if (isComponent(child)) {
      index = children.indexOf(child);
      if (index < 0) {
        dc.error('child to be removed is not in the children');
      }
    } else if (child >= children.length || child < 0) {
      dc.error('child to be removed is out of bound');
    } else {
      index = child;
      child = children[index];
    }
    this.invalidate();
    child = children[index];
    if (child.holder === this) {
      child.holder = null;
    }
    delete this.updatingChildren[child.dcid];
    substractSet(this.family, child.family);
    children.splice(index, 1);
    if (this.node) {
      this.childNodes.splice(index, 1);
      childFirstNode = child.firstNode;
      if (childFirstNode) {
        if (this.firstNodeIndex === index) {
          this.setFollowingChildrenFirstNode(index);
        }
        if (this.childParentNode && childFirstNode.parentNode === this.childParentNode) {
          this.propagateChildNextNode(index, this.nextNode);
          child.removeNode();
        }
      }
      attachParentIndexes = this.attachParentIndexes;
      if ((i = binarySearch(index, attachParentIndexes)) != null) {
        attachParentIndexes.splice(i, 1);
        addIndexes(attachParentIndexes, -1, i);
      }
    }
    return this;
  },
  invalidateAttachOnRemove: function(index, nextNode) {
    var child, children;
    children = this.children;
    index--;
    while (child = children[index]) {
      child.nextNode = nextNode;
      if (child.firstNode) {
        this.holder.invalidateAttach(this);
        return;
      } else {
        index--;
      }
    }
    if (this.isList && this.holder) {
      this.holder.invalidateAttachOnRemove(this, nextNode);
    }
  },
  setFollowingChildrenFirstNode: function(index) {
    var children, firstNode, length;
    children = this.children;
    length = children.length;
    index++;
    while (index < length) {
      if (firstNode = children[index].firstNode) {
        this.childrenFirstNode = firstNode;
        this.firstNodeIndex = index;
        return;
      }
      index++;
    }
    this.childrenFirstNode = null;
  },
  replaceChild: function(oldChild, newChild) {
    var children, index;
    children = this.children;
    if (isComponent(oldChild)) {
      index = children.indexOf(oldChild);
      if (index < 0) {
        dc.error('oldChild to be replaced is not in the children');
      }
    } else {
      if (oldChild >= children.length || oldChild < 0) {
        dc.error('oldChild to be replaced is out of bound');
      }
      index = oldChild;
      oldChild = children[index];
    }
    this.emit('onReplaceChild', index, oldChild, newChild);
    newChild = toComponent(newChild);
    return this._replaceChild(index, oldChild, newChild);
  },
  _replaceChild: function(index, oldChild, newChild) {
    var children;
    children = this.children;
    if (oldChild === newChild) {
      return this;
    }
    children[index] = newChild;
    if (oldChild.holder === this) {
      oldChild.holder = null;
    }
    oldChild.markRemovingDom(this);
    delete this.updatingChildren[oldChild.dcid];
    newChild.setHolder(this);
    newChild.parentNode = oldChild.parentNode;
    newChild.nextNode = oldChild.nextNode;
    substractSet(this.family, oldChild.family);
    extendChildFamily(this.family, newChild);
    if (this.node) {
      this.childNodes[index] = newChild.node;
      if (!newChild.node || !newChild.valid) {
        this.invalidateContent(newChild);
      }
      this.invalidateAttach(newChild);
      this.removingChildren[oldChild.dcid] = oldChild;
      this.updateChildrenFirstNode(newChild, index);
    }
    return this;
  },
  updateChildrenFirstNode: function(newChild, index) {
    if (this.childrenFirstNode) {
      if (newChild.firstNode) {
        if (index <= this.firstNodeIndex) {
          this.childrenFirstNode = newChild.firstNode;
          this.firstNodeIndex = index;
        }
      } else if (index === this.firstNodeIndex) {
        this.setFollowingChildrenFirstNode(index);
      }
    } else {
      if (newChild.firstNode) {
        this.childrenFirstNode = newChild.firstNode;
        this.firstNodeIndex = index;
      }
    }
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
    var children, last;
    children = this.children;
    if (newLength >= children.length) {
      return this;
    } else {
      last = children.length - 1;
      while (last >= newLength) {
        this.removeChild(last);
        last--;
      }
      return this;
    }
  },
  invalidateContent: function(child) {
    this.updatingChildren[child.dcid] = child;
    if (this.valid) {
      this.valid = false;
      this.holder && this.holder.invalidateContent(this);
    }
    return this;
  },
  attachChildren: function() {
    var childParentNode;
    childParentNode = this.childParentNode;
    if (!childParentNode || !this.attachValid) {
      this.attachValid = true;
      if (this.isList) {
        this.childParentNode = this.parentNode;
        this.childrenNextNode = this.nextNode;
      } else if (!this.childParentNode) {
        this.childParentNode = this.node;
        this.childrenNextNode = null;
      }
      if (this.childParentNode !== this.childNodes.parentNode) {
        if (!childParentNode) {
          this.emit('willAttach');
          this.attachEachChildren();
          this.emit('didAttach');
        }
      } else {
        this.attachInvalidChildren();
      }
    }
  },
  attachEachChildren: function() {
    var child, children, i, length, nextNode, parentNode;
    parentNode = this.childParentNode;
    children = this.children;
    if (length = children.length) {
      nextNode = this.childrenNextNode;
      i = length - 1;
      while (child = children[i]) {
        child.setHolder(this);
        child.parentNode = parentNode;
        child.setNextNode(nextNode);
        child.attachParent();
        nextNode = child.firstNode || nextNode;
        i--;
      }
      child = children[0];
      this.childNodes.parentNode = parentNode;
    }
  },
  attachInvalidChildren: function() {
    var attachParentIndexes, child, children, i, listIndex, nextNode, parentNode, prevIndex;
    attachParentIndexes = this.attachParentIndexes;
    if (attachParentIndexes.length) {
      this.attachParentIndexes = [];
      if (parentNode = this.childParentNode) {
        nextNode = this.childrenNextNode;
        children = this.children;
        i = attachParentIndexes.length - 1;
        prevIndex = children.length - 1;
        while (i >= 0) {
          listIndex = attachParentIndexes[i];
          setNextNodes(children, nextNode, prevIndex, listIndex);
          child = children[listIndex];
          child.setHolder(this);
          child.parentNode = parentNode;
          child.attachParent();
          nextNode = child.firstNode || child.nextNode;
          prevIndex = listIndex - 1;
          i--;
        }
        setNextNodes(children, nextNode, prevIndex, 0);
        this.childNodes.parentNode = parentNode;
      }
    }
  },
  propagateChildNextNode: function(child, nextNode) {
    var children, index;
    children = this.children;
    if (isComponent(child)) {
      index = children.indexOf(child) - 1;
    } else {
      index = child - 1;
    }
    while (child = children[index]) {
      child.setNextNode(nextNode);
      if (child.firstNode) {
        return;
      }
      index--;
    }
    if (!this.isTag && this.holder) {
      this.holder.propagateChildNextNode(this, nextNode);
    }
  }
};
