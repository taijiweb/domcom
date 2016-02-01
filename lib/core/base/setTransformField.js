module.exports = function(component, value, field) {
  component.__originalValue = value;
  if (typeof value === 'function') {
    if (!value.invalidate) {
      component[field] = renew(value);
    } else {
      component[field] = value;
    }
    return component[field].onInvalidate(function() {
      return component.invalidateTransform();
    });
  } else {
    return component[field] = value;
  }
};
