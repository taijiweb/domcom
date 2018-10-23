var extend;

extend = require('extend');

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
    return extend({
      target: targetNode,
      type,
      preventDefault: function() {},
      stopPropagation: function() {}
    }, keyCodeOrOptions);
  }
};
