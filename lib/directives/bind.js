var getBindProp;

getBindProp = require('../dom-util').getBindProp;

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, comp.props, 'Props');
    return comp;
  };
};
