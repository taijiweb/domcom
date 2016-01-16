exports.newDemoNode = function(id) {
  var node;
  node = document.createElement('div');
  document.body.appendChild(node);
  id && node.setAttribute('id', id);
  return node;
};

exports.fakeEvent = function(targetNode, type) {
  if (type == null) {
    type = 'click';
  }
  return {
    target: targetNode,
    type: type,
    preventDefault: function() {},
    stopPropagation: function() {}
  };
};
