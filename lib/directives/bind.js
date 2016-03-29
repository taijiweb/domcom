var getBindProp;

getBindProp = require('../dom-util').getBindProp;

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, props, 'Props');
    return comp;
  };
};
