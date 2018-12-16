//export default
var exports;

module.exports = exports = {};

exports.newDemoNode = function(id) {
  var node;
  node = document.createElement('div');
  document.body.appendChild(node);
  id && node.setAttribute('id', id);
  return node;
};

exports.fakeEvent = function(targetNode, type = 'click', keyCodeOrOptions) {
  if (typeof keyCodeOrOptions === 'number') {
    return {
      target: targetNode,
      type,
      keyCode: keyCodeOrOptions,
      preventDefault: function() {},
      stopPropagation: function() {}
    };
  } else {
    return Object.assign({
      target: targetNode,
      type,
      preventDefault: function() {},
      stopPropagation: function() {}
    }, keyCodeOrOptions);
  }
};

export default exports;
