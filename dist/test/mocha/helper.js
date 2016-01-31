var extend;

extend = require('extend');

exports.newDemoNode = function(id) {
  var node;
  node = document.createElement('div');
  document.body.appendChild(node);
  id && node.setAttribute('id', id);
  return node;
};

exports.fakeEvent = function(targetNode, type, keyCodeOrOptions) {
  if (type == null) {
    type = 'click';
  }
  if (typeof keyCodeOrOptions === 'number') {
    return {
      target: targetNode,
      type: type,
      keyCode: keyCodeOrOptions,
      preventDefault: function() {},
      stopPropagation: function() {}
    };
  } else {
    return extend({
      target: targetNode,
      type: type,
      preventDefault: function() {},
      stopPropagation: function() {}
    }, keyCodeOrOptions);
  }
};
