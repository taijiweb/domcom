var elementPool, nodeCount, nodeCountMax, poolLabelLimit;

elementPool = {};

nodeCount = 0;

nodeCountMax = 500;

poolLabelLimit = {};

exports.createElement = function(namespace, tagName, poolLabel) {
  var label, node, nodes;
  if (namespace == null) {
    namespace = '';
  }
  if (tagName == null) {
    tagName = 'div';
  }
  if (poolLabel) {
    label = tagName + ':' + poolLabel;
    if (nodes = elementPool[label]) {
      node = nodes.pop();
      nodeCount--;
      return node;
    }
  }
  if (namespace) {
    return document.createElementNS(namespace || '', tagName);
  } else {
    return document.createElement(tagName);
  }
};

exports.cacheElement = function(element, poolLabel) {
  var label, labelMax, nodes;
  if (nodeCount < nodeCountMax) {
    label = element.tagName.toLowerCase() + ':' + poolLabel;
    labelMax = poolLabelLimit[label] || 10;
    nodes = elementPool[label] || (elementPool[label] = []);
    if (nodes.length < labelMax) {
      nodes.push(element);
      return nodeCount++;
    }
  }
};
