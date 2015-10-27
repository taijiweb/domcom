var domValue, getBindProp;

getBindProp = dc.getBindProp, domValue = dc.domValue;

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, props, 'Props');
    return comp;
  };
};
