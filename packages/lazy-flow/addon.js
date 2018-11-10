var binary, bind, duplex, flow, react, see, unary, _ref;

_ref = require('lazy-flow'), react = _ref.react, see = _ref.see, bind = _ref.bind, duplex = _ref.duplex, flow = _ref.flow, unary = _ref.unary, binary = _ref.binary;

module.exports = flow;

flow.bindings = function(model, name) {
  var key, result;
  result = {};
  for (key in model) {
    result[key + '$'] = duplex(model, key, name);
    result[key + '_'] = bind(model, key, name);
  }
  return result;
};

flow.seeAttrs = function(target, from) {
  var attr, key, value;
  for (key in from) {
    value = from[key];
    attr = target[key];
    if (typeof attr === 'function') {
      attr(value);
    } else {
      target[key] = see(value);
    }
  }
  return target;
};

flow.neg = function(x) {
  return unary(x, function(x) {
    return -x;
  });
};

flow.not = function(x) {
  return unary(x, function(x) {
    return !x;
  });
};

flow.bitnot = function(x) {
  return unary(x, function(x) {
    return ~x;
  });
};

flow.reciprocal = function(x) {
  return unary(x, function(x) {
    return 1 / x;
  });
};

flow.abs = function(x) {
  return unary(x, Math.abs);
};

flow.floor = function(x) {
  return unary(x, Math.floor);
};

flow.ceil = function(x) {
  return unary(x, Math.ceil);
};

flow.round = function(x) {
  return unary(x, Math.round);
};

flow.add = function(x, y) {
  return binary(x, y, function(x, y) {
    return x + y;
  });
};

flow.sub = function(x, y) {
  return binary(x, y, function(x, y) {
    return x - y;
  });
};

flow.mul = function(x, y) {
  return binary(x, y, function(x, y) {
    return x * y;
  });
};

flow.div = function(x, y) {
  return binary(x, y, function(x, y) {
    return x / y;
  });
};

flow.min = function(x, y) {
  return binary(x, y, function(x, y) {
    return Math.min(x, y);
  });
};

flow.max = function(x, y) {
  return binary(x, y, function(x, y) {
    return Math.max(x, y);
  });
};

flow.and = function(x, y) {
  return binary(x, y, function(x, y) {
    return x && y;
  });
};

flow.or = function(x, y) {
  return binary(x, y, function(x, y) {
    return x || y;
  });
};

flow.funcAttr = function(obj, attr) {
  return flow(obj, attr, function(value) {
    var objValue;
    objValue = obj();
    if (objValue == null) {
      return objValue;
    }
    if (!arguments.length) {
      return objValue[attr];
    } else {
      return objValue[attr] = value;
    }
  });
};

flow.toggle = function(x) {
  return x(!x());
};

flow.if_ = function(test, then_, else_) {
  if (typeof test !== 'function') {
    if (test) {
      return then_;
    } else {
      return else_;
    }
  } else if (!test.invalidate) {
    if (typeof then_ === 'function' && typeof else_ === 'function') {
      return function() {
        if (test()) {
          return then_();
        } else {
          return else_();
        }
      };
    } else if (then_ === 'function') {
      return function() {
        if (test()) {
          return then_();
        } else {
          return else_;
        }
      };
    } else if (else_ === 'function') {
      return function() {
        if (test()) {
          return then_;
        } else {
          return else_();
        }
      };
    } else if (test()) {
      return then_;
    } else {
      return else_;
    }
  } else {
    if (typeof then_ === 'function' && typeof else_ === 'function') {
      if (then_.invalidate && else_.invalidate) {
        return flow(test, then_, else_, function() {
          if (test()) {
            return then_();
          } else {
            return else_();
          }
        });
      } else {
        return function() {
          if (test()) {
            return then_();
          } else {
            return else_();
          }
        };
      }
    } else if (typeof then_ === 'function') {
      if (then_.invalidate) {
        return flow(test, then_, (function() {
          if (test()) {
            return then_();
          } else {
            return else_;
          }
        }));
      } else {
        return function() {
          if (test()) {
            return then_();
          } else {
            return else_;
          }
        };
      }
    } else if (typeof else_ === 'function') {
      if (else_.invalidate) {
        return flow(else_, (function() {
          if (test()) {
            return then_;
          } else {
            return else_();
          }
        }));
      } else {
        return function() {
          if (test()) {
            return then_;
          } else {
            return else_();
          }
        };
      }
    } else {
      return flow(test, function() {
        if (test()) {
          return then_;
        } else {
          return else_;
        }
      });
    }
  }
};

flow.thisBind = function(field) {
  var method;
  method = react(function() {
    return this[field];
  });
  method.bindComponent = function(component) {
    var bound;
    bound = flow.bind(component, field);
    bound.onInvalidate(function() {
      method.valid = true;
      return method.invalidate();
    });
    return method;
  };
  return method;
};
