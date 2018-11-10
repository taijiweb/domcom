var flow, funcString, lazy, newLine, react, renew, see, _ref,
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
    if (typeof callback !== 'function') {
      throw new Error("call back should be a function");
    } else {
      invalidateCallbacks = method.invalidateCallbacks || (method.invalidateCallbacks = []);
      return invalidateCallbacks.push(callback);
    }
  };
  method.offInvalidate = function(callback) {
    var index, invalidateCallbacks;
    invalidateCallbacks = method.invalidateCallbacks;
    if (invalidateCallbacks && (index = invalidateCallbacks.indexOf(callback)) >= 0) {
      invalidateCallbacks.splice(index, 1);
      if (!invalidateCallbacks.length) {
        method.invalidateCallbacks = null;
      }
    }
    return method;
  };
  method.invalidate = function() {
    var callback, _i, _len, _ref1;
    if (method.valid && method.invalidateCallbacks) {
      _ref1 = method.invalidateCallbacks;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        callback = _ref1[_i];
        callback();
      }
      method.valid = false;
    }
    return method;
  };
  return method;
};

renew = function(computation) {
  var method;
  method = function() {
    var value;
    if (!arguments.length) {
      value = computation.call(this);
      method.valid = true;
      method.invalidate();
      return value;
    } else {
      throw new Error('flow.renew is not allowed to accept arguments');
    }
  };
  method.toString = function() {
    return "renew: " + (funcString(computation));
  };
  return react(method);
};

lazy = function(method) {
  var oldToString;
  react(method);
  method.invalidate = function() {
    var callback, _i, _len, _ref1;
    if (method.invalidateCallbacks) {
      _ref1 = method.invalidateCallbacks;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        callback = _ref1[_i];
        callback();
      }
    }
    return method;
  };
  oldToString = method.toString;
  method.toString = function() {
    return "lazy: " + (oldToString.call(method));
  };
  return method;
};

module.exports = flow = function() {
  var cacheValue, computation, dep, deps, reactive, _i, _j, _k, _len, _len1;
  deps = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), computation = arguments[_i++];
  if (!deps.length) {
    return lazy(computation);
  }
  for (_j = 0, _len = deps.length; _j < _len; _j++) {
    dep = deps[_j];
    if (typeof dep === 'function' && !dep.invalidate) {
      return renew(computation);
    }
  }
  cacheValue = null;
  reactive = react(function(value) {
    if (!arguments.length) {
      if (!reactive.valid) {
        reactive.valid = true;
        return cacheValue = computation.call(this);
      } else {
        return cacheValue;
      }
    } else {
      if (value === cacheValue) {
        return value;
      } else {
        cacheValue = computation.call(this, value);
        reactive.invalidate();
        return cacheValue;
      }
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
        var args, result, _k, _len1;
        if (arguments.length) {
          throw new Error("flow.pipe is not allow to have arguments");
        }
        args = [];
        for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
          dep = deps[_k];
          if (typeof dep === 'function') {
            args.push(dep());
          } else {
            args.push(dep);
          }
        }
        result = computation.apply(this, args);
        reactive.valid = true;
        reactive.invalidate();
        return result;
      });
      return reactive;
    }
  }
  reactive = react(function() {
    var args, _k, _len1;
    reactive.valid = true;
    args = [];
    for (_k = 0, _len1 = deps.length; _k < _len1; _k++) {
      dep = deps[_k];
      if (typeof dep === 'function') {
        args.push(dep());
      } else {
        args.push(dep);
      }
    }
    return computation.apply(this, args);
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

flow.lazy = lazy;

flow.renew = renew;

flow.flow = flow;

flow.see = see = function(value, transform) {
  var cacheValue, method;
  cacheValue = value;
  method = function(value) {
    if (!arguments.length) {
      method.valid = true;
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
    var d, getter, set, setter;
    d = Object.getOwnPropertyDescriptor(obj, attr);
    if (d) {
      getter = d.get;
      set = d.set;
    }
    if (!getter || !getter.invalidate) {
      getter = function() {
        if (arguments.length) {
          throw new Error('should not set value on flow.bind');
        }
        getter.valid = true;
        return getter.cacheValue;
      };
      getter.cacheValue = obj[attr];
      setter = function(value) {
        if (value !== obj[attr]) {
          if (set) {
            set.call(obj, value);
          }
          getter.cacheValue = value;
          getter.invalidate();
          return value;
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
    var d, get, method, set;
    d = Object.getOwnPropertyDescriptor(obj, attr);
    if (d) {
      get = d.get, set = d.set;
    }
    if (!set || !set.invalidate) {
      method = function(value) {
        if (!arguments.length) {
          method.valid = true;
          return method.cacheValue;
        }
        if (value !== obj[attr]) {
          if (set) {
            set.call(obj, value);
          }
          get && get.invalidate && get.invalidate();
          method.cacheValue = value;
          method.invalidate();
          return value;
        }
      };
      method.cacheValue = obj[attr];
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
        method.valid = true;
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
          method.valid = true;
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
