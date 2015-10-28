var domField, getBindProp, _ref;

_ref = require("../dom-util"), getBindProp = _ref.getBindProp, domField = _ref.domField;

module.exports = function(binding) {
  return function(comp) {
    comp.setProp(getBindProp(comp), binding, props, 'Props');
    return comp;
  };
};
