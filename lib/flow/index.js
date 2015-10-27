var binary, bind, dependent, flow, funcString, newLine, react, see, unary, _ref,
  __slice = [].slice;

_ref = require('../util'), newLine = _ref.newLine, funcString = _ref.funcString;

react = function(method) {
  var invalidateCallbacks;
  method.valid = false;
  invalidateCallbacks = [];
  method.onInvalidate = function(callback) {
    invalidateCallbacks = invalidateCallbacks || [];
    return invalidateCallbacks.push(callback);
  };
  method.offInvalidate = function(callback) {
    var index;
    if (!invalidateCallbacks) {
      return;
    }
    index = invalidateCallbacks.indexOf(callback);
    if (index < 0) {
      return;
    }
    invalidateCallbacks.splice(index, 1);
    if (!invalidateCallbacks) {
      return invalidateCallbacks = null;
    }
  };
  method.invalidate = function() {
    var callback, _i, _len;
    if (!invalidateCallbacks) {
      return;
    }
    for (_i = 0, _len = invalidateCallbacks.length; _i < _len; _i++) {
      callback = invalidateCallbacks[_i];
      callback();
    }
    method.valid = false;
  };
  return method;
};

dependent = function(computation) {
  var cacheValue, method;
  cacheValue = null;
  method = function() {
    if (!arguments.length) {
      if (!method.valid) {
        method.valid = true;
        return cacheValue = computation();
      } else {
        return cacheValue;
      }
    } else {
      throw new Error('flow.dependent is not allowed to accept arguments');
    }
  };
  method.toString = function() {
    return "dependent: " + (funcString(computation));
  };
  return react(method);
};

module.exports = flow = function() {
  var computation, dep, deps, reactive, _i, _j, _len;
  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
  if (!computation.invalidate) {
    reactive = dependent(computation);
    reactive.toString = function() {
      var dep;
      return "flow: [" + (((function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = deps.length; _j < _len; _j++) {
          dep = deps[_j];
          _results.push(dep.toString());
        }
        return _results;
      })()).join(',')) + "] --> " + (funcString(computation));
    };
  } else {
    reactive = computation;
  }
  for (_j = 0, _len = deps.length; _j < _len; _j++) {
    dep = deps[_j];
    if (dep && dep.onInvalidate) {
      dep.onInvalidate(reactive.invalidate);
    }
  }
  return reactive;
};

flow.pipe = function() {
  var computation, dep, deps, reactive, _i, _j, _len;
  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
  reactive = react(function() {
    var dep;
    return computation.apply(null, (function() {
      var _j, _len, _results;
      _results = [];
      for (_j = 0, _len = deps.length; _j < _len; _j++) {
        dep = deps[_j];
        _results.push(dep());
      }
      return _results;
    })());
  });
  for (_j = 0, _len = deps.length; _j < _len; _j++) {
    dep = deps[_j];
    if (dep && dep.onInvalidate) {
      dep.onInvalidate(reactive.invalidate);
    }
  }
  return reactive;
};

flow.react = react;

flow.dependent = dependent;

flow.flow = flow;

flow.see = see = function(value, transform) {
  var cacheValue, method;
  cacheValue = value;
  method = function(value) {
    if (!arguments.length) {
      return cacheValue;
    } else {
      value = transform ? transform(value) : value;
      if (value !== cacheValue) {
        cacheValue = value;
        method.invalidate();
      }
      return value;
    }
  };
  method.isDuplex = true;
  method.toString = function() {
    return "see: " + value;
  };
  return react(method);
};

flow.seeN = function() {
  var computation, computations, _i, _len, _results;
  computations = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _results = [];
  for (_i = 0, _len = computations.length; _i < _len; _i++) {
    computation = computations[_i];
    _results.push(see(computation));
  }
  return _results;
};

flow.renew = function(computation) {
  var method;
  method = function() {
    if (!arguments.length) {
      method.invalidate();
      return method.value = computation();
    } else {
      throw new Error('flow.dynamic is not allowed to accept arguments');
    }
  };
  method.toString = function() {
    return "renew: " + (funcString(computation));
  };
  return react(method);
};

flow.bind = bind = function(obj, attr, name) {
  var cacheValue, d, get, method, set;
  d = Object.getOwnPropertyDescriptor(obj, attr);
  if (d) {
    get = d.get, set = d.set;
  }
  if (!set || !set.invalidate) {
    cacheValue = obj[attr];
    method = function(value) {
      if (!arguments.length) {
        if (get) {
          return get();
        } else {
          return cacheValue;
        }
      } else if (value !== obj[attr]) {
        if (set) {
          set(value);
        }
        method.invalidate();
        return cacheValue = value;
      }
    };
    react(method);
    Object.defineProperty(obj, attr, {
      get: method,
      set: method
    });
  } else {
    method = set;
  }
  method.toString = function() {
    return "" + (name || 'm') + "[" + attr + "]";
  };
  return method;
};

flow.duplex = function(obj, attr, name) {
  var reactive;
  reactive = bind(obj, attr);
  reactive.isDuplex = true;
  reactive.toString = function() {
    return "" + (name || 'm') + "[" + attr + "]";
  };
  return reactive;
};

flow.unary = unary = function(x, unaryFn) {
  if (typeof x !== 'function') {
    return unaryFn(x);
  } else if (x.invalidate) {
    return flow(x, function() {
      return unaryFn(x());
    });
  } else {
    return function() {
      return unaryFn(x());
    };
  }
};

flow.binary = binary = function(x, y, binaryFn) {
  if (typeof x === 'function' && typeof y === 'function') {
    if (x.invalidate && y.invalidate) {
      return flow(x, y, function() {
        return binaryFn(x(), y());
      });
    } else {
      return function() {
        return binaryFn(x(), y());
      };
    }
  } else if (typeof x === 'function') {
    if (x.invalidate) {
      return flow(x, function() {
        return binaryFn(x(), y);
      });
    } else {
      return function() {
        return binaryFn(x(), y);
      };
    }
  } else if (typeof y === 'function') {
    if (y.invalidate) {
      return flow(y, function() {
        return binaryFn(x, y());
      });
    } else {
      return function() {
        return binaryFn(x, y());
      };
    }
  } else {
    return binaryFn(x, y);
  }
};
