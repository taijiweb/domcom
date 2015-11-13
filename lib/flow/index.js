var dependent, flow, funcString, newLine, react, renew, see, _ref,
  __slice = [].slice;

_ref = require('dc-util'), newLine = _ref.newLine, funcString = _ref.funcString;

react = function(method) {
  if (method.invalidate) {
    return method;
  }
  method.valid = false;
  method.invalidateCallbacks = [];
  method.onInvalidate = function(callback) {
    var invalidateCallbacks;
    invalidateCallbacks = method.invalidateCallbacks || (method.invalidateCallbacks = []);
    return invalidateCallbacks.push(callback);
  };
  method.offInvalidate = function(callback) {
    var index, invalidateCallbacks;
    invalidateCallbacks = method.invalidateCallbacks;
    if (!invalidateCallbacks) {
      return;
    }
    index = invalidateCallbacks.indexOf(callback);
    if (index < 0) {
      return;
    }
    invalidateCallbacks.splice(index, 1);
    if (!invalidateCallbacks.length) {
      return method.invalidateCallbacks = null;
    }
  };
  method.invalidate = function() {
    var callback, _i, _len, _ref1;
    if (!method.invalidateCallbacks) {
      return;
    }
    _ref1 = method.invalidateCallbacks;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      callback = _ref1[_i];
      callback();
    }
    method.valid = false;
  };
  return method;
};

renew = function(computation) {
  var method;
  method = function() {
    if (!arguments.length) {
      method.invalidate();
      return method.value = computation();
    } else {
      throw new Error('flow.renew is not allowed to accept arguments');
    }
  };
  method.toString = function() {
    return "renew: " + (funcString(computation));
  };
  return react(method);
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
  var cacheValue, computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
  for (_j = 0, _len = deps.length; _j < _len; _j++) {
    dep = deps[_j];
    if (typeof dep === 'function' && !dep.invalidate) {
      reactive = react(function() {
        reactive.invalidate();
        return computation();
      });
      return reactive;
    }
  }
  cacheValue = null;
  reactive = react(function() {
    if (!arguments.length) {
      if (!reactive.valid) {
        reactive.valid = true;
        return cacheValue = computation();
      } else {
        return cacheValue;
      }
    } else {
      throw new Error('flow.dependent is not allowed to accept arguments');
    }
  });
  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
    dep = deps[_k];
    if (dep && dep.onInvalidate) {
      dep.onInvalidate(reactive.invalidate);
    }
  }
  reactive.toString = function() {
    return "flow: [" + (((function() {
      var _l, _len2, _results;
      _results = [];
      for (_l = 0, _len2 = deps.length; _l < _len2; _l++) {
        dep = deps[_l];
        _results.push(dep.toString());
      }
      return _results;
    })()).join(',')) + "] --> " + (funcString(computation));
  };
  return reactive;
};

flow.pipe = function() {
  var computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
  for (_j = 0, _len = deps.length; _j < _len; _j++) {
    dep = deps[_j];
    if (typeof dep === 'function' && !dep.invalidate) {
      reactive = react(function() {
        var args, _k, _len1;
        reactive.invalidate();
        args = [];
        for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
          dep = deps[_k];
          if (typeof dep === 'function') {
            args.push(dep());
          } else {
            args.push(dep);
          }
        }
        return computation.apply(null, args);
      });
      return reactive;
    }
  }
  reactive = react(function() {
    var args, _k, _len1;
    args = [];
    for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
      dep = deps[_k];
      if (typeof dep === 'function') {
        args.push(dep());
      } else {
        args.push(dep);
      }
    }
    return computation.apply(null, args);
  });
  for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
    dep = deps[_k];
    if (dep && dep.onInvalidate) {
      dep.onInvalidate(reactive.invalidate);
    }
  }
  return reactive;
};

flow.react = react;

flow.renew = renew;

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

if (Object.defineProperty) {
  flow.bind = function(obj, attr, debugName) {
    var cacheValue, d, getter, set, setter;
    d = Object.getOwnPropertyDescriptor(obj, attr);
    if (d) {
      getter = d.get;
      set = d.set;
    }
    if (!getter || !getter.invalidate) {
      cacheValue = obj[attr];
      getter = function() {
        if (arguments.length) {
          throw new Error('should not set value on flow.bind');
        }
        return cacheValue;
      };
      setter = function(value) {
        if (value !== obj[attr]) {
          if (set) {
            set(value);
          }
          getter.invalidate();
          return cacheValue = value;
        }
      };
      react(getter);
      getter.toString = function() {
        return "" + (debugName || 'm') + "[" + attr + "]";
      };
      Object.defineProperty(obj, attr, {
        get: getter,
        set: setter
      });
    }
    return getter;
  };
  flow.duplex = function(obj, attr, debugName) {
    var cacheValue, d, get, method, set;
    d = Object.getOwnPropertyDescriptor(obj, attr);
    if (d) {
      get = d.get, set = d.set;
    }
    if (!set || !set.invalidate) {
      cacheValue = obj[attr];
      method = function(value) {
        if (!arguments.length) {
          return cacheValue;
        }
        if (value !== obj[attr]) {
          if (set) {
            set(value);
          }
          get && get.invalidate && get.invalidate();
          method.invalidate();
          return cacheValue = value;
        }
      };
      react(method);
      method.isDuplex = true;
      method.toString = function() {
        return "" + (debugName || 'm') + "[" + attr + "]";
      };
      Object.defineProperty(obj, attr, {
        get: method,
        set: method
      });
      return method;
    } else {
      return set;
    }
  };
} else {
  flow.bind = function(obj, attr, debugName) {
    var method, _dcBindMethodMap;
    _dcBindMethodMap = obj._dcBindMethodMap;
    if (!_dcBindMethodMap) {
      _dcBindMethodMap = obj._dcBindMethodMap = {};
    }
    if (!obj.dcSet$) {
      obj.dcSet$ = function(attr, value) {
        var _dcDuplexMethodMap;
        if (value !== obj[attr]) {
          _dcBindMethodMap && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
          return (_dcDuplexMethodMap = this._dcDuplexMethodMap) && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
        }
      };
    }
    method = _dcBindMethodMap[attr];
    if (!method) {
      method = _dcBindMethodMap[attr] = function() {
        return obj[attr];
      };
      method.toString = function() {
        return "" + (debugName || 'm') + "[" + attr + "]";
      };
      react(method);
    }
    return method;
  };
  flow.duplex = function(obj, attr, debugName) {
    var method, _dcDuplexMethodMap;
    _dcDuplexMethodMap = obj._dcDuplexMethodMap;
    if (!_dcDuplexMethodMap) {
      _dcDuplexMethodMap = obj._dcDuplexMethodMap = {};
    }
    if (!obj.dcSet$) {
      obj.dcSet$ = function(attr, value) {
        var _dcBindMethodMap;
        if (value !== obj[attr]) {
          (_dcBindMethodMap = this._dcBindMethodMap) && _dcBindMethodMap[attr] && _dcBindMethodMap[attr].invalidate();
          _dcDuplexMethodMap && _dcDuplexMethodMap[attr] && _dcDuplexMethodMap[attr].invalidate();
        }
        return value;
      };
    }
    method = _dcDuplexMethodMap[attr];
    if (!method) {
      method = _dcDuplexMethodMap[attr] = function(value) {
        if (!arguments.length) {
          return obj[attr];
        } else {
          return obj.dcSet$(attr, value);
        }
      };
      method.isDuplex = true;
      method.toString = function() {
        return "" + (debugName || 'm') + "[" + attr + "]";
      };
      react(method);
    }
    return method;
  };
}

flow.unary = function(x, unaryFn) {
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

flow.binary = function(x, y, binaryFn) {
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
