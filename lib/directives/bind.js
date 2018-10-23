var getBindProp;

({getBindProp} = require('../dom-util'));

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, comp.props, 'Props');
    return comp;
  };
};
