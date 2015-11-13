exports.newDemoNode = function(id) {
  var node;
  node = document.createElement('div');
  document.body.appendChild(node);
  id && node.setAttribute('id', id);
  return node;
};
