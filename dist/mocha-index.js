/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************************!*\
  !*** ./test/mocha/index.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	dc.alwaysRender = true;

	__webpack_require__(/*! lazy-flow/test-flow */ 1);

	__webpack_require__(/*! lazy-flow-at/test-at */ 7);

	__webpack_require__(/*! ./test-property */ 9);

	__webpack_require__(/*! ./test-toString */ 10);

	__webpack_require__(/*! ./test-dc */ 11);

	__webpack_require__(/*! ./test-base-component */ 12);

	__webpack_require__(/*! ./test-component */ 15);

	__webpack_require__(/*! ./test-directive */ 16);

	__webpack_require__(/*! ./test-singleton */ 17);

	__webpack_require__(/*! ./test-merge-if */ 18);

	__webpack_require__(/*! ./test-group */ 19);

	__webpack_require__(/*! ./test-ref-clone */ 20);

	__webpack_require__(/*! ./test-event */ 21);

	__webpack_require__(/*! ./test-route */ 22);

	__webpack_require__(/*! ./test-for-demo */ 23);


/***/ },
/* 1 */
/*!*************************************!*\
  !*** ../lazy-flow/test-flow.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var bind, bindings, ddescribe, duplex, expect, flow, idescribe, iit, ndescribe, nit, renew, see, seeAttrs, _ref, _ref1, _ref2;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	_ref1 = __webpack_require__(/*! lazy-flow */ 4), see = _ref1.see, bind = _ref1.bind, duplex = _ref1.duplex, renew = _ref1.renew, flow = _ref1.flow;

	_ref2 = __webpack_require__(/*! ./addon */ 6), bindings = _ref2.bindings, seeAttrs = _ref2.seeAttrs;

	describe('reactive flow', function() {
	  it('should see', function() {
	    var r;
	    r = see(1);
	    expect(r()).to.equal(1);
	    expect(r(2)).to.equal(2);
	    return expect(r()).to.equal(2);
	  });
	  it('should renew', function() {
	    var r, x;
	    x = 1;
	    r = renew((function() {
	      return x;
	    }), true);
	    expect(r()).to.equal(1);
	    expect(function() {
	      return r(2);
	    }).to["throw"]();
	    x = 2;
	    return expect(r()).to.equal(2);
	  });
	  it('should flow', function() {
	    var r1, r2, r3;
	    r1 = see(1);
	    r2 = see(2);
	    r3 = flow(r1, r2, function() {
	      return r1() + r2();
	    });
	    expect(r3()).to.equal(3);
	    r1(2);
	    return expect(r3()).to.equal(4);
	  });
	  it('should flow unary', function() {
	    var a_, b_, r, _ref3;
	    _ref3 = bindings({
	      a: 4,
	      b: 2
	    }), a_ = _ref3.a_, b_ = _ref3.b_;
	    r = flow.neg(a_);
	    expect(r()).to.equal(-4, 'neg');
	    r = flow.not(a_);
	    expect(r()).to.equal(false, 'not');
	    r = flow.abs(flow.neg(a_));
	    expect(r()).to.equal(4, 'abs neg');
	    r = flow.bitnot(a_);
	    return expect(r()).to.equal(-5, 'bitnot');
	  });
	  it('should flow binary', function() {
	    var a_, b_, r, _ref3;
	    _ref3 = bindings({
	      a: 4,
	      b: 2
	    }), a_ = _ref3.a_, b_ = _ref3.b_;
	    r = flow.add(a_, b_);
	    expect(r()).to.equal(6, 'add');
	    r = flow.sub(a_, b_);
	    expect(r()).to.equal(2, 'sub');
	    r = flow.mul(a_, b_);
	    expect(r()).to.equal(8, 'mul');
	    r = flow.div(a_, b_);
	    return expect(r()).to.equal(2, 'div');
	  });
	  it('should invalidate flow binary', function() {
	    var a, b, r;
	    a = see(1);
	    b = see(2);
	    r = flow.add(a, b);
	    expect(r()).to.equal(3, 'add');
	    a(3);
	    return expect(r()).to.equal(5, 'add 2');
	  });
	  it('should invalidate bind flow binary', function() {
	    var a, b, m, r;
	    m = {
	      a: 1,
	      b: 2
	    };
	    a = bind(m, 'a', 'm');
	    b = bind(m, 'b', 'm');
	    r = flow.add(a, b);
	    expect(r()).to.equal(3, 'add');
	    expect(function() {
	      return a(3);
	    }).to["throw"]();
	    return expect(r()).to.equal(3, 'add 2');
	  });
	  it('should bind', function() {
	    var a, a2, m;
	    m = {
	      a: 1
	    };
	    a = bind(m, 'a');
	    a2 = bind(m, 'a');
	    expect(a()).to.equal(1);
	    expect(a2()).to.equal(1, 'a2');
	    expect(function() {
	      return a(3);
	    }).to["throw"]();
	    expect(a()).to.equal(1, 'a again');
	    return expect(a2()).to.equal(1, 'a2 again');
	  });
	  it('should process bindings', function() {
	    var a$, a_, _ref3;
	    _ref3 = bindings({
	      a: 1
	    }), a$ = _ref3.a$, a_ = _ref3.a_;
	    a$(3);
	    return expect(a_()).to.equal(3);
	  });
	  it('should process multiple bind and duplex on same object and attr', function() {
	    var a1, a2, b1, b2, m, sum;
	    m = {
	      a: 1,
	      b: 2
	    };
	    a1 = duplex(m, 'a');
	    b1 = duplex(m, 'b');
	    a2 = duplex(m, 'a');
	    b2 = duplex(m, 'b');
	    sum = flow.add(a1, b1);
	    expect(sum()).to.equal(3, 'sum 1');
	    expect(sum.valid).to.equal(true, 'valid 1');
	    a2(3);
	    expect(sum.valid).to.equal(false, 'valid 2');
	    expect(sum()).to.equal(5, 'sum 2');
	    sum = flow.add(a2, b2);
	    expect(sum()).to.equal(5, 'sum 3');
	    expect(sum.valid).to.equal(true, 'valid 3');
	    a2(1);
	    expect(sum.valid).to.equal(false, 'valid 4');
	    return expect(sum()).to.equal(3, 'sum 4');
	  });
	  return it('should seeAttrs', function() {
	    var a, b;
	    a = {};
	    b = {
	      x: 1
	    };
	    seeAttrs(a, b);
	    expect(typeof a.x).to.equal('function');
	    expect(a.x()).to.equal(1);
	    b = {
	      x: 2
	    };
	    seeAttrs(a, b);
	    expect(typeof a.x).to.equal('function');
	    return expect(a.x()).to.equal(2);
	  });
	});


/***/ },
/* 2 */
/*!***********************************!*\
  !*** ../bdd-test-helper/index.js ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var chai;

	if (typeof window === 'undefined') {
	  chai = __webpack_require__(/*! chai */ 3);
	} else {
	  chai = window.chai;
	}

	exports.expect = chai.expect;

	exports.iit = it.only;

	exports.idescribe = describe.only;

	exports.nit = function() {};

	exports.ndescribe = function() {};

	exports.ddescribe = function(desc, test) {
	  return test();
	};


/***/ },
/* 3 */
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/***/ function(module, exports) {

	module.exports = chai;

/***/ },
/* 4 */
/*!*****************************!*\
  !*** ../lazy-flow/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var flow, funcString, lazy, newLine, react, renew, see, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! dc-util */ 5), newLine = _ref.newLine, funcString = _ref.funcString;

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
	  method.toString = function() {
	    return "lazy: " + (funcString(method));
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


/***/ },
/* 5 */
/*!***************************!*\
  !*** ../dc-util/index.js ***!
  \***************************/
/***/ function(module, exports) {

	var dupStr, globalDcid, hasOwn, isArray,
	  __slice = [].slice;

	exports.isArray = isArray = function(item) {
	  return Object.prototype.toString.call(item) === '[object Array]';
	};

	exports.isObject = function(item) {
	  return typeof item === 'object' && item !== null;
	};

	exports.cloneObject = function(obj) {
	  var key, result;
	  result = {};
	  for (key in obj) {
	    result[key] = obj[key];
	  }
	  return result;
	};

	exports.pairListDict = function() {
	  var i, keyValuePairs, len, result;
	  keyValuePairs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (keyValuePairs.length === 1) {
	    keyValuePairs = keyValuePairs[0];
	  }
	  len = keyValuePairs.length;
	  i = 0;
	  result = {};
	  while (i < len) {
	    result[keyValuePairs[i]] = keyValuePairs[i + 1];
	    i += 2;
	  }
	  return result;
	};

	dupStr = function(str, n) {
	  var i, s;
	  s = '';
	  i = 0;
	  while (i++ < n) {
	    s += str;
	  }
	  return s;
	};

	exports.newLine = function(str, indent, addNewLine) {
	  if (addNewLine) {
	    return '\n' + dupStr(' ', indent) + str;
	  } else {
	    return str;
	  }
	};

	exports.funcString = function(fn) {
	  var e, s;
	  if (typeof fn !== 'function') {
	    if (fn == null) {
	      return 'null';
	    }
	    if (fn.getBaseComponent) {
	      return fn.toString();
	    } else {
	      try {
	        return JSON.stringify(fn);
	      } catch (_error) {
	        e = _error;
	        return fn.toString();
	      }
	    }
	  }
	  s = fn.toString();
	  if (fn.invalidate) {
	    return s;
	  }
	  if (s.slice(0, 12) === "function (){") {
	    s = s.slice(12, s.length - 1);
	  } else if (s.slice(0, 13) === "function () {") {
	    s = s.slice(13, s.length - 1);
	  } else {
	    s = s.slice(9);
	  }
	  s = s.trim();
	  if (s.slice(0, 7) === 'return ') {
	    s = s.slice(7);
	  }
	  if (s[s.length - 1] === ';') {
	    s = s.slice(0, s.length - 1);
	  }
	  return 'fn:' + s;
	};

	globalDcid = 1;

	exports.newDcid = function() {
	  return globalDcid++;
	};

	exports.isEven = function(n) {
	  if (n < 0) {
	    n = -n;
	  }
	  while (n > 0) {
	    n -= 2;
	  }
	  return n === 0;
	};

	exports.matchCurvedString = function(str, i) {
	  var ch, level;
	  if (str[i] !== '(') {
	    return;
	  }
	  level = 0;
	  while (ch = str[++i]) {
	    if (ch === '\\') {
	      if (!(ch = str[++i])) {
	        return;
	      }
	    } else if (ch === '(') {
	      level++;
	    } else if (ch === ')') {
	      if (level === 0) {
	        return ++i;
	      } else {
	        level--;
	      }
	    }
	  }
	};

	exports.intersect = function(maps) {
	  var isMember, key, m, m2, result, _i, _len, _ref;
	  result = {};
	  m = maps[0];
	  for (key in m) {
	    isMember = true;
	    _ref = maps.slice(1);
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      m2 = _ref[_i];
	      if (!m2[key]) {
	        isMember = false;
	        break;
	      }
	    }
	    isMember && (result[key] = m[key]);
	  }
	  return result;
	};

	exports.substractSet = function(whole, unit) {
	  var key;
	  for (key in unit) {
	    delete whole[key];
	  }
	  return whole;
	};

	exports.binarySearch = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] >= item) {
	      return 0;
	    } else {
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] >= item) {
	        return index;
	      } else {
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      return index + 1;
	    }
	  }
	};

	exports.binaryInsert = function(item, items) {
	  var end, index, length, start;
	  length = items.length;
	  if (!length) {
	    items[0] = item;
	    return 0;
	  }
	  if (length === 1) {
	    if (items[0] === item) {
	      return 0;
	    } else if (items[0] > item) {
	      items[1] = items[0];
	      items[0] = item;
	      return 0;
	    } else {
	      items[1] = item;
	      return 1;
	    }
	  }
	  start = 0;
	  end = length - 1;
	  while (1) {
	    index = start + Math.floor((end - start) / 2);
	    if (start === end) {
	      if (items[index] === item) {
	        return index;
	      } else if (items[index] > item) {
	        items.splice(index, 0, item);
	        return index;
	      } else {
	        items.splice(index + 1, 0, item);
	        return index + 1;
	      }
	    } else if (item === items[index]) {
	      return index;
	    }
	    if (item === items[index + 1]) {
	      return index + 1;
	    } else if (item < items[index]) {
	      end = index;
	    } else if (item > items[index + 1]) {
	      start = index + 1;
	    } else {
	      items.splice(index + 1, 0, item);
	      return index + 1;
	    }
	  }
	};

	exports.foreach = function(items, callback) {
	  var i, item, key, result, _i, _len;
	  if (!items) {
	    return;
	  }
	  if (isArray(items)) {
	    result = [];
	    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
	      item = items[i];
	      result.push(callback(item, i));
	    }
	  } else {
	    result = {};
	    for (key in items) {
	      item = items[key];
	      result[key] = callback(item, key);
	    }
	  }
	  return result;
	};

	hasOwn = Object.hasOwnProperty;

	exports.mixin = function(proto, mix) {
	  var key, value;
	  for (key in mix) {
	    value = mix[key];
	    if (hasOwn.call(proto, key)) {
	      continue;
	    } else {
	      proto[key] = value;
	    }
	  }
	  return proto;
	};

	exports.makeReactMap = function(description) {
	  var field, item, items, pair, reactField, result, _i, _j, _len, _len1, _ref;
	  result = {};
	  items = description.split(/\s*,\s*/);
	  for (_i = 0, _len = items.length; _i < _len; _i++) {
	    item = items[_i];
	    pair = item.trim().split(/\s*:\s*/);
	    if (pair.length === 1) {
	      result[pair[0]] = '';
	    } else {
	      reactField = pair[1];
	      _ref = pair[0].split(/\s+/);
	      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
	        field = _ref[_j];
	        result[field] = reactField;
	      }
	    }
	  }
	  return result;
	};


/***/ },
/* 6 */
/*!*********************************!*\
  !*** ../lazy-flow/addon.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var binary, bind, duplex, flow, react, see, unary, _ref;

	_ref = __webpack_require__(/*! lazy-flow */ 4), react = _ref.react, see = _ref.see, bind = _ref.bind, duplex = _ref.duplex, flow = _ref.flow, unary = _ref.unary, binary = _ref.binary;

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


/***/ },
/* 7 */
/*!**************************************!*\
  !*** ../lazy-flow-at/test-at.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var ddescribe, expect, flow, idescribe, iit, ndescribe, nit, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	flow = __webpack_require__(/*! ./index */ 8);

	describe('lazy-flow-at', function() {
	  it('should process flow.at', function() {
	    var called, m, path1;
	    m = {};
	    path1 = flow.at(m, 'x.y');
	    expect(path1()).to.equal(void 0);
	    called = false;
	    path1.onInvalidate(function() {
	      return called = true;
	    });
	    path1(1);
	    expect(called).to.equal(true);
	    expect(path1()).to.equal(1);
	    expect(m.x.y).to.equal(1);
	    called = false;
	    m.x = {};
	    expect(called).to.equal(true);
	    return expect(m.x.y).to.equal(void 0);
	  });
	  return it('should process flow.at without root', function() {
	    var path1, root;
	    window.x = void 0;
	    path1 = flow.at('x.y');
	    expect(path1()).to.equal(void 0);
	    path1(1);
	    expect(path1()).to.equal(1);
	    if (typeof window !== 'undefined') {
	      root = window;
	    } else {
	      root = global;
	    }
	    return expect(root.x.y).to.equal(1);
	  });
	});

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/*!************************************!*\
  !*** ../lazy-flow-at/index.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var atMethod, bind, duplex, flow, funcString, invalidateBindPath, newLine, react, _ref, _ref1;

	_ref = __webpack_require__(/*! dc-util */ 5), newLine = _ref.newLine, funcString = _ref.funcString;

	_ref1 = flow = __webpack_require__(/*! lazy-flow */ 4), bind = _ref1.bind, duplex = _ref1.duplex, react = _ref1.react;

	module.exports = flow;

	atMethod = function(method) {
	  return function(root, path) {
	    var len, reactive;
	    if (arguments.length === 1) {
	      path = root;
	      if (typeof window !== 'undefined') {
	        root = window;
	      } else {
	        root = global;
	      }
	    }
	    if (typeof path === 'string') {
	      path = path.split(/\.\s*/);
	    }
	    if (!path.length) {
	      return root;
	    }
	    if (typeof root !== 'object') {
	      throw new Error('expect an object as the root of flow.at');
	    }
	    len = path.length;
	    if (len === 0) {
	      return root;
	    }
	    reactive = react(function(value) {
	      var i, item, parent;
	      if (arguments.length) {
	        i = 0;
	        parent = root;
	        while (i < len - 1) {
	          item = parent[path[i]];
	          if (item == null) {
	            item = parent[path[i]] = {};
	          } else if (typeof parent !== 'object') {
	            throw new Error('expect an object');
	          }
	          parent = item;
	          i++;
	        }
	        parent[path[i]] = value;
	        if (reactive.cacheValue !== value) {
	          reactive.cacheValue = value;
	          reactive.invalidate();
	          reactive.valid = false;
	        }
	        return value;
	      } else {
	        reactive.valid = true;
	        i = 0;
	        item = root;
	        while (i < len) {
	          if (!item) {
	            return;
	          }
	          item = item[path[i]];
	          i++;
	        }
	        return reactive.cacheValue = item;
	      }
	    });
	    if (method === duplex) {
	      reactive.isDuplex = true;
	    }
	    return invalidateBindPath(root, path, reactive, method);
	  };
	};

	invalidateBindPath = function(root, path, atFunc, method) {
	  var attr, bound, i, len, parent;
	  len = path.length;
	  if (!len) {
	    return atFunc;
	  }
	  parent = root;
	  i = 0;
	  while (i < len) {
	    if (!parent) {
	      return;
	    }
	    attr = path[i];
	    bound = method(parent, attr);
	    bound.onInvalidate(function() {
	      invalidateBindPath(parent[attr], path.slice(i + 1), atFunc);
	      return atFunc.invalidate();
	    });
	    i++;
	  }
	  return atFunc;
	};

	flow.at = atMethod(bind);

	flow.at2 = atMethod(duplex);

	flow.paths = function(obj, pathPattern) {
	  var flowPaths, head, item, itemList, length, pathList, pathList2, paths, x, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref2;
	  itemList = pathPattern.split(/\s*\.\s*/);
	  paths = [];
	  for (_i = 0, _len = itemList.length; _i < _len; _i++) {
	    item = itemList[_i];
	    if (item[0] === '[') {
	      length = item.length;
	      if (item[item.length - 1] !== ']') {
	        throw new Error("wrong format of pathPattern for flow.paths, expect string like 'x.y, '[x, y].z', 'x.[y,z]' ...");
	      }
	      item = item.slice(1, length - 1);
	      paths.push(item.split(/\s*\.\s*|\s+/));
	    } else {
	      paths.push([item]);
	    }
	  }
	  pathList = paths[0];
	  _ref2 = paths.slice(1);
	  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	    item = _ref2[_j];
	    pathList2 = [];
	    for (_k = 0, _len2 = pathList.length; _k < _len2; _k++) {
	      head = pathList[_k];
	      for (_l = 0, _len3 = path.length; _l < _len3; _l++) {
	        x = path[_l];
	        pathList2.push(head.concat([x]));
	      }
	    }
	    pathList = pathList2;
	  }
	  flowPaths = [];
	  for (_m = 0, _len4 = pathList.length; _m < _len4; _m++) {
	    item = pathList[_m];
	    flowPaths.push(at(obj, item));
	  }
	  return flowPaths;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 9 */
/*!*****************************************!*\
  !*** ./test/mocha/test-property.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, a, attrToPropName, bind, checkbox, classFn, ddescribe, div, duplex, expect, extendAttrs, func, hide, idescribe, if_, iit, li, list, model, ndescribe, nit, options, p, see, show, span, splitter, styleFrom, text, util, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	util = dc.util, bind = dc.bind, duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, attrToPropName = dc.attrToPropName, extendAttrs = dc.extendAttrs, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, checkbox = dc.checkbox, model = dc.model, show = dc.show, hide = dc.hide, splitter = dc.splitter, options = dc.options;

	describe('domcom/properties/utilities', function() {
	  it('styleFrom', function() {
	    var x;
	    x = styleFrom("display:none; zIndex:100; backgroundColor:white;");
	    return expect(x).to.deep.equal({
	      display: 'none',
	      zIndex: '100',
	      backgroundColor: 'white'
	    });
	  });
	  it('attrToPropName', function() {
	    var x;
	    x = attrToPropName("background-color");
	    return expect(x).to.equal('backgroundColor');
	  });
	  it('cssAdd 1', function() {
	    var comp, result;
	    comp = p({
	      style: {
	        width: '1px'
	      }
	    });
	    result = comp.cssAdd('width', 2);
	    expect(result).to.equal(comp);
	    return expect(comp.css('width')).to.equal('3px');
	  });
	  it('cssAdd 2', function() {
	    var comp, result;
	    comp = p({
	      style: {
	        width: '0.5%'
	      }
	    });
	    result = comp.cssAdd('width', 3.6);
	    expect(result).to.equal(comp);
	    return expect(comp.css('width')).to.equal('4.1%');
	  });
	  return it('cssMul', function() {
	    var comp, result;
	    comp = p({
	      style: {
	        width: '2px'
	      }
	    });
	    result = comp.cssMul('width', 3);
	    expect(result).to.equal(comp);
	    return expect(comp.css('width')).to.equal('6px');
	  });
	});

	describe('domcom/properties/extendAttrs', function() {
	  it('extendAttrs({class{a:1}}, className({b:1})', function() {
	    var attrs;
	    attrs = extendAttrs({
	      "class": {
	        a: 1
	      }
	    }, {
	      className: {
	        b: 1
	      }
	    });
	    return expect(classFn(attrs.className).call()).to.equal("a b");
	  });
	  return it('extendAttrs({style:{width:1}}, {style:{height:2}})', function() {
	    var attrs;
	    attrs = extendAttrs({
	      style: {
	        width: 1
	      }
	    }, {
	      style: {
	        height: 2
	      }
	    });
	    expect(attrs.style.width).to.equal(1);
	    return expect(attrs.style.height).to.equal(2);
	  });
	});

	describe("domcom/properties/classFn", function() {
	  it('get value of classFn', function() {
	    var active, x;
	    active = see(true);
	    x = classFn([
	      'a', {
	        b: active
	      }
	    ]);
	    expect(x()).to.equal('a b');
	    active(false);
	    return expect(x()).to.equal('a');
	  });
	  it('should compute valid', function() {
	    var x;
	    x = classFn(['a']);
	    expect(x.valid).to.equal(false);
	    expect(x()).to.equal('a');
	    expect(x.valid).to.equal(true);
	    x.extend('a');
	    expect(x.valid).to.equal(true);
	    expect(x()).to.equal('a');
	    x.extend('b');
	    expect(x.valid).to.equal(false);
	    expect(x()).to.equal('a b');
	    x.extend('!b');
	    expect(x.valid).to.equal(false);
	    return expect(x()).to.equal('a');
	  });
	  return it('should get class property in component', function() {
	    var active, comp;
	    active = see(true);
	    comp = div({
	      "class": {
	        a: 1,
	        b: active
	      }
	    });
	    expect(comp.className.call(comp)).to.equal('a b', 'first');
	    comp.className = classFn({
	      a: 1,
	      b: active
	    });
	    expect(comp.className.valid).to.equal(false, 'className.valid 1');
	    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 1');
	    comp.mount();
	    expect(comp.className.valid).to.equal(true, 'className.valid 2');
	    expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties 2');
	    expect(comp.node.className).to.equal('a b', 'second');
	    active(false);
	    expect(comp.className.valid).to.equal(false, 'className.valid 3');
	    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties 3');
	    comp.render();
	    return expect(comp.node.className).to.equal('a', '3');
	  });
	});

	describe('domcom/properties/create', function() {
	  return it('should create properties', function() {
	    var comp;
	    comp = p({
	      value: bind({
	        a: 1
	      }, 'a')
	    });
	    expect(comp.className.valid).to.equal(true, 'className.valid');
	    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	    comp.mount();
	    return expect(comp.node.value).to.equal(1);
	  });
	});

	describe('domcom/properties/event', function() {
	  it('click event ', function() {
	    var comp, x;
	    x = 1;
	    comp = a({
	      onclick: function() {
	        return x = 2;
	      }
	    }, 'click me');
	    comp.mount('#demo');
	    comp.node.onclick({
	      type: 'click'
	    });
	    return expect(x).to.equal(2);
	  });
	  it('multiple handlers for one event', function() {
	    var $a, comp, spy1, x;
	    $a = duplex(x = {
	      a: 1
	    }, 'a');
	    spy1 = sinon.spy();
	    comp = text({
	      onchange: spy1,
	      $model: $a
	    });
	    comp.mount();
	    comp.node.value = 2;
	    comp.node.onchange({
	      type: 'change'
	    });
	    expect(spy1.called).to.equal(true);
	    return expect(x.a).to.equal('2');
	  });
	  return it('multiple handlers with bind value', function() {
	    var $a, comp, spy1, x;
	    $a = duplex(x = {
	      a: 1
	    }, 'a');
	    spy1 = sinon.spy();
	    comp = text({
	      onchange: spy1
	    }, $a);
	    comp.mount();
	    comp.node.value = 2;
	    comp.node.onchange({
	      type: 'change'
	    });
	    expect(spy1.called).to.equal(true);
	    return expect(x.a).to.equal('2');
	  });
	});

	describe('domcom/properties/style', function() {
	  it('should set style property with string value', function() {
	    var comp, elm;
	    comp = a({
	      style: "border:red 1px solid"
	    }, 'red 1px solid');
	    expect(comp.className.valid).to.equal(true, 'className.valid');
	    expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	    elm = comp.mount('#demo');
	    return expect(comp.node.style.border).to.equal("1px solid red");
	  });
	  it('should set style property', function() {
	    var comp, elm;
	    comp = a({
	      style: {
	        border: "red 1px solid"
	      }
	    }, 'red 1px solid');
	    elm = comp.mount('#demo');
	    return expect(comp.node.style.border).to.equal("1px solid red");
	  });
	  it('value of property of style could be dc expression', function() {
	    var comp, elm;
	    comp = a({
	      style: {
	        border: function() {
	          return "red 1px solid";
	        }
	      }
	    }, 'red 1px solid');
	    elm = comp.mount('#demo');
	    return expect(comp.node.style.border).to.equal("1px solid red");
	  });
	  return nit('change style dynamically', function() {
	    var color, comp, handle, i, i$, paddingColor, styleFn;
	    paddingColor = function(hexStr) {
	      if (!(hexStr.match(/^\d/))) {
	        return hexStr;
	      }
	      while (hexStr.length < 6) {
	        hexStr = '0' + hexStr;
	      }
	      return '#' + hexStr;
	    };
	    color = see("red");
	    i$ = see(i = 0);
	    comp = a({
	      style: {
	        borderWidth: flow(i$, function() {
	          return i$() + "px";
	        }),
	        borderStyle: "solid",
	        borderColor: flow(color, function() {
	          return paddingColor(color().toString(16));
	        })
	      }
	    }, 'dynamic property');
	    comp.mount('#demo');
	    color = 0;
	    styleFn = function() {
	      color += 0x111111;
	      i$(i++);
	      comp.render();
	      if (i === 50) {
	        return clearInterval(handle);
	      }
	    };
	    return handle = setInterval(styleFn, 5);
	  });
	});

	describe('domcom/properties/bind checkbox', function() {
	  return it('bidirectional bind checkbox', function() {
	    var bb, cbx, model1;
	    dc.directives({
	      $model: dc.$model
	    });
	    model1 = {
	      a: 1
	    };
	    bb = duplex(model1, 'a');
	    cbx = checkbox({
	      $model: bb
	    });
	    cbx.mount('#demo');
	    expect(cbx.node.onchange).to.be.defined;
	    cbx.node.checked = true;
	    cbx.node.onchange({
	      type: 'change'
	    });
	    return expect(model1.a).to.equal(true);
	  });
	});


/***/ },
/* 10 */
/*!*****************************************!*\
  !*** ./test/mocha/test-toString.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, ddescribe, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	flow = dc.flow, bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('toString', function() {
	  it('should toString list of if(tag)', function() {
	    var comp, pIf, t1, x;
	    x = 0;
	    comp = list(t1 = text({
	      onchange: function() {
	        x = parseInt(this.node.value);
	        return comp.render();
	      }
	    }, x), pIf = if_((function() {
	      return x;
	    }), div(1), div(2)));
	    return expect(comp.toString()).to.match(/<List>\n  <input type="text" value=0>/);
	  });
	  it('should toString  tag with props', function() {
	    var comp, x;
	    x = 0;
	    comp = div({
	      value: 1
	    }, 1);
	    return expect(comp.toString()).to.equal('<div value=1>1</div>');
	  });
	  it('should case.toString', function() {
	    var comp;
	    comp = case_((function() {
	      return x;
	    }), {
	      1: p(1),
	      2: p(2),
	      3: p(3)
	    }, 'others');
	    return expect(comp.toString()).to.equal('<Case renew: fn:x>\n  1: <p>1</p>\n  2: <p>2</p>\n  3: <p>3</p>\n  "others"\n</Case>');
	  });
	  return it('should flow.add(a_, b_).toString', function() {
	    var a_, b_, r, _ref1;
	    _ref1 = bindings({
	      a: 1,
	      b: 2
	    }), a_ = _ref1.a_, b_ = _ref1.b_;
	    r = flow.add(a_, b_);
	    return expect(r.toString()).to.equal('flow: [m[a],m[b]] --> fn:binaryFn(x(), y())');
	  });
	});


/***/ },
/* 11 */
/*!***********************************!*\
  !*** ./test/mocha/test-dc.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-component
	 */
	var expect, idescribe, iit, isComponent, ndescribe, nit, rinterval, rtimeout, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, rtimeout = _ref.rtimeout, rinterval = _ref.rinterval;

	isComponent = dc.isComponent;

	describe("test dc", function() {
	  return describe('dc(document)', function() {
	    it('dc(document) should be Component', function() {
	      return expect(!isComponent(dc(document))).to.equal(true);
	    });
	    nit('should cache DomComponent', function() {
	      return expect(dc(document)).to.equal(dc(document));
	    });
	    return it('dc(document).bind should be a function', function() {
	      var x;
	      x = 0;
	      return dc(document).bind('onclick', function() {
	        return x = 1;
	      });
	    });
	  });
	});


/***/ },
/* 12 */
/*!***********************************************!*\
  !*** ./test/mocha/test-base-component.coffee ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Html, List, Nothing, Tag, Text, a_, bindings, classFn, div, expect, html, idescribe, iit, list, ndescribe, newDemoNode, nit, p, see, styleFrom, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 13).newDemoNode;

	bindings = dc.bindings, see = dc.see, Tag = dc.Tag, Text = dc.Text, List = dc.List, txt = dc.txt, list = dc.list, p = dc.p, div = dc.div, Html = dc.Html, html = dc.html, classFn = dc.classFn, styleFrom = dc.styleFrom, Nothing = dc.Nothing;

	a_ = bindings({
	  a: 1,
	  b: 2
	}).a_;

	describe("test-base-component", function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('update baseComponent', function() {
	    it('should get baseComponent of List', function() {
	      var comp;
	      comp = list([1, 2]);
	      return expect(comp.baseComponent).to.equal(comp);
	    });
	    return it('should have correct children', function() {
	      var comp;
	      comp = p(0);
	      return expect(comp.children[0].text).to.equal(0);
	    });
	  });
	  describe('process get baseComponent of Tag', function() {
	    it('should get baseComponent of two tags', function() {
	      var d, p1;
	      p1 = new Tag('p', {}, []);
	      d = new Tag('div', {}, [p1]);
	      expect(d.baseComponent).to.equal(d);
	      expect(d.children[0]).to.be["instanceof"](Tag);
	      expect(d.children[0]).to.equal(p1);
	      d.mount();
	      return expect(d.baseComponent.baseComponent).to.equal(d);
	    });
	    return it('should text.valid to be true', function() {
	      var comp;
	      comp = txt(1);
	      comp.mount();
	      return expect(!!comp.valid).to.equal(true);
	    });
	  });
	  describe('process creatDom', function() {
	    it('should creatDom of p(1)', function() {
	      var comp;
	      comp = p(1);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should creatDom of p(->1)', function() {
	      var comp;
	      comp = p(function() {
	        return 1;
	      });
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should creatDom of p(p(p(t=txt(->1))))', function() {
	      var comp, t;
	      comp = p(p(p(t = txt(function() {
	        return 1;
	      }))));
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('<p><p>1</p></p>');
	    });
	    it('should mount Text with text is 0', function() {
	      var n;
	      n = new Text(0);
	      n.mount();
	      return expect(n.node.textContent).to.equal('0');
	    });
	    it('should mount tag', function() {
	      p = new Tag('p', {}, []);
	      p.mount();
	      return expect(p.node.tagName).to.equal('P');
	    });
	    it('should mount pre with property', function() {
	      var comp;
	      comp = new Tag('pre', {
	        attr_space: ''
	      }, []);
	      comp.mount();
	      expect(comp.node.tagName).to.equal('PRE');
	      return expect(comp.node.getAttribute('space')).to.equal('');
	    });
	    it('should mount tag with attribute', function() {
	      p = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, []);
	      p.mount();
	      expect(p.node.className).to.equal('some class');
	      return expect(p.node.getAttribute('className')).to.equal(null);
	    });
	    it('process bind as value', function() {
	      var comp;
	      comp = new Tag('input', {
	        type: 'text',
	        value: a_
	      }, [new Text(a_)]);
	      comp.mount();
	      return expect(comp.node.value).to.equal('1');
	    });
	    it('tag shoud mount with multiple children ', function() {
	      var comp, t1, t2, t3;
	      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3)]);
	      expect(comp.children.length).to.equal(3);
	      comp.mount();
	      return expect(comp.node.childNodes.length).to.equal(3);
	    });
	    it('tag shoud mount with Nothing child', function() {
	      var comp, t1, t2, t3, t4;
	      comp = new Tag('p', {}, [t1 = new Text(1), t2 = new Text(2), t3 = new Text(3), t4 = new Nothing()]);
	      expect(comp.children.length).to.equal(4);
	      comp.mount();
	      return expect(comp.node.childNodes.length).to.equal(3);
	    });
	    it('should create tag with children', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      comp.mount();
	      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
	    });
	    it('should mount tag 2', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      comp.mount();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    it('should mount for tag with children', function() {
	      var comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')]), new Text(function() {})]);
	      comp.mount();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    return it('should mount list with children', function() {
	      var comp;
	      comp = new List([
	        new Tag('span', {}, [new Text('adf')]), new Text(function() {
	          return void 0;
	        })
	      ]);
	      comp.mount();
	      return expect(comp.node[0].tagName).to.equal('SPAN');
	    });
	  });
	  return describe('process Html', function() {
	    it('should process Html.node.component', function() {
	      var comp, demoNode, str;
	      str = see('');
	      comp = html(str);
	      demoNode = newDemoNode();
	      comp.mount(demoNode);
	      expect(demoNode.innerHTML).to.equal('<div></div>');
	      return expect(comp.node.component).to.equal(comp);
	    });
	    it('should mount html component', function() {
	      var comp, demoNode, s;
	      comp = new Html(s = '<div>1</div><p>2</p>');
	      comp.mount(demoNode = newDemoNode());
	      return expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p></div>');
	    });
	    it('should mount html component with transform', function() {
	      var comp, demoNode, s;
	      comp = new Html(s = '<div>1</div><p>2</p>', function(text) {
	        return text + 'a';
	      });
	      comp.mount(demoNode = newDemoNode());
	      return expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p>a</div>');
	    });
	    it('should mount html component with reactive function', function() {
	      var comp, demoNode, str;
	      str = see('<div>1</div><p>2</p>');
	      comp = new Html(str, function(text) {
	        return text + 'a';
	      });
	      comp.mount(demoNode = newDemoNode());
	      expect(demoNode.innerHTML).to.equal('<div><div>1</div><p>2</p>a</div>');
	      str('x');
	      comp.render();
	      expect(demoNode.innerHTML).to.equal('<div>xa</div>', 'update 1');
	      comp.render();
	      return expect(demoNode.innerHTML).to.equal('<div>xa</div>', 'update 2');
	    });
	    it('should Html.bind', function() {
	      var comp, demoNode, str, x;
	      str = see('');
	      comp = html(str);
	      comp.mount(demoNode = newDemoNode());
	      x = 1;
	      comp.bind('click', function() {
	        return x = 2;
	      });
	      comp.node.onclick({
	        type: 'click'
	      });
	      return expect(x).to.equal(2);
	    });
	    return it('should Html.text setter', function() {
	      var comp, str;
	      str = see('');
	      comp = html(str);
	      comp.mount();
	      comp.text = 'x';
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('x');
	    });
	  });
	});


/***/ },
/* 13 */
/*!**********************************!*\
  !*** ./test/mocha/helper.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var extend;

	extend = __webpack_require__(/*! extend */ 14);

	exports.newDemoNode = function(id) {
	  var node;
	  node = document.createElement('div');
	  document.body.appendChild(node);
	  id && node.setAttribute('id', id);
	  return node;
	};

	exports.fakeEvent = function(targetNode, type, keyCodeOrOptions) {
	  if (type == null) {
	    type = 'click';
	  }
	  if (typeof keyCodeOrOptions === 'number') {
	    return {
	      target: targetNode,
	      type: type,
	      keyCode: keyCodeOrOptions,
	      preventDefault: function() {},
	      stopPropagation: function() {}
	    };
	  } else {
	    return extend({
	      target: targetNode,
	      type: type,
	      preventDefault: function() {},
	      stopPropagation: function() {}
	    }, keyCodeOrOptions);
	  }
	};


/***/ },
/* 14 */
/*!**************************!*\
  !*** ../extend/index.js ***!
  \**************************/
/***/ function(module, exports) {

	var hasOwn = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var undefined;

	var isArray = function isArray(arr) {
		if (typeof Array.isArray === 'function') {
			return Array.isArray(arr);
		}

		return toStr.call(arr) === '[object Array]';
	};

	var isPlainObject = function isPlainObject(obj) {
		'use strict';
		if (!obj || toStr.call(obj) !== '[object Object]') {
			return false;
		}

		var has_own_constructor = hasOwn.call(obj, 'constructor');
		var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
		// Not own constructor property must be Object
		if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		var key;
		for (key in obj) {}

		return key === undefined || hasOwn.call(obj, key);
	};

	module.exports = function extend() {
		'use strict';
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0],
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
			target = {};
		}

		for (; i < length; ++i) {
			options = arguments[i];
			// Only deal with non-null/undefined values
			if (options != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};



/***/ },
/* 15 */
/*!******************************************!*\
  !*** ./test/mocha/test-component.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, bindings, button, classFn, ddescribe, div, duplex, expect, flow, func, idescribe, if_, iit, input, li, list, ndescribe, newDemoNode, nit, p, span, styleFrom, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	newDemoNode = __webpack_require__(/*! ./helper */ 13).newDemoNode;

	bindings = dc.bindings, duplex = dc.duplex, flow = dc.flow, classFn = dc.classFn, styleFrom = dc.styleFrom, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	describe("test-component", function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('construct component', function() {
	    it('component shoud have children', function() {
	      var comp;
	      comp = p({}, [1, 2]);
	      return expect(comp.children.length).to.equal(2);
	    });
	    it('should construct component', function() {
	      var d, p1;
	      p1 = new Tag('p', {}, []);
	      d = new Tag('div', {}, [p1]);
	      return expect(d.children[0]).to.equal(p1);
	    });
	    it('tag shoud have children 1', function() {
	      var comp;
	      comp = new Tag('span', {}, [new Text('adf')]);
	      return expect(comp.children[0].text).to.equal('adf');
	    });
	    return it('tag shoud have children 2', function() {
	      var comp, span1;
	      span1 = new Tag('span', {}, [new Text('adf')]);
	      comp = new Tag('div', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [span1]);
	      return expect(comp.children[0]).to.equal(span1);
	    });
	  });
	  describe('component.create', function() {
	    it('should create tag', function() {
	      var comp;
	      comp = p();
	      comp.mount();
	      expect(comp.node.tagName).to.equal('P');
	      return expect(comp.node.innerHTML).to.equal('');
	    });
	    it('should mount tag 1', function() {
	      var comp;
	      comp = new Tag('div', {}, []);
	      comp.mount();
	      return expect(comp.node.tagName).to.equal('DIV');
	    });
	    it('should correctly create TextNode with 0 as content', function() {
	      var comp;
	      comp = txt(0);
	      comp.mount();
	      return expect(comp.node.textContent).to.equal('0');
	    });
	    it('should correctly create tag with 0 as content', function() {
	      var comp;
	      comp = p(0);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('0');
	    });
	    it('should mount Text with flow value', function() {
	      var a_, b_, comp, _ref1;
	      _ref1 = bindings({
	        a: 1,
	        b: 2
	      }), a_ = _ref1.a_, b_ = _ref1.b_;
	      comp = txt(flow.add(a_, b_));
	      comp.mount('#demo');
	      return expect(comp.node.textContent).to.equal('3', 'mount');
	    });
	    it('should not run event hanlder while creating tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick({
	        type: 'click'
	      });
	      return expect(spy.called).to.equal(true);
	    });
	    it('should process event name without on', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick({
	        type: 'click'
	      });
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick({
	        type: 'click'
	      });
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering button tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = button({
	        id: "search-ok",
	        type: "submit",
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick({
	        type: 'click'
	      });
	      return expect(spy.called).to.equal(true);
	    });
	    it('should not run event hanlder while rendering div > button tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = div(button({
	        id: "search-ok",
	        type: "submit",
	        onclick: spy
	      }));
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.children[0].node.onclick({
	        type: 'click'
	      });
	      return expect(spy.called).to.equal(true);
	    });
	    it('should create tag with attribute', function() {
	      var comp, elm;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, []);
	      comp.mount();
	      elm = comp.node;
	      expect(elm.className).to.equal('some class');
	      return expect(elm.getAttribute('className')).to.equal(null);
	    });
	    it('should process function value of text', function() {
	      var a_, comp, elm;
	      a_ = bindings({
	        a: 1
	      }).a_;
	      comp = text(a_);
	      elm = comp.mount();
	      elm = comp.node;
	      return expect(elm.value).to.equal('1');
	    });
	    it('component shoud have children 2', function() {
	      var comp;
	      comp = span('adf');
	      return expect(comp.children[0].text).to.equal('adf');
	    });
	    it('should create tag with children', function() {
	      var comp, span1;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, span1 = span(['adf']));
	      expect(comp.children[0]).to.equal(span1);
	      comp.mount();
	      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
	    });
	    it('should mount tag 2', function() {
	      var comp, elm;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, [span(['adf'])]);
	      elm = comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node.parentNode.id).to.equal('demo');
	    });
	    it('should mount tag with undefined as child', function() {
	      var comp;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, span(['adf']), txt(function() {}));
	      comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node.parentNode.id).to.equal('demo');
	    });
	    return it('should mount list with undefined as child', function() {
	      var comp, elm;
	      comp = list(span(['adf']), txt(function() {
	        return void 0;
	      }));
	      elm = comp.mount('#demo');
	      expect(comp.parentNode.id).to.equal('demo');
	      return expect(comp.node[0].parentNode.id).to.equal('demo');
	    });
	  });
	  return describe('component update', function() {
	    it('should render tag 1', function() {
	      var comp, count;
	      count = 1;
	      comp = new Tag('p', {}, [
	        new Text(function() {
	          return count;
	        })
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      ++count;
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('2', 'update 2');
	      ++count;
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('3', 'update 3');
	    });
	    it('should update bidirectional bind', function() {
	      var a$, comp;
	      a$ = bindings({
	        a: 1
	      }).a$;
	      comp = new Tag('input', {
	        value: a$
	      }, []);
	      comp.mount();
	      return expect(comp.node.value).to.equal("1");
	    });
	    it('should render tag 2', function() {
	      var comp, count, elm;
	      count = 1;
	      comp = p(txt(function() {
	        return count;
	      }));
	      comp.mount();
	      elm = comp.node;
	      expect(elm.innerHTML).to.equal('1');
	      ++count;
	      comp.render();
	      expect(elm.innerHTML).to.equal('2');
	      ++count;
	      comp.render();
	      return expect(elm.innerHTML).to.equal('3');
	    });
	    it('should process text with bind', function() {
	      var a_, b_, comp, _ref1;
	      _ref1 = bindings({
	        a: 1,
	        b: 2
	      }), a_ = _ref1.a_, b_ = _ref1.b_;
	      comp = p(txt(flow.add(a_, b_)));
	      comp.mount('#demo');
	      expect(comp.node.innerHTML).to.equal('3', 'mount');
	      a_(3);
	      b_(4);
	      expect(a_()).to.equal(3, 'a_');
	      expect(b_()).to.equal(4, 'b_');
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('7', 'update');
	    });
	    it('should process bidirectional bind', function() {
	      var a$, comp;
	      a$ = bindings({
	        a: 1
	      }).a$;
	      comp = text(a$);
	      comp.mount('#demo');
	      expect(comp.node.value).to.equal('1');
	      comp.node.value = '2';
	      comp.node.onchange({
	        type: 'change'
	      });
	      return expect(a$()).to.equal('2');
	    });
	    it('should render div(2) component', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should execute component.unmount', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return comp.unmount();
	    });
	    it('should execute component.remove', function() {
	      var comp;
	      comp = div(1);
	      comp.mount(newDemoNode('replace-demo3'));
	      comp.unmount();
	      return expect(document.getElementById('replace-demo3').innerHTML).to.equal('');
	    });
	    it('should execute remove child component', function() {
	      var comp1, comp3;
	      comp1 = div(comp3 = div(3));
	      comp1.mount(newDemoNode('replace-demo4'));
	      comp3.unmount();
	      return expect(document.getElementById('replace-demo4').innerHTML).to.equal('<div></div>');
	    });
	    it('should execute component.replace', function() {
	      var comp1, comp2;
	      comp1 = div(1);
	      comp1.mount(newDemoNode('replace-demo'));
	      comp2 = div(2);
	      comp2.replace(comp1);
	      return expect(document.getElementById('replace-demo').innerHTML).to.equal('<div>2</div>');
	    });
	    it('should execute replace child component', function() {
	      var comp1, comp2, comp3;
	      comp1 = div(comp3 = div(3));
	      comp1.mount(newDemoNode('replace-demo2'));
	      expect(document.getElementById('replace-demo2').innerHTML).to.equal('<div><div>3</div></div>');
	      comp2 = div(2);
	      comp2.replace(comp3);
	      return expect(document.getElementById('replace-demo2').innerHTML).to.equal('<div><div>2</div></div>');
	    });
	    return it('p(->12) ', function() {
	      var comp;
	      comp = p(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	  });
	});


/***/ },
/* 16 */
/*!******************************************!*\
  !*** ./test/mocha/test-directive.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-directive
	 */
	var $hide, $show, Component, a, a$, bindings, ddescribe, div, duplex, each, expect, func, idescribe, if_, iit, input, list, ndescribe, nit, p, see, select, span, text, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, each = dc.each, a = dc.a, div = dc.div, p = dc.p, span = dc.span, text = dc.text, select = dc.select, input = dc.input, $show = dc.$show, $hide = dc.$hide, bindings = dc.bindings, duplex = dc.duplex, see = dc.see;

	dc.directives(dc.builtinDirectives);

	a$ = bindings({
	  a: 1
	}).a$;

	describe('directives', function() {
	  describe('model ', function() {
	    it('should process model  directive', function() {
	      var comp;
	      comp = text({
	        $model: a$
	      });
	      comp.mount();
	      comp.node.value = '2';
	      comp.node.onchange({
	        type: 'change'
	      });
	      return expect(a$()).to.equal('2');
	    });
	    return it('should process event property of component with model directive', function() {
	      var comp, m, modelValue, x;
	      x = 0;
	      modelValue = duplex(m = {}, 'x');
	      comp = input({
	        $model: modelValue,
	        onmouseenter: function() {
	          return x = 1;
	        }
	      });
	      comp.mount();
	      comp.node.onmouseenter({
	        type: 'mouseenter'
	      });
	      return expect(x).to.equal(1);
	    });
	  });
	  describe('$show', function() {
	    it('should process $show directive', function() {
	      var comp;
	      comp = div({
	        $show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	    it('should process $show directive with non block display', function() {
	      var comp;
	      comp = div({
	        style: {
	          display: "inline"
	        },
	        $show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('inline');
	    });
	    it('should process $show directive with false value', function() {
	      var comp;
	      comp = div({
	        $show: false
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('none');
	    });
	    it('should process $show directive with function value', function() {
	      var comp, showing;
	      showing = see(true);
	      comp = div({
	        $show: showing
	      });
	      expect(comp.style.display.invalidate).to.be.defined;
	      comp.mount();
	      expect(comp.node.style.display).to.equal('block', 1);
	      showing(false);
	      expect(comp.hasActiveStyle).to.equal(true);
	      comp.render();
	      return expect(comp.node.style.display).to.equal('none', 2);
	    });
	    it('should process hide directive', function() {
	      var comp;
	      comp = div({
	        $hide: true
	      }, div(1));
	      comp.mount();
	      expect(comp.node.style.display).to.equal('none');
	      comp = div({
	        $hide: false
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	    return it('should process show directive with true or false value', function() {
	      var comp;
	      comp = $show(false)(div(div(1)));
	      comp.mount();
	      expect(comp.node.style.display).to.equal('none');
	      comp = $show(true)(div(div(1)));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	  });
	  return ndescribe('select options', function() {
	    return it('should constructor select with options', function() {
	      var comp;
	      comp = select({
	        $options: [[1, 2]]
	      });
	      comp.mount();
	      expect(comp.node.innerHTML).to.match(/<option>1/);
	      return expect(comp.node.innerHTML).to.equal('<option>1</option><option>2</option>');
	    });
	  });
	});


/***/ },
/* 17 */
/*!******************************************!*\
  !*** ./test/mocha/test-singleton.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, If, Tag, Text, TransformComponent, a, case_, div, expect, flow, forceCase, forceIf, func, idescribe, if_, iit, list, ndescribe, newDemoNode, nit, p, pick, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 13).newDemoNode;

	see = dc.see, flow = dc.flow, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, forceIf = dc.forceIf, If = dc.If, case_ = dc.case_, forceCase = dc.forceCase, func = dc.func, pick = dc.pick, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('test-singleton: If, Case, Func, Pick, ...', function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('If', function() {
	    it('should optimize if_', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      expect(if_((function() {
	        return x;
	      }), t, t)).to.equal(t);
	      expect(if_(0, 1, t)).to.equal(t);
	      return expect(if_(1, t, 0)).to.equal(t);
	    });
	    it('should NOT optimize forceIf', function() {
	      var comp, t;
	      t = txt(1);
	      comp = forceIf(0, 1, t);
	      expect(comp).to.not.equal(t);
	      return expect(comp.else_).to.equal(t);
	    });
	    it('should compute if_((-> x), p(t), t).family', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(if_((function() {
	        return x;
	      }), p(t), t).family[t.dcid]).to.equal(true);
	    });
	    it('should construct if_(x, p(t1), list(p(t2), t1))', function() {
	      var t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      return if_(x, p(t1), list(t2, p(t1)));
	    });
	    it('should render if_(see something, txt(1), txt(2))', function() {
	      var comp, x;
	      x = see(0);
	      comp = if_(x, txt(1), txt(2));
	      comp.mount();
	      expect(comp.node.textContent).to.equal('2', 'mount');
	      comp.render();
	      expect(comp.node.textContent).to.equal('2', 'update');
	      x(1);
	      comp.render();
	      expect(comp.node.textContent).to.equal('1', 'update x 1');
	      x(0);
	      comp.render();
	      return expect(comp.node.textContent).to.equal('2', 'update x 0');
	    });
	    it('should render forceIf(0, txt(1), txt(2))', function() {
	      var comp;
	      comp = forceIf(0, txt(1), txt(2));
	      comp.mount();
	      expect(comp.node.textContent).to.equal('2', 'mount');
	      comp.render();
	      expect(comp.node.textContent).to.equal('2', 'update');
	      comp.test = 1;
	      comp.render();
	      expect(comp.node.textContent).to.equal('1', 'update x 1');
	      comp.test = 0;
	      comp.render();
	      return expect(comp.node.textContent).to.equal('2', 'update x 0');
	    });
	    it('should render if_(x, list(t1, t2), list(t2, t1))', function() {
	      var comp, demoNode, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, list(t1, t2), list(t2, t1));
	      demoNode = newDemoNode('if-ref');
	      comp.mount(demoNode);
	      expect(comp.node[0].textContent).to.equal('2', 'mount');
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      x(1);
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('1', 'update x 1');
	      return expect(demoNode.innerHTML).to.equal('12', 'mount');
	    });
	    it('should render if_(x, list(t2, t1), t1)', function() {
	      var comp, demoNode, lst, t1, t2, x;
	      x = see(1);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, lst = list(t2, t1), t1);
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(demoNode.innerHTML).to.equal('1', 'update');
	    });
	    it('should render if_(x, t1, list(t2, t1))', function() {
	      var comp, demoNode, lst, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, t1, lst = list(t2, t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('21', 'mount');
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('21', 'update');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('1', 'update x 1');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(demoNode.innerHTML).to.equal('21', 'update x 0');
	    });
	    it('should render if_(x, p(t1), list(p(t2), t1))', function() {
	      var comp, demoNode, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, p(t1), list(p(t2), t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'mount');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('<p>2</p>1', 'update x 0');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render if_(x, p(t1), div(t2))', function() {
	      var comp, demoNode, t1, x;
	      x = see(0);
	      t1 = txt(1);
	      comp = if_(x, p(t1), div(t1));
	      comp.mount(demoNode = newDemoNode('if-ref'));
	      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'mount');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('<div>1</div>', 'update x 0');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render p(if_(x, p(t1), list(p(t2), t1)))', function() {
	      var comp, if1, p1, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = p(if1 = if_(x, p1 = p(t1), list(p(t2), t1)));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'mount');
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1');
	      x(0);
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('<p>2</p>1', 'update x 0');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	    });
	    it('should render if_(x, p(t1), p list(p(t2), t1))', function() {
	      var comp, p1, p2, t1, t2, x;
	      x = see(0);
	      t1 = txt(1);
	      t2 = txt(2);
	      comp = if_(x, p1 = p(t1), p2 = p(list(p(t2), t1)));
	      comp.mount();
	      expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'mount');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('1', 'update x 1');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(p2.node.innerHTML).to.equal('<p>2</p>1', 'update x 2');
	    });
	    it('should render if_(x, div(1), div(2))', function() {
	      var comp, x;
	      x = see(0);
	      comp = if_(x, div(1), div(2));
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV', 'tagName');
	      expect(comp.node.innerHTML).to.equal('2', 'mount');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('1', 'first update');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('2', 'second update');
	    });
	    it('should create and update if_ with attrs', function() {
	      var c1, comp, x;
	      x = see(0);
	      comp = if_({
	        "class": 'main',
	        fakeProp: x
	      }, x, c1 = p(1), p(2));
	      expect(comp).to.be["instanceof"](Tag);
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties before mounting');
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(0, 'mount fakeProp');
	      expect(comp.node.childNodes[0].innerHTML).to.equal('2', 'mount innerHTML');
	      expect(comp.node.childNodes[0].tagName).to.equal('P', 'mount C1 tagName');
	      expect(comp.hasActiveProperties).to.equal(false, 'hasActiveProperties after mounting');
	      x(1);
	      expect(comp.props.fakeProp).to.equal(x, 'see invalidate fakeProp');
	      expect(comp.hasActiveProperties).to.equal(true, 'hasActiveProperties');
	      comp.render();
	      dc.clean();
	      expect(comp.node.fakeProp).to.equal(1, 'update fakeProp');
	      expect(comp.node.childNodes[0].innerHTML).to.equal('1', 'update innerHTML');
	      return expect(comp.node.childNodes[0]).to.equal(c1.node);
	    });
	    it('should create and render if followed by other node ', function() {
	      var comp, demo2Node, p1, p2, p3, pIf, x;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      x = see(0);
	      comp = list(pIf = if_(x, p1 = p(1), p2 = p(2)), p3 = p(3));
	      comp.mount(demo2Node);
	      expect(pIf.node.innerHTML).to.equal('2');
	      expect(demo2Node.innerHTML).to.equal('<p>2</p><p>3</p>', 'mount');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(pIf.node.innerHTML).to.equal('1', 'pif update');
	      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>3</p>', 'demo2Node update');
	      return expect(comp.node[0].innerHTML).to.equal('1', 'comp update');
	    });
	    it('should create and render embedded if', function() {
	      var c0, c1, c2, comp, demo2Node, x;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      x = see(0);
	      comp = list(txt(x), c0 = if_(x, c1 = p(1), c2 = p(2)));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('0<p>2</p>');
	      expect(comp.parentNode).to.equal(demo2Node);
	      expect(comp.node[1].innerHTML).to.equal('2');
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      expect(c0.node.innerHTML).to.equal('1');
	      expect(c2.node.innerHTML).to.equal('2');
	      expect(c0.node).to.equal(c1.node);
	      return expect(comp.node[1]).to.equal(c1.node);
	    });
	    it('should process embedded if 2-1', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      comp = list(t1 = text(1), pIf = if_(x, div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(pIf.node.innerHTML).to.equal('1');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    it('should process embedded if 2-2', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      pIf = if_(x, div(1), div(2));
	      comp = list(t1 = text(x), pIf);
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(pIf.node.innerHTML).to.equal('1');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    it('should process embedded if 2-3', function() {
	      var comp, pIf, x;
	      x = see(0);
	      comp = list(window.t1 = txt(x), pIf = if_(x, txt(1), txt(2)));
	      comp.mount();
	      expect(pIf.node.textContent).to.equal('2');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(pIf.node.textContent).to.equal('1');
	      x(0);
	      comp.render();
	      dc.clean();
	      return expect(pIf.node.textContent).to.equal('2');
	    });
	    it('should process event in embedded if 2-4', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      pIf = if_(x, div(1), div(2));
	      comp = list(t1 = text({
	        onchange: function() {
	          x(parseInt(this.node.value));
	          comp.render();
	          return dc.clean();
	        }
	      }, x), pIf);
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      t1.node.value = 1;
	      t1.node.onchange({
	        type: 'change'
	      });
	      expect(pIf.node.innerHTML).to.equal('1');
	      t1.node.value = 0;
	      t1.node.onchange({
	        type: 'change'
	      });
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    it('should process event in embedded if 2-5', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      comp = list(t1 = text({
	        onchange: function() {
	          x(parseInt(this.node.value));
	          comp.render();
	          return dc.clean();
	        }
	      }, 1), pIf = if_(x, div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      t1.node.value = 1;
	      t1.node.onchange({
	        type: 'change'
	      });
	      expect(pIf.node.innerHTML).to.equal('1');
	      t1.node.value = 0;
	      t1.node.onchange({
	        type: 'change'
	      });
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    it('should process event in embedded if 2-6', function() {
	      var comp, pIf, t1, x;
	      x = see(0);
	      comp = list(t1 = text({
	        onchange: function() {
	          x(parseInt(this.node.value));
	          comp.render();
	          return dc.clean();
	        }
	      }, x), pIf = if_(x, div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      t1.node.value = 1;
	      t1.node.onchange({
	        type: 'change'
	      });
	      expect(pIf.node.innerHTML).to.equal('1');
	      t1.node.value = 0;
	      t1.node.onchange({
	        type: 'change'
	      });
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    return it('should process two list with same children', function() {
	      var comp, demoNode, t1, t2, t3, t4, x;
	      x = see(1);
	      t1 = txt(1);
	      t2 = txt(2);
	      t3 = txt(3);
	      t4 = txt(4);
	      comp = if_(x, list(t1, t2, t3, t4), list(t4, t1, t2, t3));
	      comp.mount(demoNode = newDemoNode('list'));
	      expect(demoNode.innerHTML).to.equal('1234');
	      x(0);
	      comp.render();
	      dc.clean();
	      expect(demoNode.innerHTML).to.equal('4123');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(demoNode.innerHTML).to.equal('1234');
	    });
	  });
	  describe('Case', function() {
	    it('should create and render case_', function() {
	      var comp, x;
	      x = see(0);
	      comp = case_(x, {
	        1: p('a'),
	        2: p('b'),
	        3: p('c')
	      }, 'others');
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('a');
	    });
	    it('should create and render forceCase', function() {
	      var comp;
	      comp = forceCase(0, {
	        1: p('a'),
	        2: p('b'),
	        3: p('c')
	      }, 'others');
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      comp.test = 1;
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('a');
	    });
	    return it('should create and render array case_', function() {
	      var comp, x;
	      x = see(3);
	      comp = case_(x, [p('a'), p('b'), p('c')], 'others');
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x(1);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('b');
	    });
	  });
	  describe('Func', function() {
	    it('func(->12) ', function() {
	      var comp;
	      comp = func(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.textContent).to.equal('12');
	      comp.render();
	      expect(comp.node.textContent).to.equal('12');
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('12');
	    });
	    it('p(-> a))', function() {
	      var comp;
	      a = see(1);
	      comp = p(a);
	      comp.mount();
	      a(2);
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('2', 'update a 2');
	      a(3);
	      comp.render();
	      a(4);
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('4', 'update a 4');
	    });
	    it('should create func component', function() {
	      var comp, x;
	      x = see(1);
	      comp = func(x);
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      return expect(comp.node.textContent).to.equal('1');
	    });
	    it('should create and render func', function() {
	      var comp, x;
	      x = see(0);
	      comp = func(flow(x, function() {
	        return {
	          1: p(1),
	          2: p(2),
	          3: p(3)
	        }[x()] || 'others';
	      }));
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x(1);
	      comp.render();
	      dc.clean();
	      expect(comp.node.innerHTML).to.equal('1');
	      x(2);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should update func with attrs', function() {
	      var comp, x;
	      x = see(1);
	      comp = func({
	        "class": 'main',
	        fakeProp: x
	      }, x);
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(1);
	      expect(comp.node).to.be["instanceof"](Element);
	      expect(comp.node.childNodes[0].textContent).to.equal('1');
	      x(2);
	      comp.render();
	      dc.clean();
	      expect(comp.node.fakeProp).to.equal(2);
	      return expect(comp.node.childNodes[0].textContent).to.equal('2');
	    });
	    it('should process tag with function', function() {
	      var comp;
	      comp = p(txt(function() {
	        return 1;
	      }));
	      expect(comp.children[0]).to.be["instanceof"](Text);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    return it('should create and update func with a closure variable', function() {
	      var comp, x;
	      x = see(1);
	      comp = func(function() {
	        return txt(x);
	      });
	      comp.mount();
	      expect(comp.node.textContent).to.equal('1');
	      x(2);
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	  });
	  return describe('Pick', function() {
	    it('pick(host)', function() {
	      var comp, host, x;
	      host = {
	        content: 1
	      };
	      comp = pick(host);
	      x = 0;
	      comp.onSetContent = function(value) {
	        return x = 'called';
	      };
	      comp.mount();
	      expect(comp.node.textContent).to.equal('1');
	      host.content = 2;
	      expect(x).to.equal('called');
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	    it('pick(host, "content", 1) by setContent', function() {
	      var comp, host, x;
	      host = {
	        content: 1
	      };
	      comp = pick(host);
	      x = 0;
	      comp.onSetContent = function(value) {
	        return x = 'called';
	      };
	      comp.mount();
	      expect(comp.node.textContent).to.equal('1');
	      comp.setContent(2);
	      expect(x).to.equal('called');
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	    it('pick(host, "activeContent", 1)', function() {
	      var comp, host, x;
	      host = {};
	      comp = pick(host, "activeContent", 1);
	      x = 0;
	      comp.onSetContent = function(value) {
	        return x = 'called';
	      };
	      comp.mount();
	      expect(comp.node.textContent).to.equal('1');
	      host.activeContent = 2;
	      expect(x).to.equal('called');
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	    return it('pick(host, "activeContent", 1) by setContent', function() {
	      var comp, host, x;
	      host = {};
	      comp = pick(host, "activeContent", 1);
	      x = 0;
	      comp.onSetContent = function(value) {
	        return x = 'called';
	      };
	      comp.mount();
	      expect(comp.node.textContent).to.equal('1');
	      comp.setContent(2);
	      expect(x).to.equal('called');
	      comp.render();
	      dc.clean();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	  });
	});


/***/ },
/* 18 */
/*!*****************************************!*\
  !*** ./test/mocha/test-merge-if.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, If, List, Tag, Text, a, div, expect, flow, func, idescribe, if_, iit, list, mergeIf, ndescribe, newDemoNode, nit, p, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 13).newDemoNode;

	see = dc.see, flow = dc.flow, Component = dc.Component, Tag = dc.Tag, Text = dc.Text, List = dc.List, If = dc.If, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, mergeIf = dc.mergeIf, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('domcom/test-merge-if', function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  it('should construct mergeIf(x, t1, t2)', function() {
	    var comp, t1, t2, x;
	    x = see(0);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, t1, t2);
	    expect(comp.isText).to.equal(true);
	    comp.mount();
	    expect(comp.node.textContent).to.equal('2');
	    x(1);
	    comp.render();
	    return expect(comp.node.textContent).to.equal('1');
	  });
	  it('should render mergeIf(x, list(t1, t2), list(t2, t1))', function() {
	    var comp, demoNode, t1, t2, x;
	    x = see(0);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, list(t1, t2), list(t2, t1));
	    expect(comp.isList).to.equal(true);
	    comp.mount(demoNode = newDemoNode('if-ref'));
	    expect(comp.node[0].textContent).to.equal('2', 'mount');
	    expect(demoNode.innerHTML).to.equal('21', 'mount');
	    x(1);
	    comp.render();
	    expect(comp.node[0].textContent).to.equal('1', 'update x 1');
	    return expect(demoNode.innerHTML).to.equal('12', 'update');
	  });
	  it('should render if_(x, list(t2, t1), new List([t1]))', function() {
	    var comp, demoNode, lst, t1, t2, x;
	    x = see(1);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, lst = list(t2, t1), new List([t1]));
	    expect(comp.isList).to.equal(true);
	    comp.mount(demoNode = newDemoNode('if-ref'));
	    expect(demoNode.innerHTML).to.equal('21', 'mount');
	    x(0);
	    comp.render();
	    dc.clean();
	    return expect(demoNode.innerHTML).to.equal('1');
	  });
	  it('should render mergeIf(x, new List([t1]), list(t2, t1))', function() {
	    var comp, demoNode, lst, t1, t2, x;
	    x = see(1);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, new List([t1]), lst = list(t2, t1));
	    expect(comp.isList).to.equal(true);
	    comp.mount(demoNode = newDemoNode('if-ref'));
	    expect(demoNode.innerHTML).to.equal('1', 'mount');
	    x(0);
	    comp.render();
	    return expect(demoNode.innerHTML).to.equal('21');
	  });
	  it('should render mergeIf(x, p(t1), p(t2))', function() {
	    var comp, demoNode, t1, t2, x;
	    x = see(0);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, p(t1), p(t2));
	    expect(comp.isTag).to.equal(true);
	    comp.mount(demoNode = newDemoNode('if-ref'));
	    expect(demoNode.innerHTML).to.equal('<p>2</p>', 'mount');
	    x(1);
	    comp.render();
	    dc.clean();
	    return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	  });
	  it('should also render mergeIf(x, p(t1), p(t2, t1))', function() {
	    var comp, demoNode, t1, t2, x;
	    x = see(0);
	    t1 = txt(1);
	    t2 = txt(2);
	    comp = mergeIf(x, p(t1), p(t2, t1));
	    expect(comp.isTag).to.equal(true);
	    comp.mount(demoNode = newDemoNode('if-ref'));
	    expect(demoNode.innerHTML).to.equal('<p>21</p>', 'mount');
	    x(1);
	    comp.render();
	    dc.clean();
	    expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1');
	    x(0);
	    comp.render();
	    dc.clean();
	    expect(demoNode.innerHTML).to.equal('<p>21</p>', 'update x 0');
	    x(1);
	    comp.render();
	    dc.clean();
	    return expect(demoNode.innerHTML).to.equal('<p>1</p>', 'update x 1 again');
	  });
	  it('should render mergeIf(x, p(t1), div(t2))', function() {
	    var comp, t1, x;
	    x = see(0);
	    t1 = txt(1);
	    comp = mergeIf(x, p(t1), div(t1));
	    return expect(comp instanceof If).to.equal(true);
	  });
	  it('should render mergeIf(x, div(1), div(2))', function() {
	    var comp, x;
	    x = see(0);
	    comp = mergeIf(x, div(1), div(2));
	    comp.mount();
	    expect(comp.isTag).to.equal(true);
	    expect(comp.children[0].isText).to.equal(true);
	    expect(comp.node.tagName).to.equal('DIV', 'tagName');
	    expect(comp.node.innerHTML).to.equal('2', 'mount');
	    x(1);
	    comp.render();
	    return expect(comp.node.innerHTML).to.equal('1', 'first update');
	  });
	  it('should render mergeIf(x, div(1), div(p(2)))', function() {
	    var comp, x;
	    x = see(0);
	    comp = mergeIf(x, div(1), div(p(2)));
	    comp.mount();
	    expect(comp.isTag).to.equal(true);
	    expect(comp.children[0] instanceof If).to.equal(true);
	    expect(comp.node.tagName).to.equal('DIV', 'tagName');
	    return expect(comp.node.innerHTML).to.equal('<p>2</p>', 'mount');
	  });
	  it('should render mergeIf(x, div({class}, 1), div({class}, 2))', function() {
	    var comp, x;
	    x = see(0);
	    comp = mergeIf(x, div({
	      "class": 'a'
	    }, 1), div({
	      "class": 'b'
	    }, 2));
	    comp.mount();
	    expect(comp.isTag).to.equal(true);
	    expect(comp.node.className).to.equal('b');
	    x(1);
	    comp.render();
	    return expect(comp.node.className).to.equal('a');
	  });
	  it('should render mergeIf(x, div({a:1}, 1), div({b:2}, 2))', function() {
	    var comp, x;
	    x = see(0);
	    comp = mergeIf(x, div({
	      a: 1
	    }, 1), div({
	      b: 2
	    }, 2));
	    comp.mount();
	    expect(comp.isTag).to.equal(true);
	    expect(comp.node.a).to.equal('');
	    expect(comp.node.b).to.equal(2);
	    x(1);
	    comp.render();
	    expect(comp.node.a).to.equal(1);
	    return expect(comp.node.b).to.equal('', 'x 1');
	  });
	  it('should render mergeIf(x, div({onclick}, 1), div({onclick}, 2))', function() {
	    var comp, x;
	    x = see(0);
	    a = 0;
	    comp = mergeIf(x, div({
	      onclick: function() {
	        return a = 1;
	      }
	    }, 1), div({
	      onclick: function() {
	        return a = 2;
	      }
	    }, 2));
	    comp.mount();
	    comp.node.onclick({
	      type: 'click'
	    });
	    expect(a).to.equal(2, 'first click');
	    x(1);
	    comp.render();
	    comp.node.onclick({
	      type: 'click'
	    });
	    return expect(a).to.equal(1, 'second click');
	  });
	  it('should NOT merge If(0, div({onclick}, 1), div({onclick}, 2), true, false, true)', function() {
	    var comp;
	    a = 0;
	    comp = new If(0, div({
	      onclick: function() {
	        return a = 1;
	      }
	    }, 1), div({
	      onclick: function() {
	        return a = 2;
	      }
	    }, 2), true, false, true);
	    comp.mount();
	    comp.node.onclick({
	      type: 'click'
	    });
	    expect(a).to.equal(2, 'first click');
	    comp.test = 1;
	    comp.render();
	    comp.node.onclick({
	      type: 'click'
	    });
	    return expect(a).to.equal(1, 'second click');
	  });
	  return it('should render mergeIf(x, div({style}, 1), div({style}, 2))', function() {
	    var comp, x;
	    x = see(0);
	    comp = mergeIf(x, div({
	      style: {
	        width: '100px'
	      }
	    }, 1), div({
	      style: {
	        width: '200px'
	      }
	    }, 2));
	    comp.mount();
	    expect(comp.node.style.width).to.equal('200px');
	    x(1);
	    comp.render();
	    return expect(comp.node.style.width).to.equal('100px');
	  });
	});


/***/ },
/* 19 */
/*!**************************************!*\
  !*** ./test/mocha/test-group.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, TransformComponent, a, accordion, accordionGroup, bind, case_, comp, demo2Node, div, dontUnmount, each, every, expect, func, funcEach, idescribe, if_, iit, isComponent, list, ndescribe, newDemoNode, nit, p, pour, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, newDemoNode = _ref.newDemoNode;

	newDemoNode = __webpack_require__(/*! ./helper */ 13).newDemoNode;

	isComponent = dc.isComponent, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, List = dc.List, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, every = dc.every, funcEach = dc.funcEach, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div, bind = dc.bind, pour = dc.pour, see = dc.see;

	demo2Node = null;

	comp = null;

	dontUnmount = false;

	describe('test-group: group component: List, each', function() {
	  beforeEach(function() {
	    demo2Node = document.getElementById('demo2');
	    return demo2Node.innerHTML = '';
	  });
	  afterEach(function() {
	    dc.reset();
	    if (comp && comp.node && !dontUnmount) {
	      return comp.unmount();
	    }
	  });
	  describe('List', function() {
	    afterEach(function() {
	      dc.reset();
	      if (comp && comp.node && !dontUnmount) {
	        return comp.unmount();
	      }
	    });
	    it('all of item in list should be  component', function() {
	      comp = list([1, 2]);
	      return expect(isComponent(comp.children[0])).to.equal(true);
	    });
	    it('should create list component', function() {
	      comp = list([span(['adf'])]);
	      comp.mount();
	      expect(comp.node[0].tagName).to.equal('SPAN');
	      return comp.unmount();
	    });
	    it('component list should have length', function() {
	      var lst;
	      lst = list([1, 2]);
	      return expect(lst.children.length).to.equal(2);
	    });
	    it('list can be constructructed  from mulitple argumnents', function() {
	      var lst;
	      lst = list(1, 2);
	      return expect(lst.children.length).to.equal(2);
	    });
	    it('should create list', function() {
	      var lst;
	      lst = list(1, 2);
	      lst.mount();
	      expect(lst.node[0].textContent).to.equal('1');
	      expect(lst.node[1].textContent).to.equal('2');
	      return lst.unmount();
	    });
	    it('should create list with attrs', function() {
	      var x;
	      x = 2;
	      comp = list({
	        "class": 'main',
	        fakeProp: function() {
	          return x;
	        }
	      }, 1, txt(function() {
	        return x;
	      }));
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.childNodes[0].textContent).to.equal('1');
	      expect(comp.node.childNodes[1].textContent).to.equal('2');
	      x = 3;
	      comp.render();
	      expect(comp.node.fakeProp).to.equal(3);
	      expect(comp.node.childNodes[1].textContent).to.equal('3', 'textContent update');
	      return comp.unmount();
	    });
	    it('list(txt(->12))', function() {
	      comp = list(txt(function() {
	        return 12;
	      }));
	      comp.mount();
	      expect(comp.node.textContent).to.equal('12');
	      return comp.unmount();
	    });
	    it('list setChildren after mounting', function() {
	      comp = new List([txt(1)]);
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      expect(function() {
	        var t2;
	        return comp.setChildren(1, [t2 = txt(2)]);
	      }).not.to["throw"]();
	      return comp.unmount();
	    });
	    it('list setChildren: similar to splitter', function() {
	      var t2, t3;
	      comp = new List([txt(1), t3 = txt(3)]);
	      comp.setChildren(1, [t2 = txt(2), t3]);
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      expect(comp.node[1].textContent).to.equal('2');
	      expect(comp.node[2].textContent).to.equal('3');
	      return comp.unmount();
	    });
	    it('list(p(txt(->12))) ', function() {
	      comp = list(p(txt(function() {
	        return 12;
	      })));
	      comp.mount();
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('12');
	      return comp.unmount();
	    });
	    it('list(p(->12))', function() {
	      comp = list(p(function() {
	        return 12;
	      }));
	      comp.mount();
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('12');
	      return comp.unmount();
	    });
	    it('list(txt(1))', function() {
	      var demoNode;
	      comp = new List([txt(1)]);
	      comp.mount(demoNode = newDemoNode('list'));
	      expect(demoNode.innerHTML).to.equal('1', 1);
	      comp.render();
	      comp.setLength(0);
	      expect(demoNode.innerHTML).to.equal('', 2);
	      comp.render();
	      expect(demoNode.innerHTML).to.equal('', 3);
	      comp.unmount();
	      return expect(demoNode.innerHTML).to.equal('', 3);
	    });
	    it('list(txt(1), txt(2), txt(3)) and move child', function() {
	      var demoNode, t1, t2, t3;
	      comp = list(t1 = txt(1), t2 = txt(2), t3 = txt(3));
	      comp.mount(demoNode = newDemoNode('list'));
	      expect(demoNode.innerHTML).to.equal('123');
	      comp.removeChild(0);
	      comp.render();
	      expect(comp.children.indexOf(t1)).to.equal(-1, 'dcid 0');
	      expect(comp.children.indexOf(t2)).to.equal(0, 'dcid 1');
	      expect(comp.children.indexOf(t3)).to.equal(1, 'dcid 2');
	      expect(comp.children.length).to.equal(2);
	      comp.pushChild(t1);
	      comp.render();
	      expect(demoNode.innerHTML).to.equal('231');
	      return comp.unmount();
	    });
	    return it('should not renderDom after removing', function() {
	      var demoNode, t1, t2, t3;
	      comp = list(t1 = txt(1), t2 = txt(2), t3 = txt(3));
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.removeChild(0);
	      comp.render();
	      expect(demoNode.innerHTML).to.equal('23');
	      expect(t1.node.parentNode).to.equal(null);
	      expect(t1.removed).to.equal(true);
	      t1.render();
	      expect(t1.node.parentNode).to.equal(null);
	      return expect(demoNode.innerHTML).to.equal('23');
	    });
	  });
	  describe('Tag', function() {
	    return it('should have correct nextNode', function() {
	      var div1, div2, t2, t3, t4, t5;
	      comp = div(div1 = div(txt(1), t2 = txt(2), t3 = txt(3)), div2 = div(t4 = txt(4), t5 = txt(5), txt(6)));
	      comp.mount();
	      div1.insertChildAfter(t5, t2);
	      comp.render();
	      return expect(function() {
	        return comp.render();
	      }).to["throw"]();
	    });
	  });
	  describe('each of array, object', function() {
	    it('simple each for array', function() {
	      var demoNode;
	      comp = every([1, 2], function(item) {
	        return item;
	      });
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.render();
	      expect(comp.node.length).to.equal(2);
	      return comp.unmount();
	    });
	    it('all key of object 1', function() {
	      var demoNode;
	      comp = every({
	        a: 1,
	        b: 2
	      }, function(value) {
	        return value;
	      });
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.render();
	      expect(comp.children.length).to.equal(2);
	      return expect(demoNode.innerHTML).to.equal('12');
	    });
	    it('all key of object 2', function() {
	      var demoNode;
	      demoNode = newDemoNode('list');
	      comp = every({}, {
	        a: 1,
	        b: 2
	      }, function(value, key) {
	        return list(key, ':', value);
	      });
	      comp.mount(demoNode);
	      expect(comp.children.length).to.equal(2);
	      expect(comp.node.innerHTML).to.equal('a:1b:2');
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('a:1b:2');
	    });
	    return it('all key of object 3', function() {
	      var demoNode, options;
	      options = {
	        itemFunc: function(value, key) {
	          return list(key, ':', value);
	        },
	        separatorFunc: function() {
	          return ', ';
	        }
	      };
	      comp = every({}, {
	        a: 1,
	        b: 2
	      }, options);
	      comp.mount(demoNode = newDemoNode('list'));
	      comp.render();
	      expect(comp.children.length).to.equal(2);
	      return expect(comp.node.innerHTML).to.equal('a:1, b:2');
	    });
	  });
	  describe('each', function() {
	    it('should create empty each component', function() {
	      var lst;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      comp = each(lst = [], function(item, i) {
	        return p(item);
	      });
	      comp.mount(demo2Node);
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node.length).to.equal(0);
	      comp.render();
	      expect(comp.node.length).to.equal(0);
	      return comp.unmount();
	    });
	    it('should create each component with single item', function() {
	      var lst;
	      comp = each(lst = [1], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node.length).to.equal(1);
	      expect(comp.node[0].innerHTML).to.equal('1');
	      comp.render();
	      expect(comp.node.length).to.equal(1);
	      expect(comp.node[0].innerHTML).to.equal('1');
	      return comp.unmount();
	    });
	    it('should set children nextNode correctly', function() {
	      var each1, lst;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      lst = [1, 2];
	      comp = list((each1 = each(lst, function(item) {
	        return p(item);
	      })), 'some other thing');
	      comp.mount(demo2Node);
	      expect(each1.nextNode).to.equal(comp.node[1]);
	      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p>some other thing');
	      lst.push(3);
	      comp.render();
	      expect(each1.children[2].node).to.equal(each1.node[2]);
	      expect(demo2Node.innerHTML).to.equal('<p>1</p><p>2</p><p>3</p>some other thing');
	      comp.unmount();
	      return expect(demo2Node.innerHTML).to.equal('');
	    });
	    it('should create each component with two item', function() {
	      var lst;
	      comp = each(lst = ['each', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      expect(comp.node[0]).to.be["instanceof"](Element);
	      expect(comp.node[1].innerHTML).to.equal('simple');
	      return comp.unmount();
	    });
	    it('should mount and render each component', function() {
	      var demoNode, lst;
	      dontUnmount = true;
	      document.getElementById('demo').innerHTML = '';
	      comp = each(lst = ['each', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount(demoNode = newDemoNode("each"));
	      expect(comp.node[0].innerHTML).to.equal('each');
	      expect(comp.node[1].innerHTML).to.equal('simple');
	      lst.setItem(0, 3);
	      comp.render();
	      dc.clean();
	      expect(comp.node[0].innerHTML).to.equal('3', 'update node 0');
	      lst.setItem(1, 4);
	      comp.render();
	      dc.clean();
	      expect(comp.node[1].innerHTML).to.equal('4', 'update node 1');
	      expect(demoNode.innerHTML).to.equal('<p>3</p><p>4</p>', 'update innerHTML');
	      lst.setItem(2, 5);
	      comp.render();
	      dc.clean();
	      expect(comp.node[2].innerHTML).to.equal('5', 'update list[2] = 5');
	      lst.setLength(0);
	      comp.render();
	      dc.clean();
	      expect(comp.children.length).to.equal(0, 'comp.children.length = 0');
	      expect(comp.node.length).to.equal(0, 'node.length');
	      return comp.unmount();
	    });
	    it('should process binding on item', function() {
	      var lst;
	      document.getElementById('demo').innerHTML = '';
	      comp = each(lst = [
	        {
	          text: 'a'
	        }, {
	          text: 'b'
	        }
	      ], (function(item, i) {
	        return p(txt(bind(item, 'text')));
	      }));
	      comp.mount("#demo");
	      expect(comp.node[0].textContent).to.equal('a');
	      expect(comp.node[1].textContent).to.equal('b');
	      lst[0].text = 'c';
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('c', 'update c');
	      lst[1].text = 'd';
	      comp.render();
	      expect(comp.node[1].textContent).to.equal('d', 'update d');
	      lst.setItem(2, {
	        text: 'e'
	      });
	      comp.render();
	      expect(comp.node[2].textContent).to.equal('e');
	      lst.setLength(0);
	      comp.render();
	      dc.clean();
	      expect(comp.node.length).to.equal(0);
	      return comp.unmount();
	    });
	    it('should process items in template function', function() {
	      var lst;
	      comp = each(lst = ['a', 'b'], {
	        itemFunc: function(item, i, listComponent) {
	          return p(txt(function() {
	            return item;
	          }));
	        }
	      });
	      comp.mount();
	      lst.setItem(0, 'c');
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('c');
	      return comp.unmount();
	    });
	    it('should process tag with each', function() {
	      var each1, text1, x$;
	      dontUnmount = true;
	      x$ = see(1);
	      text1 = null;
	      comp = new Tag('div', {}, [
	        each1 = each([1], {
	          itemFunc: function(item) {
	            return text1 = txt(x$);
	          }
	        })
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      x$(2);
	      comp.render();
	      expect(text1.node.textContent).to.equal('2', 'update, 2');
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('2');
	      return comp.unmount();
	    });
	    it('should create and update deeper embedded each', function() {
	      var each1, listItems, span1, x;
	      x = 1;
	      comp = div({}, span1 = new Tag('span', {}, [
	        each1 = each(listItems = [x], {
	          itemFunc: function(item) {
	            return txt(item);
	          }
	        })
	      ]));
	      comp.mount();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      listItems.setItem(0, 2);
	      comp.render();
	      dc.clean();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('<span>2</span>');
	      return comp.unmount();
	    });
	    it('should create and update each where item return a closure variable', function() {
	      var x;
	      x = see(1);
	      comp = each([1], {
	        itemFunc: function() {
	          return txt(x);
	        }
	      });
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      x(2);
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('2');
	      return comp.unmount();
	    });
	    it('should create and update embedded each where item return a closure variable', function() {
	      var each1, x;
	      x = see(1);
	      comp = new Tag('span', {}, [
	        each1 = each([1], {
	          itemFunc: function(item) {
	            return txt(x);
	          }
	        })
	      ]);
	      comp.mount();
	      expect(each1.parentNode).to.equal(comp.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x(2);
	      comp.render();
	      expect(each1.parentNode).to.equal(comp.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('2');
	      return comp.unmount();
	    });
	    it('should create and update embedded each in 3 layer', function() {
	      var each1, span1, x;
	      x = see(1);
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        each1 = each([1], {
	          itemFunc: function(item) {
	            return txt(x);
	          }
	        })
	      ])));
	      comp.mount();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x(2);
	      comp.render();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	      return comp.unmount();
	    });
	    it('should mount and update each', function() {
	      comp = new Tag('span', {}, [
	        each([1], function(item) {
	          return txt(1);
	        })
	      ]);
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('1');
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('1');
	      return comp.unmount();
	    });
	    it('should push and setLength of each', function() {
	      var lst;
	      lst = [1, 2, 3, 4, 5, 6];
	      comp = each(lst, function(item) {
	        return txt(item);
	      });
	      comp.mount();
	      lst.push(7);
	      comp.render();
	      expect(comp.node.length).to.equal(7, 'push 7');
	      lst.setLength(4);
	      comp.render();
	      expect(comp.node.length).to.equal(4, 'setLength 4');
	      return comp.unmount();
	    });
	    it('should update each with component as the item of list 1', function() {
	      var s;
	      comp = each([txt(1)], function(item) {
	        return item;
	      });
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal(s = '1');
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('1');
	      return comp.unmount();
	    });
	    it('should update each with component as the item of list 2', function() {
	      var s;
	      comp = div(each([txt(1)], function(item) {
	        return item;
	      }));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal(s = '1');
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('1');
	      return comp.unmount();
	    });
	    it('should update each with component as the item of list 3', function() {
	      var s;
	      comp = div(div(each([txt(1)], function(item) {
	        return item;
	      })));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal(s = '<div>1</div>');
	      comp.render();
	      expect(comp.node.innerHTML).to.equal('<div>1</div>');
	      return comp.unmount();
	    });
	    it('should always attach and detach in multiple iteration 0', function() {
	      var showingEach$;
	      showingEach$ = see(true);
	      comp = if_(showingEach$, txt(1));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('1');
	      expect(comp.node.parentNode).to.equal(demo2Node);
	      showingEach$(false);
	      comp.render();
	      dc.clean();
	      expect(comp.node.parentNode).to.equal(void 0);
	      expect(demo2Node.innerHTML).to.equal('');
	      showingEach$(true);
	      comp.render();
	      dc.clean();
	      expect(comp.node.parentNode).to.equal(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('1');
	      showingEach$(false);
	      comp.render();
	      dc.clean();
	      expect(demo2Node.innerHTML).to.equal('');
	      expect(comp.node.parentNode).to.equal(void 0);
	      return comp.unmount();
	    });
	    it('should always attach and detach each in multiple iteration 1', function() {
	      var lst4, showingEach$;
	      showingEach$ = see(true);
	      lst4 = [1, 2];
	      comp = if_(showingEach$, each(lst4, function(item) {
	        return txt(item);
	      }));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('12');
	      expect(comp.node.parentNode).to.equal(demo2Node);
	      showingEach$(false);
	      comp.render();
	      dc.clean();
	      expect(comp.node.parentNode).to.equal(void 0);
	      expect(demo2Node.innerHTML).to.equal('');
	      showingEach$(true);
	      comp.render();
	      dc.clean();
	      expect(comp.node.parentNode).to.equal(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('12');
	      showingEach$(false);
	      comp.render();
	      dc.clean();
	      expect(demo2Node.innerHTML).to.equal('');
	      expect(comp.node.parentNode).to.equal(void 0);
	      return comp.unmount();
	    });
	    return it('should always attach and detach each in multiple iteration 2', function() {
	      var lst4, showingEach$;
	      showingEach$ = see(true);
	      lst4 = [1, 2];
	      comp = if_(showingEach$, each(lst4, function(item) {
	        return div(item);
	      }));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('<div>1</div><div>2</div>');
	      showingEach$(false);
	      comp.render();
	      expect(comp.node.parentNode).to.equal(void 0);
	      showingEach$(true);
	      comp.render();
	      expect(comp.node.parentNode).to.equal(demo2Node);
	      showingEach$(false);
	      comp.render();
	      expect(comp.node.parentNode).to.equal(void 0);
	      return comp.unmount();
	    });
	  });
	  return describe('funcEach', function() {
	    it('should process funcEach', function() {
	      var x;
	      x = 1;
	      comp = funcEach((function() {
	        return [x];
	      }), {
	        itemFunc: function(item) {
	          return item;
	        }
	      });
	      comp.mount();
	      expect(comp.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      expect(comp.node[0].textContent).to.equal('2', 'after x = 2');
	      return comp.unmount();
	    });
	    it('should create and update funcEach', function() {
	      var x;
	      dontUnmount = true;
	      x = 1;
	      comp = funcEach((function() {
	        return [x];
	      }), {
	        itemFunc: function(item) {
	          return txt(item);
	        }
	      });
	      comp.mount(demo2Node);
	      expect(comp.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      dc.clean();
	      expect(comp.node[0].textContent).to.equal('2', 'update 2');
	      expect(comp.isList).to.equal(true);
	      expect(demo2Node.innerHTML).to.equal('2', 'innerHTML');
	      x = 3;
	      comp.render();
	      dc.clean();
	      expect(comp.node[0].textContent).to.equal('3', 'update 3');
	      expect(demo2Node.innerHTML).to.equal('3', 'innerHTML');
	      return comp.unmount();
	    });
	    it('should process each under each and with function as items 1', function() {
	      var each1, each2, x;
	      x = 1;
	      each2 = null;
	      comp = div({}, each1 = each([1], function() {
	        return each2 = funcEach((function() {
	          return [x];
	        }), function(item) {
	          return item;
	        });
	      }));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('<div>1</div>');
	      dontUnmount = true;
	      expect(each1.parentNode).to.equal(comp.node);
	      expect(each1.node[0][0].textContent).to.equal('1');
	      expect(each2.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      dc.clean();
	      expect(demo2Node.innerHTML).to.equal('<div>2</div>');
	      expect(each1.parentNode).to.equal(comp.node);
	      expect(each2.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('2', 'after x = 2');
	      return comp.unmount();
	    });
	    it('should process each under each and with function as items 0', function() {
	      var each1, each2, x;
	      x = 1;
	      each2 = null;
	      comp = each1 = each([1], function() {
	        return each2 = funcEach((function() {
	          return [x];
	        }), {
	          itemFunc: function(item) {
	            return txt(item);
	          }
	        });
	      });
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('1');
	      dontUnmount = true;
	      expect(each1.parentNode).to.equal(each1.parentNode);
	      expect(each1.parentNode).to.equal(demo2Node);
	      expect(each1.node[0][0].textContent).to.equal('1');
	      expect(each2.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      dc.clean();
	      expect(demo2Node.innerHTML).to.equal('2');
	      expect(each1.parentNode).to.equal(each1.parentNode);
	      expect(each2.node[0].textContent).to.equal('2');
	      expect(demo2Node.innerHTML).to.equal('2', 'after x = 2');
	      return comp.unmount();
	    });
	    it('should create and update embedded each in 3 layer 2', function() {
	      var each1, span1, x;
	      x = 1;
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        each1 = funcEach((function() {
	          return [x];
	        }), {
	          itemFunc: function(item) {
	            return txt(item);
	          }
	        })
	      ])));
	      comp.mount();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      dc.clean();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	      return comp.unmount();
	    });
	    it('should create and update deeper embedded funcEach', function() {
	      var each1, span1, x;
	      x = 1;
	      comp = div({}, span1 = new Tag('span', {}, [
	        each1 = funcEach((function() {
	          return [x];
	        }), {
	          itemFunc: function(item) {
	            return txt(item);
	          }
	        })
	      ]));
	      comp.mount();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.render();
	      dc.clean();
	      expect(each1.parentNode).to.equal(span1.node);
	      expect(each1.node[0].textContent).to.equal('2');
	      expect(comp.node.innerHTML).to.equal('<span>2</span>');
	      return comp.unmount();
	    });
	    return it('should create and update funcEach in list', function() {
	      var each1, items;
	      dontUnmount = true;
	      items = [1, 2];
	      comp = list(txt('text'), each1 = funcEach((function() {
	        return items;
	      }), {
	        itemFunc: function(item) {
	          return txt(' ' + item);
	        }
	      }));
	      comp.mount(demo2Node);
	      expect(demo2Node.innerHTML).to.equal('text 1 2');
	      items = [3];
	      comp.render();
	      dc.clean();
	      expect(demo2Node.innerHTML).to.equal('text 3', 1);
	      comp.render();
	      dc.clean();
	      return expect(demo2Node.innerHTML).to.equal('text 3', 2);
	    });
	  });
	});


/***/ },
/* 20 */
/*!******************************************!*\
  !*** ./test/mocha/test-ref-clone.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, case_, ddescribe, div, each, expect, flow, func, idescribe, if_, iit, list, ndescribe, nit, p, see, span, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	see = dc.see, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, each = dc.each, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div, flow = dc.flow;

	describe('Component.refs, clone', function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('refs', function() {
	    it('should throw error while constucting conflicted component list(t, t))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(t, t);
	      }).to["throw"](Error);
	    });
	    it('should throw error while constucting conflicted component list(t, p(t)))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(t, p(t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(1, t, 0))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(p(t), if_(1, t, 0));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(0, 2, t))', function() {
	      var t;
	      t = txt(1);
	      return expect(function() {
	        return list(p(t), if_(0, 2, t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(-> x, t, t))', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(function() {
	        return list(p(t), if_((function() {
	          return x;
	        }), t, t));
	      }).to["throw"](Error);
	    });
	    it('should throw error while conflicted component in list(p(t), if_(-> x, p(t), t))', function() {
	      var t, x;
	      t = txt(1);
	      x = 0;
	      return expect(function() {
	        return list(p(t), if_((function() {
	          return x;
	        }), p(t), t));
	      }).to["throw"](Error);
	    });
	    return it('should updateBaseComponent of if_((-> x), t=txt(1), t)', function() {
	      var comp, t, x;
	      x = see(0);
	      comp = if_(x, t = txt(1), t);
	      comp.mount();
	      return comp.render();
	    });
	  });
	  return describe('Clone', function() {
	    it('should not clone node event handler', function() {
	      var node, node2;
	      node = document.createElement('p');
	      node.value = 1;
	      node.fakeProp = 2;
	      node.onclick = function() {};
	      node2 = node.cloneNode();
	      expect(node2.onclick).to.equal(null);
	      expect(node2.value).to.equal(void 0);
	      return expect(node2.fakeProp).to.equal(void 0);
	    });
	    it('should clone TextNode', function() {
	      var node, node2;
	      node = document.createTextNode('afd');
	      node.value = 1;
	      node.fakeProp = 2;
	      node.onclick = function() {};
	      node2 = node.cloneNode();
	      expect(node2.onclick).to.equal(void 0);
	      expect(node2.textContent).to.equal('afd');
	      expect(node2.value).to.equal(void 0);
	      return expect(node2.fakeProp).to.equal(void 0);
	    });
	    it('should process text clone component bind', function() {
	      var comp, t1;
	      comp = list(t1 = txt(1), t1.clone());
	      comp.mount('#demo');
	      comp.render();
	      return expect(comp.node[1].textContent).to.equal('1');
	    });
	    it('should process text clone component with bind', function() {
	      var t1, t2;
	      t1 = txt(flow.thisBind('x'));
	      t2 = t1.clone();
	      t1.x = 1;
	      t2.x = 2;
	      t1.mount('#demo');
	      t2.mount('#demo');
	      expect(t1.node.textContent).to.equal('1');
	      expect(t2.node.textContent).to.equal('2');
	      t2.x = 3;
	      t2.render();
	      return expect(t2.node.textContent).to.equal('3', 3);
	    });
	    it('should process mount cloned tag ', function() {
	      var c1, comp;
	      c1 = p(1);
	      comp = c1.clone();
	      comp.mount('#demo');
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should process tag clone component ', function() {
	      var c1, c2, comp;
	      c1 = p(1);
	      c2 = c1.clone();
	      comp = list(c1, c2);
	      comp.mount('#demo');
	      comp.render();
	      return expect(comp.node[1].innerHTML).to.equal('1');
	    });
	    return it('should process if_ clone component ', function() {
	      var c1, c2, comp, lstComp, x;
	      x = see(0);
	      c1 = p(1);
	      c2 = c1.clone();
	      lstComp = list(c1, c2);
	      comp = if_(x, p(3), lstComp);
	      comp.mount('#demo');
	      x(1);
	      comp.render();
	      return expect(comp.node.innerHTML).to.equal('3');
	    });
	  });
	});


/***/ },
/* 21 */
/*!**************************************!*\
  !*** ./test/mocha/test-event.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, button, classFn, ddescribe, div, duplex, expect, fakeEvent, func, idescribe, if_, iit, input, li, list, model, ndescribe, nit, p, see, show, span, styleFrom, text, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	fakeEvent = __webpack_require__(/*! domcom/test/mocha/helper */ 13).fakeEvent;

	duplex = dc.duplex, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, model = dc.model, show = dc.show, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	describe("component event", function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  it('component shoud call listeners before mounting', function() {
	    var comp, x;
	    x = 0;
	    comp = p();
	    comp.on('willMount', function() {
	      return x = 1;
	    });
	    comp.mount();
	    return expect(x).to.equal(1);
	  });
	  it('component shoud call listeners before mounting if_', function() {
	    var comp, x;
	    x = 0;
	    comp = if_(1, 2, 3);
	    comp.on('willMount', function() {
	      return x = 1;
	    });
	    comp.mount();
	    return expect(x).to.equal(1);
	  });
	  it('component shoud call then_.listeners before updating if_', function() {
	    var comp, t, x;
	    x = see(0);
	    comp = if_(x, t = txt(1), txt(2));
	    t.on('willMount', function() {
	      return x(1);
	    });
	    comp.mount();
	    expect(x()).to.equal(0);
	    x(1);
	    comp.render();
	    return expect(x()).to.equal(1);
	  });
	  it('component shoud not call embeded listeners before updating if_', function() {
	    var comp, t, x;
	    x = see(0);
	    comp = if_(x, p(t = txt(1)), txt(2));
	    t.on('willMount', function() {
	      return x(1);
	    });
	    comp.mount();
	    expect(x()).to.equal(0);
	    x(1);
	    comp.render();
	    return expect(x()).to.equal(1);
	  });
	  it('component shoud call listeners after mounting', function() {
	    var comp, x;
	    x = see(0);
	    comp = p();
	    comp.on('willMount', function() {
	      return x(1);
	    });
	    comp.on('willUnmount', function() {
	      return x(2);
	    });
	    comp.mount();
	    expect(x()).to.equal(1);
	    comp.unmount();
	    return expect(x()).to.equal(2);
	  });
	  it('component shoud call mount and unmount listeners', function() {
	    var comp, x, y;
	    x = 0;
	    y = 0;
	    comp = if_(1, 2, 3);
	    comp.on('willMount', function() {
	      return x = 1;
	    });
	    comp.on('willUnmount', function() {
	      return y = 2;
	    });
	    comp.mount();
	    expect(x).to.equal(1);
	    comp.unmount();
	    return expect(y).to.equal(2);
	  });
	  it('component shoud NOT call then_.listeners["mount"] before updating if_', function() {
	    var comp, t, t2, x, y;
	    x = see(0);
	    y = 0;
	    comp = if_(x, t = txt(1), t2 = txt(2));
	    t.on('willMount', function() {
	      return x(1);
	    });
	    t2.on('willUnmount', function() {
	      return y = 2;
	    });
	    comp.mount();
	    expect(x()).to.equal(0, 'mount');
	    x(1);
	    comp.render();
	    expect(x()).to.equal(1);
	    return expect(y).to.equal(0);
	  });
	  return it('component shoud NOT call embeded mountCallback before updating if_', function() {
	    var comp, t, t2, x, y;
	    x = see(0);
	    y = 0;
	    comp = if_(x, p(t = txt(1)), p(t2 = txt(2)));
	    t.on('willMount', function() {
	      return x(1);
	    });
	    comp.mount();
	    expect(x()).to.equal(0);
	    x(1);
	    comp.render();
	    expect(x()).to.equal(1);
	    return expect(y).to.equal(0);
	  });
	});

	describe("delegate event", function() {
	  it('component should delegate click event', function() {
	    var comp, x;
	    x = 0;
	    comp = p();
	    comp.mount();
	    comp.delegate('click');
	    comp.do_click = function() {
	      return x = 1;
	    };
	    comp.node.onclick(fakeEvent(comp.node));
	    return expect(x).to.equal(1);
	  });
	  it('component should delegate click event to its holder', function() {
	    var child, comp, x;
	    x = 0;
	    comp = list([child = p()]);
	    comp.mount();
	    child.delegateToHolder('click');
	    comp.do_click = function() {
	      return x = 1;
	    };
	    child.node.onclick(fakeEvent(child.node));
	    return expect(x).to.equal(1);
	  });
	  it('component should delegate click event from tag ancestor to its holder', function() {
	    var child, comp, lst, x;
	    x = 0;
	    comp = div(lst = list([child = p()]));
	    comp.mount();
	    comp.delegateToHolder('click');
	    lst.do_click = function() {
	      return x = 1;
	    };
	    comp.node.onclick(fakeEvent(child.node));
	    expect(child.node.onclick).to.be["null"];
	    return expect(x).to.equal(1);
	  });
	  return it('component should delegate click event by given component', function() {
	    var child, comp, lst, x;
	    x = 0;
	    comp = div(lst = list([child = p()]));
	    comp.mount();
	    comp.delegateToComponent('click', lst);
	    lst.do_click = function() {
	      return x = 1;
	    };
	    comp.node.onclick(fakeEvent(child.node));
	    expect(child.node.onclick).to.be["null"];
	    return expect(x).to.equal(1);
	  });
	});


/***/ },
/* 22 */
/*!**************************************!*\
  !*** ./test/mocha/test-route.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var Nothing, ddescribe, expect, idescribe, iit, isComponent, ndescribe, nit, rePattern, rePatternTotal, route, slashs, txt, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	rePatternTotal = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]*))+$/;

	rePattern = /^((:([$_\w]+)(\([^\(\)]+\))?)|(\([^\(\)]+\))|([^:\(]+))/;

	slashs = /(?:\\\/)|(?:\\\()|(?:\\\))/;

	isComponent = dc.isComponent, route = dc.route, txt = dc.txt, Nothing = dc.Nothing;

	describe('route', function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('route regexp', function() {
	    it('should match paramName pattern', function() {
	      var params;
	      params = {};
	      route._processPiecePatterns(':dsaf', params);
	      expect(params.dsaf).to.equal(true, ':dsaf');
	      route._processPiecePatterns(':$', params);
	      expect(params.$).to.equal(true, ':$');
	      route._processPiecePatterns(':_', params);
	      return expect(params._).to.equal(true, ':_');
	    });
	    it('should match cureved re', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('(fd+=.)', params, 2);
	      expect(pat[0][0].key).to.equal(2, '(fd+=.)');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns(':a(dsaf)asdfj', params, 2);
	      expect(pat[0][0].key).to.equal('a');
	      return expect(pat[1]).to.equal(2, '(fd+=.)');
	    });
	    it('should match param and string 2', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns(':abc_$(dsaf)asdfj(&*^)+_', params, 2);
	      expect(pat[0][0].key).to.equal('abc_$');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string 3', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('_):_$a(dsaf)asdfj(&*^)+_', params, 2);
	      expect(pat[0][1].key).to.equal('_$a');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should match param and string 3', function() {
	      var params, pat;
	      params = {};
	      pat = route._processPiecePatterns('_):_$a(dsaf):b:c-asdfj(&*^)+_', params, 2);
	      expect(pat[0][1].key).to.equal('_$a');
	      return expect(pat[1]).to.equal(3, '(fd+=.)');
	    });
	    it('should throw while wrong paramName pattern', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 1', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':+', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 2', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('(dfj()', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 3', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('()', params = {});
	      }).to["throw"]();
	    });
	    it('should throw while wrong paramName pattern 4', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns(':(dsaf)', params = {});
	      }).to["throw"]();
	    });
	    return it('should throw while wrong paramName pattern 5', function() {
	      return expect(function() {
	        var params;
	        return route._processPiecePatterns('(', params = {});
	      }).to["throw"]();
	    });
	  });
	  describe('test private function', function() {
	    it('should _getRoutePattern', function() {
	      var pattern;
	      pattern = route._getRoutePattern('a/');
	      return expect(pattern.endSlash).to.equal(true);
	    });
	    it('should _processPatternRouteItem', function() {
	      var comp;
	      comp = route._processRouteItem([
	        {
	          absolute: true,
	          segmentPatterns: [],
	          baseIndex: 0
	        }, function() {
	          return 1;
	        }
	      ], "", 0);
	      expect(!!comp).to.equal(true);
	      return expect(comp.text).to.equal(1);
	    });
	    return it('should _getRoutePattern and _processPatternRouteItem', function() {
	      var comp;
	      comp = route._processRouteItem([
	        route._getRoutePattern(''), function() {
	          return txt(1);
	        }
	      ], "", 0);
	      expect(!!comp).to.equal(true);
	      return expect(comp.text).to.equal(1);
	    });
	  });
	  describe('process route', function() {
	    it("should route 'a'", function() {
	      var comp, content;
	      comp = route('a', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/b' on path 'a'", function() {
	      var comp, content;
	      comp = route('a/b', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route 'a/' on path 'a'", function() {
	      var comp, content;
	      comp = route('a/', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route 'a' on path 'a/'", function() {
	      var comp, content;
	      comp = route('a', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should route '*' on path 'a'", function() {
	      var comp, content;
	      comp = route('*', function(match) {
	        return match.segments[0];
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal('a');
	    });
	    it("should route '(\w+)' on path 'a'", function() {
	      var comp, content;
	      comp = route('(\\w+)', function(match) {
	        return match.items[0];
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.children[0].text).to.equal('a');
	    });
	    it("should not route '*' on path 'a/'", function() {
	      var comp, content;
	      comp = route('*', function(match) {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should not route '*/' on path 'a'", function() {
	      var comp, content;
	      comp = route('*/', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    it("should route 'a/b'", function() {
	      var comp, content;
	      comp = route('a/b', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route multi item", function() {
	      var comp, content;
	      comp = route('a/1', (function() {
	        return 1;
	      }), 'a/2', function() {
	        return 2;
	      });
	      comp.getPath = function() {
	        return 'a/2';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(2);
	    });
	    it("should route multi item with otherwise", function() {
	      var comp, content;
	      comp = route('a/1', (function() {
	        return 1;
	      }), 'a/2', function() {
	        return 2;
	      }, txt('otherwise'));
	      comp.getPath = function() {
	        return 'a/otherwise';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal('otherwise');
	    });
	    it("should route 'a/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/*/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/*/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      expect(!!(content = comp.getContentComponent())).to.equal(true);
	      return expect(content.text).to.equal(1);
	    });
	    it("should route 'a/*/*/**' on path a/b", function() {
	      var comp, content;
	      comp = route('a/*/*/**', function() {
	        return 1;
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      return expect((content = comp.getContentComponent()) instanceof Nothing).to.equal(true);
	    });
	    return it("should route embedding route", function() {
	      var comp, comp2, content;
	      comp = route('a/**', function(match, route2) {
	        return route2('b', function() {
	          return 2;
	        });
	      });
	      comp.getPath = function() {
	        return 'a/b';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal(2);
	    });
	  });
	  describe('multiple level route', function() {
	    var comp;
	    comp = route('a/*/**', function(match, route2) {
	      return route2(1, (function() {
	        return 1;
	      }), 2, function() {
	        return 2;
	      }, 3, function() {
	        return 3;
	      }, {
	        otherwise: 'otherwise 2'
	      });
	    }, 'b/**', function() {
	      return 'b/**';
	    }, {
	      otherwise: 'otherwise 1'
	    });
	    it("should route a/b/3", function() {
	      var comp2, content;
	      comp.getPath = function() {
	        return 'a/b/3';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b/3';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal(3);
	    });
	    it("should route b/2", function() {
	      var content;
	      comp.getPath = function() {
	        return 'b/2';
	      };
	      content = comp.getContentComponent();
	      expect(!!content).to.equal(true);
	      return expect(content.text).to.equal('b/**');
	    });
	    it("should route not-found", function() {
	      var content;
	      comp.getPath = function() {
	        return 'not-found';
	      };
	      content = comp.getContentComponent();
	      expect(!!content).to.equal(true);
	      return expect(content.text).to.equal('otherwise 1');
	    });
	    return it("should route a/b/no-entry", function() {
	      var comp2, content;
	      comp.getPath = function() {
	        return 'a/b/no-entry';
	      };
	      content = comp.getContentComponent();
	      content.getPath = function() {
	        return 'a/b/no-entry';
	      };
	      comp2 = content.getContentComponent();
	      expect(!!comp2).to.equal(true);
	      return expect(comp2.text).to.equal('otherwise 2');
	    });
	  });
	  return describe('process route.to', function() {
	    it("should route.to", function() {
	      expect(route._navigateTo('a/b/c', '../x', 2)).to.equal('a/x');
	      expect(route._navigateTo('a/b/c', 'f', 2)).to.equal('a/b/f');
	      expect(route._navigateTo('a/b/c', '/f', 2)).to.equal('f');
	      expect(route._navigateTo('a/b/c', '/f/', 2)).to.equal('f/');
	      return expect(route._navigateTo('a/b/c', './f/', 2)).to.equal('a/b/f/');
	    });
	    return it("should route.to 2", function() {
	      expect(route._navigateTo('a/b/c', '../../f/', 2)).to.equal('f/');
	      return expect(route._navigateTo('a/b/c', '../../../f/', 2)).to.equal('f/');
	    });
	  });
	});


/***/ },
/* 23 */
/*!*****************************************!*\
  !*** ./test/mocha/test-for-demo.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, List, Tag, Text, a, bindings, button, classFn, controls, ddescribe, demoMap, div, duplex, each, expect, extendAttrs, flow, func, funcEach, idescribe, if_, iit, input, li, list, makeDomComponentTest, ndescribe, nit, p, runDemo, see, span, styleFrom, text, txt, _ref, _ref1;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

	bindings = dc.bindings, duplex = dc.duplex, flow = dc.flow, see = dc.see, classFn = dc.classFn, styleFrom = dc.styleFrom, extendAttrs = dc.extendAttrs, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input, each = dc.each, funcEach = dc.funcEach;

	controls = __webpack_require__(/*! domcom/demo/demo-controls */ 24);

	makeDomComponentTest = __webpack_require__(/*! ../makeDomComponentTest */ 25);

	_ref1 = __webpack_require__(/*! domcom/demo/util */ 26), demoMap = _ref1.demoMap, runDemo = _ref1.runDemo;

	makeDomComponentTest(demoMap, "domcom/demoMap");

	describe('demo and todoMVC', function() {
	  afterEach(function() {
	    return dc.reset();
	  });
	  describe('demo', function() {
	    it('should construct and create components', function() {
	      var a$, a_, b$, b_, comp, sum, t1, x, y, z, _ref2;
	      _ref2 = bindings({
	        a: 3,
	        b: 2
	      }), a$ = _ref2.a$, b$ = _ref2.b$, a_ = _ref2.a_, b_ = _ref2.b_;
	      x = text(a$);
	      y = text(b$);
	      z = p(t1 = txt(sum = flow.add(a_, b_)));
	      expect(sum()).to.equal(5, 'sum 1');
	      a_(1);
	      expect(sum()).to.equal(3, 'sum 2');
	      comp = list(x, y, z);
	      comp.mount('#demo');
	      expect(z.node.innerHTML).to.equal('3', 'mount');
	      x.node.value = '3';
	      y.node.value = '4';
	      x.node.onchange({
	        type: 'change'
	      });
	      y.node.onchange({
	        type: 'change'
	      });
	      expect(a_()).to.equal('3', 'a_');
	      expect(b_()).to.equal('4', 'b_');
	      expect(sum()).to.equal('34', 'sum');
	      expect(!!comp.valid).to.equal(false, 'comp.valid');
	      expect(!!z.valid).to.equal(false, 'z.valid');
	      expect(!!t1.valid).to.equal(false, 't1.valid');
	      comp.render();
	      return expect(z.node.innerHTML).to.equal('34', 'update');
	    });
	    it('should process event property of child component', function() {
	      var c0, comp, x;
	      x = 0;
	      comp = div({}, c0 = input({
	        onmouseenter: function() {
	          return x = 1;
	        }
	      }), div({}, 'wawa'));
	      comp.mount();
	      c0.node.onmouseenter({
	        type: 'mouseenter'
	      });
	      return expect(x).to.equal(1);
	    });
	    it('should process event property of child component with model directive', function() {
	      var c0, comp, x;
	      x = 0;
	      comp = div({}, c0 = input({
	        $model: duplex({}, 'x'),
	        onmouseenter: function() {
	          return x = 1;
	        }
	      }), div({}, 'wawa'));
	      comp.mount();
	      c0.node.onmouseenter({
	        type: 'mouseenter'
	      });
	      return expect(x).to.equal(1);
	    });
	    it('should text model by value', function() {
	      var a$, attrs, comp, m, text1, text2;
	      a$ = bindings(m = {
	        a: 1
	      }).a$;
	      attrs = {
	        onchange: function() {
	          return comp.render();
	        }
	      };
	      comp = list(text1 = text(attrs, a$), text2 = text(attrs, a$));
	      comp.mount();
	      text1.node.value = 3;
	      text1.node.onchange({
	        type: 'change'
	      });
	      expect(m.a).to.equal('3', 'm.a');
	      return expect(text2.node.value).to.equal('3', 'text2.node.value');
	    });
	    it('should text model by value and onchange', function() {
	      var a$, attrs, comp, m, text1, text2;
	      a$ = bindings(m = {
	        a: 1
	      }).a$;
	      attrs = {
	        value: a$,
	        onchange: function(event, node) {
	          a$(node.value);
	          return comp.render();
	        }
	      };
	      comp = list(text1 = text(attrs), text2 = text(attrs));
	      comp.mount();
	      text1.node.value = 3;
	      text1.node.onchange({
	        type: 'change'
	      });
	      expect(m.a).to.equal('3', 'm.a');
	      return expect(text2.node.value).to.equal('3', 'text2.node.value');
	    });
	    it('should combobox', function() {
	      var attrs, comp, input1, item, items, opts, showingItems, value;
	      showingItems = see(false);
	      comp = null;
	      value = see('');
	      opts = (function() {
	        var _i, _len, _ref2, _results;
	        _ref2 = [1, 2];
	        _results = [];
	        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	          item = _ref2[_i];
	          _results.push((function(item) {
	            return span({
	              style: {
	                display: 'block',
	                border: "1px solid blue",
	                "min-width": "40px"
	              },
	              onclick: function() {
	                value(item);
	                return comp.render();
	              }
	            }, item);
	          })(item));
	        }
	        return _results;
	      })();
	      attrs = extendAttrs(attrs, {
	        onmouseleave: (function() {
	          showingItems(false);
	          return comp.render();
	        })
	      });
	      comp = div(attrs, input1 = input({
	        $model: value,
	        onmouseenter: (function() {
	          showingItems(true);
	          return comp.render();
	        })
	      }), items = div({
	        style: {
	          display: flow(showingItems, function() {
	            if (showingItems()) {
	              return 'block';
	            } else {
	              return 'none';
	            }
	          })
	        }
	      }, opts));
	      comp.mount();
	      expect(input1.node.value).to.equal('');
	      expect(showingItems()).to.equal(false);
	      expect(items.node.style.display).to.equal('none');
	      input1.node.onmouseenter({
	        type: 'mouseenter'
	      });
	      expect(items.node.style.display).to.equal('block');
	      opts[1].node.onclick({
	        type: 'click'
	      });
	      return expect(input1.node.value).to.equal('2');
	    });
	    it('should mount controls and others', function() {
	      var comp;
	      comp = controls();
	      comp.mount('#demo');
	      expect(comp.node.length).to.equal(2);
	      return comp.unmount();
	    });
	    it('should always switch demo', function(done) {
	      var comp, sel;
	      comp = runDemo(demoMap, 'each2');
	      sel = comp.children[0];
	      sel.node.value = 'each3';
	      sel.node.onchange({
	        type: 'change'
	      });
	      expect(comp.children[1].node.innerHTML).to.equal("<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>");
	      return setTimeout((function() {
	        sel.node.value = 'each2';
	        sel.node.onchange({
	          type: 'change'
	        });
	        return setTimeout((function() {
	          sel.node.value = 'each3';
	          sel.node.onchange({
	            type: 'change'
	          });
	          expect(comp.children[1].node.innerHTML).to.contain("<p>1</p><p>2</p><p>3</p><p>4</p>");
	          return done();
	        }), 300);
	      }), 1100);
	    });
	    return it('should mount/unmount sub component', function() {
	      var buttons, comp, div1;
	      div1 = div('toggle me');
	      buttons = list(div({
	        onclick: (function() {
	          return div1.mount();
	        })
	      }, 'mount', div({
	        onclick: (function() {
	          return div1.unmount();
	        })
	      }, 'unmount')));
	      comp = list(buttons, div1);
	      div1.mount();
	      div1.unmount();
	      comp.mount();
	      return comp.unmount();
	    });
	  });
	  return describe('todomvc', function() {
	    var makeTodo, status;
	    status = null;
	    it('should process class', function() {
	      var comp;
	      comp = a({
	        className: {
	          selected: 1
	        },
	        href: "#/"
	      });
	      comp.mount('#demo');
	      return expect(comp.node.className).to.equal('selected');
	    });
	    it('should construct and create components', function() {
	      var comp;
	      comp = li(a({
	        className: {
	          selected: 1
	        },
	        href: "#/"
	      }, "All"));
	      comp.mount('#demo');
	      expect(comp.children[0].node.className).to.equal('selected');
	      return expect(comp.children[0].node.href).to.match(/:\/\//);
	    });
	    makeTodo = function(todos, status) {
	      var getTodos;
	      status.hash = 'all';
	      getTodos = function() {
	        if (status.hash === 'active') {
	          return todos.filter(function(todo) {
	            return todo && !todo.completed;
	          });
	        } else if (status.hash === 'completed') {
	          return todos.filter(function(todo) {
	            return todo && todo.completed;
	          });
	        } else {
	          return todos;
	        }
	      };
	      return funcEach(getTodos, function(todo) {
	        return p(txt(function() {
	          return todo.title;
	        }), ', ', txt(function() {
	          if (todo.completed) {
	            return 'completed';
	          } else {
	            return 'uncompleted';
	          }
	        }));
	      });
	    };
	    it('should mount getTodos and each with empty todos correctly', function() {
	      var comp, todos;
	      todos = [];
	      comp = makeTodo(todos, {
	        hash: 'all'
	      });
	      comp.mount();
	      return expect(comp.node.length).to.equal(0);
	    });
	    it('should invalidate children to listComponent', function() {
	      var comp, todos;
	      todos = [
	        {
	          title: 'do this'
	        }
	      ];
	      comp = makeTodo(todos, status = {
	        hash: 'all'
	      });
	      comp.mount();
	      expect(comp.children.length).to.equal(1, '1-1');
	      status.hash = 'completed';
	      comp.render();
	      expect(comp.children.length).to.equal(0, '1-2');
	      status.hash = 'all';
	      comp.render();
	      return expect(comp.children.length).to.equal(1, '1-3');
	    });
	    it('should process getTodos and each correctly', function() {
	      var comp, todos;
	      todos = [
	        {
	          title: 'do this'
	        }
	      ];
	      comp = makeTodo(todos, status = {
	        hash: 'all'
	      });
	      comp.mount();
	      expect(comp.node.length).to.equal(1);
	      status.hash = 'completed';
	      comp.render();
	      expect(comp.node.length).to.equal(0);
	      status.hash = 'all';
	      comp.render();
	      return expect(comp.node.length).to.equal(1);
	    });
	    it('should todoEditArea', function() {
	      var comp, footer, lst, section, todoItems, ul;
	      section = dc.section, ul = dc.ul, footer = dc.footer;
	      todoItems = each(lst = [1, 2], function(todo, index) {
	        return li(todo);
	      });
	      comp = section({
	        id: "main"
	      }, ul({
	        id: "todo-list"
	      }, todoItems), footer({
	        id: "footer"
	      }));
	      comp.mount();
	      expect(todoItems.node.length).to.equal(2);
	      lst.push(3);
	      comp.render();
	      return expect(todoItems.node.length).to.equal(3);
	    });
	    return it('should switch todo by status', function() {
	      var comp, getTodos, state, todos;
	      state = 2;
	      todos = [1, 2, 3, 4, 5, 6];
	      getTodos = function() {
	        if (state === 0) {
	          return todos.filter(function(todo) {
	            return todo && todo % 2 === 0;
	          });
	        } else if (state === 1) {
	          return todos.filter(function(todo) {
	            return todo && todo % 2 === 1;
	          });
	        } else {
	          return todos.filter(function(todo) {
	            return todo;
	          });
	        }
	      };
	      comp = funcEach(getTodos, function(todo, index) {
	        return txt(' ' + todo);
	      });
	      comp.mount();
	      expect(comp.children.length).to.equal(6);
	      expect(comp.node.length).to.equal(6);
	      expect(comp.node[0].textContent).to.equal(' 1');
	      expect(comp.node[1].textContent).to.equal(' 2');
	      state = 0;
	      comp.render();
	      expect(comp.children.length).to.equal(3, 'children 2');
	      expect(comp.node.length).to.equal(3);
	      expect(comp.node[0].textContent).to.equal(' 2');
	      expect(comp.node[1].textContent).to.equal(' 4');
	      state = 1;
	      comp.render();
	      expect(comp.children.length).to.equal(3, 'children 3');
	      expect(comp.node.length).to.equal(3);
	      expect(comp.node[0].textContent).to.equal(' 1');
	      return expect(comp.node[1].textContent).to.equal(' 3');
	    });
	  });
	});


/***/ },
/* 24 */
/*!***********************************!*\
  !*** ./demo/demo-controls.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var a, bindings, checkbox, list, p, text;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

	module.exports = function() {
	  var a$, cbx1, cbx2, checkboxes, text1, text2, texts;
	  a$ = bindings({
	    a: 1
	  }).a$;
	  checkboxes = list(cbx1 = checkbox(a$), cbx2 = checkbox(a$));
	  texts = list((text1 = text(a$)), (text2 = text(a$)));
	  a$(6);
	  return list(checkboxes, texts).renderWhen([cbx1, cbx2, text1, text2], 'change');
	};


/***/ },
/* 25 */
/*!******************************************!*\
  !*** ./test/makeDomComponentTest.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var ddescribe, expect, idescribe, iit, isComponent, ndescribe, nit, _ref;

	_ref = __webpack_require__(/*! bdd-test-helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, ddescribe = _ref.ddescribe;

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


/***/ },
/* 26 */
/*!**************************!*\
  !*** ./demo/util.coffee ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	var case_, chooseFramework, demoEachPush, demoIfEach, demoModelOnMultipleInput, div, each, eachDemo1, eachDemo2, eachDemo3, eachDemo4, func, if_, list, makeDemoComponent, p, see, select, _ref, _ref1;

	select = dc.select, see = dc.see, if_ = dc.if_, case_ = dc.case_, list = dc.list, func = dc.func, each = dc.each, div = dc.div, p = dc.p;

	dc.directives({
	  $options: dc.$options,
	  $model: dc.$model
	});

	_ref = __webpack_require__(/*! ./demo-each */ 27), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

	chooseFramework = __webpack_require__(/*! ./demo-choose-web-framework */ 28);

	_ref1 = __webpack_require__(/*! ./demo-debug */ 29), demoEachPush = _ref1.demoEachPush, demoIfEach = _ref1.demoIfEach, demoModelOnMultipleInput = _ref1.demoModelOnMultipleInput;

	exports.demoMap = {
	  'choose web framework': chooseFramework,
	  "show hide": __webpack_require__(/*! ./demo-show-hide */ 30),
	  counter: __webpack_require__(/*! ./demo-counter */ 31),
	  event: __webpack_require__(/*! ./demo-event */ 32),
	  controls: __webpack_require__(/*! ./demo-controls */ 24),
	  "if": __webpack_require__(/*! ./demo-if-component */ 33),
	  each1: eachDemo1,
	  each2: eachDemo2,
	  each3: eachDemo3,
	  each4: eachDemo4,
	  'switch 1 2 3 4': __webpack_require__(/*! ./demo-switch-1-2-3-4 */ 34),
	  sum: __webpack_require__(/*! ./demo-sum */ 35),
	  'text model': __webpack_require__(/*! ./demo-text-model */ 36),
	  'mount/unmount': __webpack_require__(/*! ./demo-mount-unmount */ 37)
	};

	exports.makeDemoComponent = makeDemoComponent = function(demoMap, initItem) {
	  var comp, componentsMap, currentItem, demoSelect, else_, key;
	  currentItem = see(initItem);
	  componentsMap = {};
	  for (key in demoMap) {
	    comp = demoMap[key];
	    if (typeof comp === 'function') {
	      componentsMap[key] = comp();
	    } else {
	      componentsMap[key] = comp;
	    }
	  }
	  comp = list(demoSelect = select({
	    $options: [Object.keys(demoMap)],
	    $model: currentItem
	  }), div(case_(currentItem, componentsMap, else_ = componentsMap[initItem])));
	  return comp.renderWhen(demoSelect, 'change');
	};

	exports.runDemo = function(demoMap, initItem, element) {
	  var comp;
	  comp = makeDemoComponent(demoMap, initItem);
	  return comp.mount(element);
	};


/***/ },
/* 27 */
/*!*******************************!*\
  !*** ./demo/demo-each.coffee ***!
  \*******************************/
/***/ function(module, exports) {

	var each, list, p, txt;

	list = dc.list, each = dc.each, p = dc.p, txt = dc.txt;

	exports.eachDemo1 = function() {
	  var comp, lst1;
	  lst1 = [1, 2];
	  return comp = list(lst1);
	};

	exports.eachDemo2 = function() {
	  var lst2;
	  lst2 = [1, 2];
	  return each(lst2, function(item) {
	    return p(item);
	  });
	};

	exports.eachDemo3 = function() {
	  var comp, lst3;
	  lst3 = [1, 2, 3, 4, 5, 6];
	  comp = each(lst3, function(item) {
	    return p(item);
	  });
	  comp.on('willAttach', function() {
	    setTimeout((function() {
	      lst3.push(7);
	      return comp.render();
	    }), 1000);
	    return setTimeout((function() {
	      lst3.setLength(4);
	      comp.render();
	      return dc.clean();
	    }), 2000);
	  });
	  return comp;
	};

	exports.eachDemo4 = function() {
	  var comp, lst4;
	  lst4 = [1, 2, 3, 4, 5, 6];
	  comp = each(lst4, function(item) {
	    return txt(item);
	  });
	  comp.on('willAttach', function() {
	    setTimeout((function() {
	      lst4.push(7);
	      return comp.render();
	    }), 1000);
	    return setTimeout((function() {
	      lst4.setLength(4);
	      comp.render();
	      return dc.clean();
	    }), 2000);
	  });
	  return comp;
	};


/***/ },
/* 28 */
/*!***********************************************!*\
  !*** ./demo/demo-choose-web-framework.coffee ***!
  \***********************************************/
/***/ function(module, exports) {

	var case_, div, each, every, flow, func, label, list, see, text;

	flow = dc.flow, see = dc.see, case_ = dc.case_, each = dc.each, every = dc.every, func = dc.func, list = dc.list, div = dc.div, label = dc.label, text = dc.text;

	module.exports = function() {
	  var caseMap, choice, comp, firstLetter$, frameworks, item, items, prefered, prompt, _i, _len;
	  firstLetter$ = see('d', function(x) {
	    return x.toLowerCase();
	  });
	  comp = null;
	  prompt = label('Please choose: ');
	  prefered = text({
	    onchange: function() {
	      comp.render();
	      return dc.clean();
	    }
	  }, firstLetter$);
	  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
	  items = every(frameworks, function(item) {
	    return div("" + item[0] + ". " + item);
	  });
	  caseMap = {};
	  for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
	    item = frameworks[_i];
	    caseMap[item[0]] = item;
	  }
	  choice = case_(firstLetter$, caseMap, 'some other things');
	  return comp = list(prompt, prefered, items, div("You perfer ", choice, "."));
	};

	module.exports = function() {
	  var added, choice, comp, firstLetter$, frameworks, items, prefered, prompt, prompt2;
	  firstLetter$ = see('d', function(x) {
	    return x.toLowerCase();
	  });
	  comp = null;
	  prompt = label('Please choose: ');
	  prefered = text({
	    onchange: function() {
	      return comp.render();
	    }
	  }, firstLetter$);
	  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];
	  items = each(frameworks, function(item) {
	    return div("" + item[0] + ". " + item);
	  });
	  prompt2 = label('add some others: ');
	  added = text({
	    onchange: function(event, node) {
	      var newFramework;
	      newFramework = node.value;
	      frameworks.push(newFramework);
	      firstLetter$(newFramework[0]);
	      comp.render();
	      return dc.clean();
	    }
	  });
	  choice = func(flow(firstLetter$, function() {
	    var firstLetter, item, _i, _len;
	    firstLetter = firstLetter$();
	    for (_i = 0, _len = frameworks.length; _i < _len; _i++) {
	      item = frameworks[_i];
	      if (item[0].toLowerCase() === firstLetter) {
	        return item;
	      }
	    }
	    return 'some other things';
	  }));
	  return comp = list(prompt, prefered, prompt2, added, items, div("You perfer ", choice, "."));
	};


/***/ },
/* 29 */
/*!********************************!*\
  !*** ./demo/demo-debug.coffee ***!
  \********************************/
/***/ function(module, exports) {

	var div, duplex, each, if_, list, p, see, text;

	see = dc.see, if_ = dc.if_, list = dc.list, each = dc.each, div = dc.div, p = dc.p, text = dc.text, duplex = dc.duplex;

	exports.demoEachPush = function() {
	  var comp, lst;
	  lst = [1, 2];
	  comp = list(each(lst, function(item) {
	    return p(item);
	  }), 'some other thing');
	  comp.mount();
	  lst.push(3);
	  return comp.render();
	};

	exports.demoIfEach = function() {
	  var comp, lst4, showingEach$;
	  showingEach$ = see(true);
	  lst4 = [1, 2];
	  comp = if_(showingEach$, each(lst4, function(item) {
	    return div(item);
	  }));
	  comp.mount();
	  showingEach$(false);
	  comp.render();
	  dc.clean();
	  showingEach$(true);
	  comp.render();
	  return dc.clean();
	};

	exports.demoModelOnMultipleInput = function() {
	  var a, text1, text2;
	  a = {};
	  text1 = text({
	    $model: duplex(a, 'x')
	  });
	  text2 = text({
	    $model: duplex(a, 'x')
	  });
	  return list(text1, text2).renderWhen([text1, text2], 'change').mount();
	};


/***/ },
/* 30 */
/*!************************************!*\
  !*** ./demo/demo-show-hide.coffee ***!
  \************************************/
/***/ function(module, exports) {

	var div, flow, list, p, see, text, toggle;

	list = dc.list, text = dc.text, div = dc.div, p = dc.p, see = dc.see, flow = dc.flow;

	toggle = flow.toggle;

	module.exports = function() {
	  var comp, x;
	  x = see(true);
	  return comp = list(div({
	    onclick: function() {
	      toggle(x);
	      return comp.render();
	    }
	  }, 'show/hide by changing style.display'), p({
	    "class": {},
	    style: {
	      display: function() {
	        if (x()) {
	          return 'block';
	        } else {
	          return 'none';
	        }
	      }
	    }
	  }, 'asdfdfs'));
	};


/***/ },
/* 31 */
/*!**********************************!*\
  !*** ./demo/demo-counter.coffee ***!
  \**********************************/
/***/ function(module, exports) {

	var p, see, txt;

	txt = dc.txt, p = dc.p, see = dc.see;

	module.exports = function() {
	  var counter, counter$;
	  counter$ = see(counter = 0);
	  return p(txt(counter$)).on('willAttach', function() {
	    var count, countHandle;
	    count = function() {
	      counter$(counter++);
	      if (counter === 1001) {
	        return clearInterval(countHandle);
	      }
	    };
	    return countHandle = setInterval(count, 1);
	  }).renderWhen(setInterval, 16, {
	    clear: function() {
	      return counter >= 1000;
	    }
	  });
	};


/***/ },
/* 32 */
/*!********************************!*\
  !*** ./demo/demo-event.coffee ***!
  \********************************/
/***/ function(module, exports) {

	var a, checkbox, list, p, text;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p;

	module.exports = function() {
	  var noPropagation, propagation;
	  propagation = a({
	    onclick: function() {
	      return alert('parent');
	    }
	  }, p({
	    onclick: function(event) {
	      alert('child');
	      return event.continuePropagation = true;
	    }
	  }, 'propagation'));
	  noPropagation = a({
	    onclick: function() {
	      return alert('parent');
	    }
	  }, p({
	    onclick: function(event) {
	      return alert('child');
	    }
	  }, 'do not propagation'));
	  return list(propagation, noPropagation);
	};


/***/ },
/* 33 */
/*!***************************************!*\
  !*** ./demo/demo-if-component.coffee ***!
  \***************************************/
/***/ function(module, exports) {

	var div, if_, list, see, text;

	list = dc.list, if_ = dc.if_, text = dc.text, div = dc.div, see = dc.see;

	module.exports = function() {
	  var comp, x;
	  x = see(0, parseNumber);
	  return comp = list(text({
	    onchange: function() {
	      x = parseInt(this.node.value);
	      comp.render();
	      return dc.clean();
	    }
	  }, x), if_(x, div(1), div(2)));
	};

	module.exports = function() {
	  var comp, x;
	  x = see(0, parseFloat);
	  return comp = list(text({
	    onchange: function() {
	      comp.render();
	      return dc.clean();
	    }
	  }, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')));
	};


/***/ },
/* 34 */
/*!*****************************************!*\
  !*** ./demo/demo-switch-1-2-3-4.coffee ***!
  \*****************************************/
/***/ function(module, exports) {

	var div, each, flow, func, list, number, see;

	func = dc.func, see = dc.see, flow = dc.flow, each = dc.each, list = dc.list, div = dc.div, number = dc.number;

	module.exports = function() {
	  var comp, indexInput, lst, x;
	  x = 0;
	  comp = null;
	  indexInput = number({
	    onchange: function() {
	      x = parseInt(this.node.value);
	      comp.render();
	      return dc.clean();
	    }
	  });
	  lst = each([0, 1, 2, 3], function(item) {
	    return div({
	      style: {
	        display: function() {
	          if (item === x) {
	            return 'block';
	          } else {
	            return 'none';
	          }
	        }
	      }
	    }, item);
	  });
	  return comp = list(indexInput, lst);
	};

	module.exports = function() {
	  var comp, indexInput, x;
	  x = 0;
	  comp = null;
	  indexInput = number({
	    onchange: function() {
	      x = parseInt(this.node.value);
	      comp.render();
	      return dc.clean();
	    }
	  });
	  return comp = list(indexInput, func(function() {
	    if (x >= 0 && x <= 3) {
	      return div(x);
	    }
	  }));
	};

	module.exports = function() {
	  var comp, num, x;
	  x = see(0);
	  comp = list(num = number(x), func(flow(x, function() {
	    var v;
	    v = x();
	    if (v >= 0 && v <= 3) {
	      return div(v);
	    }
	  })));
	  return comp.renderWhen(num, 'change');
	};


/***/ },
/* 35 */
/*!******************************!*\
  !*** ./demo/demo-sum.coffee ***!
  \******************************/
/***/ function(module, exports) {

	var demoSum, flow, list, p, see, text;

	see = dc.see, flow = dc.flow, list = dc.list, text = dc.text, p = dc.p;

	module.exports = demoSum = function() {
	  var a, b, comp, p1, t1, t2;
	  a = see(1, parseFloat);
	  b = see(2, parseFloat);
	  comp = list(t1 = text({
	    value: a,
	    onchange: function() {
	      return a(this.node.value);
	    }
	  }), t2 = text({
	    value: b,
	    onchange: function() {
	      return b(this.node.value);
	    }
	  }), p1 = p(flow.add(a, b)));
	  return comp.renderWhen([t1, t2], 'change');
	};

	module.exports = demoSum = function() {
	  var a, b, p1, t1, t2;
	  a = see(1);
	  b = see(2);
	  return list((t1 = text({
	    value: a,
	    onchange: (function() {
	      return a(this.node.value * 1);
	    })
	  })), (t2 = text({
	    value: b,
	    onchange: (function() {
	      return b(this.node.value * 1);
	    })
	  })), p1 = p(flow.add(a, b))).renderWhen([t1, t2], 'change');
	};


/***/ },
/* 36 */
/*!*************************************!*\
  !*** ./demo/demo-text-model.coffee ***!
  \*************************************/
/***/ function(module, exports) {

	var a, bindings, checkbox, list, text;

	list = dc.list, bindings = dc.bindings, a = dc.a, checkbox = dc.checkbox, text = dc.text;

	module.exports = function() {
	  var a$, attrs, comp;
	  a$ = bindings({
	    a: 1
	  }).a$;
	  attrs = {
	    onchange: function() {
	      return comp.render();
	    }
	  };
	  return comp = list(a = text(attrs, a$), text(attrs, a$));
	};


/***/ },
/* 37 */
/*!****************************************!*\
  !*** ./demo/demo-mount-unmount.coffee ***!
  \****************************************/
/***/ function(module, exports) {

	var div, if_, list, see;

	list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

	module.exports = function() {
	  var active, if1;
	  active = see(true);
	  return list(div({
	    onclick: function() {
	      active(true);
	      return if1.render();
	    }
	  }, 'mount'), div({
	    onclick: function() {
	      active(false);
	      if1.render();
	      return dc.clean();
	    }
	  }, 'unmount'), if1 = if_(active, div('toggle me')));
	};


/***/ }
/******/ ]);