exports.initChildren = function(component, children) {
  var child, family, i, _i, _len;
  if (isComponent(children)) {
    children = [children];
  }
  family = component.family;
  for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
    child = children[i];
    children[i] = child = toComponent(child);
    checkConflictOffspring(family, child);
    child.holder = component;
    dcidIndexMap[child.dcid] = i;
  }
  return component.children = children;
};

exports.createChildrenDom = function(component) {
  var child, children, firstNode, index, node;
  node = component.childNodes;
  component.invalidIndexes = [];
  component.removedChildren = {};
  children = component.children;
  index = children.length - 1;
  firstNode = null;
  while (index >= 0) {
    child = children[index];
    if (child.holder !== component) {
      child.invalidate();
      child.holder = component;
    }
    child.renderDom();
    node.unshift(child.node);
    firstNode = child.firstNode || firstNode;
    index && (children[index - 1].nextNode = firstNode || child.nextNode);
    index--;
  }
  component.childFirstNode = firstNode;
  return node;
};

exports.updateChildrenDom = function(component) {
  var child, childFirstNode, childNodes, children, i, invalidIndexes, listIndex, nextNode, _, _ref;
  invalidIndexes = component.invalidIndexes;
  if (invalidIndexes.length) {
    children = component.children;
    component.invalidIndexes = [];
    nextNode = component.nextNode, childNodes = component.childNodes;
    i = invalidIndexes.length - 1;
    children[children.length - 1].nextNode = component.childrenNextNode;
    childFirstNode = null;
    while (i >= 0) {
      listIndex = invalidIndexes[i];
      child = children[listIndex];
      if (child.holder !== component) {
        child.invalidate();
        child.holder = component;
      }
      child.renderDom();
      childNodes[listIndex] = child.node;
      childFirstNode = child.firstNode || nextNode;
      if (listIndex) {
        children[listIndex - 1].nextNode = childFirstNode;
      }
      i--;
    }
    while (listIndex >= 0) {
      child = children[listIndex];
      childFirstNode = child.firstNode || nextNode;
      listIndex--;
    }
    component.childFirstNode = childFirstNode;
  }
  _ref = component.removedChildren;
  for (_ in _ref) {
    child = _ref[_];
    child.removeDom();
  }
  component.removedChildren = {};
  return childNodes;
};
