var ddescribe, expect, idescribe, iit, isComponent, ndescribe, nit, _ref;

_ref = require('bdd-test-helper'), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

isComponent = dc.isComponent;

module.exports = function(testModule, description, singleTestName, unmount) {
  if (unmount == null) {
    unmount = true;
  }
  return describe(description, function() {
    var name, value, _results;
    if (singleTestName) {
      return iit('should ' + singleTestName, function() {
        var value;
        value = testModule[singleTestName];
        if (typeof value === 'function') {
          value = value();
        }
        if (isComponent(value)) {
          value.mount();
          value.render();
          if (unmount) {
            return value.unmount();
          }
        }
      });
    } else {
      _results = [];
      for (name in testModule) {
        value = testModule[name];
        _results.push((function(name, value) {
          return it('should ' + name, function() {
            if (typeof value === 'function') {
              value = value();
            }
            if (isComponent(value)) {
              value.mount();
              value.render();
              if (unmount) {
                return value.unmount();
              }
            }
          });
        })(name, value));
      }
      return _results;
    }
  });
};
