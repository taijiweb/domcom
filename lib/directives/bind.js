var domField, getBindProp;

getBindProp = dc.getBindProp, domField = dc.domField;

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, props, 'Props');
    return comp;
  };
};
