(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["dc"] = factory();
	else
		root["dc"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	var dc, extend;

	window.dc = module.exports = dc = __webpack_require__(4);

	dc.extend = extend = __webpack_require__(9);

	extend(dc, __webpack_require__(7), __webpack_require__(2), __webpack_require__(1), __webpack_require__(6), __webpack_require__(3), __webpack_require__(10));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var flow, react, slice,
	  __slice = [].slice;

	react = (flow = __webpack_require__(2)).react;

	module.exports = flow;

	slice = Array.prototype.slice;

	flow.watchEachList = function(listItems, component) {
	  var pop, push, reverse, shift, sort, splice, unshift, watchingComponents;
	  watchingComponents = listItems.watchingComponents || (listItems.watchingComponents = {});
	  watchingComponents[component.dcid] = component;
	  if (listItems.$dcWatching) {
	    return;
	  }
	  listItems.$dcWatching = true;
	  shift = listItems.shift;
	  pop = listItems.pop;
	  push = listItems.push;
	  reverse = listItems.reverse;
	  sort = listItems.sort;
	  splice = listItems.splice;
	  unshift = listItems.unshift;
	  listItems.setItem = function() {
	    var dcid, i, j, listLength, startIndex, values, valuesLength;
	    startIndex = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    startIndex = startIndex >>> 0;
	    if (startIndex < 0) {
	      throw new Error('array index is negative');
	    }
	    listLength = listItems.length;
	    i = startIndex;
	    j = 0;
	    valuesLength = values.length;
	    while (j < valuesLength) {
	      listItems[i] = values[j];
	      i++;
	      j++;
	    }
	    if (startIndex < listLength) {
	      for (dcid in watchingComponents) {
	        component = watchingComponents[dcid];
	        component.invalidateChildren(startIndex, i);
	      }
	    } else {
	      for (dcid in watchingComponents) {
	        component = watchingComponents[dcid];
	        component.invalidateChildren(listLength, i);
	      }
	    }
	  };
	  listItems.pop = function() {
	    var dcid, listLength, result;
	    listLength = listItems.length;
	    if (!listLength) {
	      return;
	    }
	    result = pop.call(this);
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(listLength - 1, listLength);
	    }
	    return result;
	  };
	  listItems.push = function() {
	    var dcid, listLength, oldLength, result;
	    oldLength = listItems.length;
	    result = push.apply(listItems, arguments);
	    listLength = listItems.length;
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(oldLength, listLength);
	    }
	    return result;
	  };
	  listItems.shift = function() {
	    var dcid, listLength, result;
	    if (!listItems.length) {
	      return;
	    }
	    result = shift.call(this);
	    listLength = listItems.length;
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(0, listLength);
	    }
	    return result;
	  };
	  listItems.unshift = function() {
	    var dcid, listLength, result;
	    result = unshift.apply(listItems, arguments);
	    listLength = listItems.length;
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(0, listLength);
	    }
	    return result;
	  };
	  listItems.reverse = function() {
	    var dcid, listLength;
	    listLength = listItems.length;
	    if (listLength <= 1) {
	      return listItems;
	    }
	    reverse.call(listItems);
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(0, listLength);
	    }
	    return listItems;
	  };
	  listItems.sort = function() {
	    var dcid, listLength;
	    listLength = listItems.length;
	    if (listLength <= 1) {
	      return listItems;
	    }
	    sort.call(listItems);
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      component.invalidateChildren(0, listLength);
	    }
	    return listItems;
	  };
	  listItems.splice = function(start, deleteCount) {
	    var dcid, inserted, len, listLength, oldListLength, result;
	    len = arguments.length;
	    oldListLength = listItems.length;
	    start = start >>> 0;
	    if (start < 0) {
	      start = 0;
	    }
	    if (start > oldListLength) {
	      start = oldListLength;
	    }
	    inserted = slice.call(arguments, 2);
	    result = splice.apply(this, [start, deleteCount].concat(inserted));
	    listLength = listItems.length;
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      if (oldListLength === listLength) {
	        component.invalidateChildren(start, start + deleteCount);
	      } else {
	        component.invalidateChildren(start, Math.max(oldListLength, listLength));
	      }
	    }
	    return result;
	  };
	  return listItems.setLength = function(length) {
	    var dcid, oldListLength;
	    oldListLength = listItems.length;
	    if (length === oldListLength) {
	      return;
	    }
	    listItems.length = length;
	    for (dcid in watchingComponents) {
	      component = watchingComponents[dcid];
	      if (length > oldListLength) {
	        component.invalidateChildren(oldListLength, length);
	      } else {
	        component._setLength(length);
	      }
	    }
	  };
	};

	flow.watchEachObject = function(objectItems, component) {
	  var watchingComponents;
	  watchingComponents = objectItems.watchingComponents || (objectItems.watchingComponents = {});
	  watchingComponents[component.dcid] = component;
	  if (objectItems.$dcWatching) {
	    return;
	  }
	  objectItems.$dcWatching = true;
	  objectItems.deleteItem = function() {
	    var dcid, index, items, key, key1, keys, min, oldItemsLength, _, _i, _j, _len, _len1, _ref, _ref1, _results;
	    keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    items = component._items;
	    oldItemsLength = items.length;
	    _results = [];
	    for (_i = 0, _len = keys.length; _i < _len; _i++) {
	      key = keys[_i];
	      if (!objectItems.hasOwnProperty(key)) {
	        continue;
	      }
	      delete objectItems[key];
	      for (dcid in watchingComponents) {
	        component = watchingComponents[dcid];
	        min = oldItemsLength;
	        _ref = component.items;
	        for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
	          _ref1 = _ref[index], key1 = _ref1[0], _ = _ref1[1];
	          if (key1==key) {
	            items.splice(index, 1);
	            if (index < min) {
	              min = index;
	            }
	            component.invalidateChildren(min, oldItemsLength);
	            break;
	          }
	        }
	      }
	      _results.push(oldItemsLength--);
	    }
	    return _results;
	  };
	  objectItems.setItem = function(key, value) {
	    var dcid, index, items, key1, length, _, _results, _results1;
	    items = component._items;
	    if (objectItems.hasOwnProperty(key)) {
	      if (objectItems[key] !== value) {
	        _results = [];
	        for (dcid in watchingComponents) {
	          component = watchingComponents[dcid];
	          _results.push((function() {
	            var _i, _len, _ref, _results1;
	            _results1 = [];
	            for (index = _i = 0, _len = items.length; _i < _len; index = ++_i) {
	              _ref = items[index], key1 = _ref[0], _ = _ref[1];
	              if (key1==key) {
	                component.invalidateChildren(index, index + 1);
	                break;
	              } else {
	                _results1.push(void 0);
	              }
	            }
	            return _results1;
	          })());
	        }
	        return _results;
	      }
	    } else {
	      length = _items.length;
	      _results1 = [];
	      for (dcid in watchingComponents) {
	        component = watchingComponents[dcid];
	        _items.push([key, value]);
	        _results1.push(component.invalidateChildren(length, length + 1));
	      }
	      return _results1;
	    }
	  };
	  return objectItems.extend = function(obj) {
	    var key, value, _results;
	    _results = [];
	    for (key in obj) {
	      value = obj[key];
	      _results.push(objectItems.setItem(key, value));
	    }
	    return _results;
	  };
	};

	flow.pour = function(itemFn) {
	  itemFn.pouring = true;
	  return itemFn;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var dependent, flow, funcString, newLine, react, renew, see, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(3), newLine = _ref.newLine, funcString = _ref.funcString;

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dupStr, globalDcid,
	  __slice = [].slice;

	exports.isArray = function(item) {
	  return Object.prototype.toString.call(item) === '[object Array]';
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

	exports.substractSet = function(whole, part) {
	  var key;
	  for (key in part) {
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
	      0;
	    } else {
	      1;
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

	exports.numbers = function(n) {
	  var flow, i, result;
	  flow = __webpack_require__(2);
	  if (typeof n === 'function') {
	    return flow(n, function() {
	      var i, length, result;
	      i = 0;
	      result = [];
	      length = n();
	      while (i < length) {
	        result.push(i);
	        i++;
	      }
	      return result;
	    });
	  } else {
	    i = 0;
	    result = [];
	    while (i < n) {
	      result.push(i);
	      i++;
	    }
	    return result;
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var DomNode, addRenderUpdate, addSetIntervalUpdate, dc, dcid, directiveRegistry, domNodeCache, isComponent, isElement, isEven, newDcid, querySelector, raf, readyFnList, render, renderCallbackList, renderLoop, requestAnimationFrame, _ref, _ref1, _ref2, _renderComponentWhenBy;

	DomNode = __webpack_require__(5);

	_ref = __webpack_require__(6), requestAnimationFrame = _ref.requestAnimationFrame, raf = _ref.raf, isElement = _ref.isElement;

	_ref1 = __webpack_require__(3), newDcid = _ref1.newDcid, isEven = _ref1.isEven;

	_ref2 = __webpack_require__(7), domNodeCache = _ref2.domNodeCache, readyFnList = _ref2.readyFnList, directiveRegistry = _ref2.directiveRegistry, renderCallbackList = _ref2.renderCallbackList;

	isComponent = __webpack_require__(8);


	/** @api dc(element) - dc component constructor
	 *
	 * @param element
	 */

	module.exports = dc = function(element, options) {
	  if (options == null) {
	    options = {};
	  }
	  if (typeof element === 'string') {
	    if (options.noCache) {
	      return querySelector(element, options.all);
	    } else {
	      return domNodeCache[element] || (domNodeCache[element] = querySelector(element, options.all));
	    }
	  } else if (element instanceof Node || element instanceof NodeList || element instanceof Array) {
	    if (options.noCache) {
	      return new DomNode(element);
	    } else {
	      if (element.dcid) {
	        return domNodeCache[element.dcid];
	      } else {
	        element.dcid = newDcid();
	        return domNodeCache[element.dcid] = new DomNode(element);
	      }
	    }
	  } else {
	    throw new Error('error type for dc');
	  }
	};

	querySelector = function(selector, all) {
	  if (all) {
	    return new DomNode(document.querySelectorAll(selector));
	  } else {
	    return new DomNode(document.querySelector(selector));
	  }
	};

	window.dcid = newDcid();

	dcid = document.dcid = newDcid();

	window.$document = dc.$document = domNodeCache[dcid] = new DomNode(document);

	dcid = document.body.dcid = newDcid();

	window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body);

	dc.onReady = function(callback) {
	  return readyFnList.push(callback);
	};

	dc.offReady = function(callback) {
	  return readyFnList.indexOf(callback) >= 0 && readyFnList.splice(index, 1);
	};

	dc.ready = function() {
	  var callback, _i, _len;
	  for (_i = 0, _len = readyFnList.length; _i < _len; _i++) {
	    callback = readyFnList[_i];
	    callback();
	  }
	};

	document.addEventListener('DOMContentLoaded', dc.ready, false);

	dc.render = render = function() {
	  var callback, _i, _len, _results;
	  _results = [];
	  for (_i = 0, _len = renderCallbackList.length; _i < _len; _i++) {
	    callback = renderCallbackList[_i];
	    _results.push(callback());
	  }
	  return _results;
	};

	dc.onRender = function(callback) {
	  return renderCallbackList.push(callback);
	};

	dc.offRender = function(callback) {
	  return renderCallbackList.indexOf(callback) >= 0 && renderCallbackList.splice(index, 1);
	};

	dc.renderLoop = renderLoop = function() {
	  requestAnimFrame(renderLoop);
	  render();
	};

	dc.updateWhen = function(components, events, updateList, options) {
	  return dc._renderWhenBy('update', components, events, updateList, options);
	};

	dc.renderWhen = function(components, events, updateList, options) {
	  return dc._renderWhenBy('render', components, events, updateList, options);
	};

	dc._renderWhenBy = function(method, components, events, updateList, options) {
	  var component, event, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n;
	  if (components instanceof Array) {
	    if (!(updateList instanceof Array)) {
	      updateList = [updateList];
	    }
	    if (events instanceof Array) {
	      for (_i = 0, _len = components.length; _i < _len; _i++) {
	        component = components[_i];
	        for (_j = 0, _len1 = events.length; _j < _len1; _j++) {
	          event = events[_j];
	          _renderComponentWhenBy(method, component, event, updateList);
	        }
	      }
	    } else {
	      for (_k = 0, _len2 = components.length; _k < _len2; _k++) {
	        component = components[_k];
	        _renderComponentWhenBy(method, component, events, updateList);
	      }
	    }
	  } else if (components === setInterval) {
	    if (isComponent(events)) {
	      addSetIntervalUpdate(method, events, updateList);
	    } else if (events instanceof Array) {
	      for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
	        component = events[_l];
	        addSetIntervalUpdate(method, events, updateList);
	      }
	    } else if (typeof events === 'number') {
	      options = options || {};
	      options.interval = events;
	      addSetIntervalUpdate(method, updateList, options);
	    }
	  } else if (components === render) {
	    if (isComponent(events)) {
	      addRafUpdate(method, events, updateList);
	    } else if (events instanceof Array) {
	      for (_m = 0, _len4 = events.length; _m < _len4; _m++) {
	        component = events[_m];
	        addRafUpdate(method, events, updateList);
	      }
	    }
	  } else if (events instanceof Array) {
	    if (!(updateList instanceof Array)) {
	      updateList = [updateList];
	    }
	    for (_n = 0, _len5 = events.length; _n < _len5; _n++) {
	      event = events[_n];
	      _renderComponentWhenBy(method, components, event, updateList);
	    }
	  } else {
	    if (!(updateList instanceof Array)) {
	      updateList = [updateList];
	    }
	    _renderComponentWhenBy(method, components, events, updateList);
	  }
	};

	_renderComponentWhenBy = function(method, component, event, updateList, options) {
	  var comp, i, item, _i, _len;
	  if (event.slice(0, 2) !== 'on') {
	    event = 'on' + event;
	  }
	  if (options) {
	    options.method = method;
	    component.eventUpdateConfig[event] = (function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = updateList.length; _i < _len; _i++) {
	        comp = updateList[_i];
	        _results.push([comp, options]);
	      }
	      return _results;
	    })();
	  } else {
	    for (i = _i = 0, _len = updateList.length; _i < _len; i = ++_i) {
	      item = updateList[i];
	      updateList[i] = isComponent(item) ? [
	        item, {
	          method: method
	        }
	      ] : item;
	    }
	    component.eventUpdateConfig[event] = updateList;
	  }
	};

	addSetIntervalUpdate = function(method, component, options) {
	  var callback, clear, handler, interval, test;
	  handler = null;
	  test = options.test, interval = options.interval, clear = options.clear;
	  callback = function() {
	    if (!test || test()) {
	      component[method]();
	    }
	    if (clear && clear()) {
	      return clearInterval(handler);
	    }
	  };
	  return handler = setInterval(callback, interval || 16);
	};

	addRenderUpdate = function(method, component, options) {
	  var callback, clear, test;
	  test = options.test, clear = options.clear;
	  callback = function() {
	    if (!test || test()) {
	      component[method]();
	    }
	    if (clear && clear()) {
	      return dc.offRender(callback);
	    }
	  };
	  return dc.onRender(callback);
	};

	dc.directives = function(directiveName, directiveHandlerGenerator) {
	  var generator, name, _results;
	  if (arguments.length === 1) {
	    _results = [];
	    for (name in directiveName) {
	      generator = directiveName[name];
	      if (name[0] !== '$') {
	        name = '$' + name;
	      }
	      _results.push(directiveRegistry[name] = generator);
	    }
	    return _results;
	  } else {
	    if (directiveName[0] !== '$') {
	      directiveName = '$' + directiveName;
	    }
	    return directiveRegistry[directiveName] = directiveHandlerGenerator;
	  }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var DomNode, addEventListener, newLine, processProp, removeEventListener, _ref;

	newLine = __webpack_require__(3).newLine;

	_ref = __webpack_require__(6), addEventListener = _ref.addEventListener, removeEventListener = _ref.removeEventListener;

	processProp = function(props, cache, prop, value) {
	  var p, _i, _len, _results;
	  if (prop == null) {
	    return props;
	  }
	  if (value == null) {
	    if (typeof prop === 'string') {
	      return props[prop];
	    } else {
	      _results = [];
	      for (value = _i = 0, _len = prop.length; _i < _len; value = ++_i) {
	        p = prop[value];
	        if ((cacheProps[p] == null) || value !== cacheProps[p]) {
	          _results.push(cacheProps[p] = props[p] = value);
	        } else {
	          _results.push(void 0);
	        }
	      }
	      return _results;
	    }
	  } else {
	    if ((cacheProps[prop] == null) || value !== cacheProps[prop]) {
	      return cacheProps[prop] = this.node[prop] = value;
	    }
	  }
	};

	module.exports = DomNode = (function() {
	  function DomNode(node) {
	    var n;
	    this.node = node;
	    if (node instanceof Node) {
	      this.cacheProps = {};
	      this.cacheStyle = {};
	    } else {
	      this.cacheProps = (function() {
	        var _i, _len, _ref1, _results;
	        _ref1 = this.node;
	        _results = [];
	        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	          n = _ref1[_i];
	          _results.push({});
	        }
	        return _results;
	      }).call(this);
	      this.cacheStyle = (function() {
	        var _i, _len, _ref1, _results;
	        _ref1 = this.node;
	        _results = [];
	        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	          n = _ref1[_i];
	          _results.push({});
	        }
	        return _results;
	      }).call(this);
	    }
	  }

	  DomNode.prototype.prop = function(prop, value) {
	    var i, n, node, _i, _len;
	    node = this.node;
	    if (node instanceof Node) {
	      processProp(node, this.cacheProps, prop, value);
	    } else {
	      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
	        n = node[i];
	        processProp(n, this.cacheProps[i], prop, value);
	      }
	    }
	    return this;
	  };

	  DomNode.prototype.css = function(prop, value) {
	    var i, n, node, _i, _len;
	    node = this.node;
	    if (node instanceof Node) {
	      processProp(node.style, this.cacheStyle, prop, value);
	    } else {
	      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
	        n = node[i];
	        processProp(n.style, this.cacheStyle[i], prop, value);
	      }
	    }
	    return this;
	  };

	  DomNode.prototype.bind = function(eventNames, handler) {
	    var n, name, names, node, _i, _j, _len, _len1;
	    names = eventNames.split(/\s+/);
	    node = this.node;
	    for (_i = 0, _len = names.length; _i < _len; _i++) {
	      name = names[_i];
	      if (name.slice(0, 2) === 'on') {
	        name = name.slice(2);
	      }
	      if (node instanceof Node) {
	        addEventListener(node, name, handler);
	      } else {
	        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
	          n = node[_j];
	          addEventListener(n, name, handler);
	        }
	      }
	    }
	  };

	  DomNode.prototype.unbind = function(eventNames, handler) {
	    var n, name, names, node, _i, _j, _len, _len1;
	    names = eventNames.split(/\s+/);
	    node = this.node;
	    for (_i = 0, _len = names.length; _i < _len; _i++) {
	      name = names[_i];
	      if (name.slice(0, 2) === 'on') {
	        name = name.slice(2);
	      }
	      if (node instanceof Node) {
	        removeEventListener(node, name, handler);
	      } else {
	        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
	          n = node[_j];
	          removeEventListener(n, name, handler);
	        }
	      }
	    }
	  };

	  DomNode.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    return newLine('', indent, addNewLine) + '<DomNode>' + newLine(this.node.toString(), indent + 2, true) + newLine('</DomNode>', indent, true);
	  };

	  return DomNode;

	})();


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var renew, _raf;

	_raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

	exports.requestAnimationFrame = exports.raf = _raf || function(callback) {
	  window.setInterval(callback, 1000 / 60);
	};

	exports.normalizeDomElement = function(domElement) {
	  if (typeof domElement === 'string') {
	    domElement = document.querySelector(domElement);
	  }
	  return domElement;
	};

	exports.getBindProp = function(component) {
	  var tagName;
	  tagName = component.tagName;
	  if (!tagName) {
	    throw new Error('trying to bind a Component which is not a Tag');
	  } else if (tagName === 'textarea' || tagName === 'select') {
	    return 'value';
	  } else if (component.attrs.type === 'checkbox') {
	    return 'checked';
	  } else {
	    return 'value';
	  }
	};

	if (document.body.addEventListener) {
	  exports.addEventListener = function(node, name, handler) {
	    node.addEventListener(name, handler, false);
	  };
	  exports.removeEventListener = function(node, name, handler) {
	    node.removeEventListener(name, handler);
	  };
	} else {
	  exports.addEventListener = function(node, name, handler) {
	    node.attachEvent(name, setCheckedValues);
	  };
	  exports.removeEventListener = function(node, name, handler) {
	    node.detachEvent(name, handler);
	  };
	}

	exports.isElement = function(item) {
	  if (typeof HTMLElement === "object") {
	    return item instanceof HTMLElement;
	  } else {
	    return item && typeof item === "object" && item !== null && item.nodeType === 1 && typeof item.nodeName === "string";
	  }
	};

	renew = __webpack_require__(2).renew;

	exports.domField = function(value) {
	  var fn;
	  if (value == null) {
	    return '';
	  }
	  if (typeof value !== 'function') {
	    if (value.then && value["catch"]) {
	      fn = react(function() {
	        return fn.promiseResult;
	      });
	      value.then(function(result) {
	        fn.promiseResult = result;
	        return fn.invalidate();
	      })["catch"](function(error) {
	        fn.promiseResult = error;
	        return fn.invalidate();
	      });
	      return fn;
	    } else {
	      return value;
	    }
	  }
	  if (!value.invalidate) {
	    return renew(value);
	  }
	  return value;
	};

	exports.domValue = function(value) {
	  if (value == null) {
	    return '';
	  } else if (typeof value !== 'function') {
	    return value;
	  } else {
	    value = value();
	    if (value == null) {
	      return '';
	    } else {
	      return value;
	    }
	  }
	};

	exports.checkConflictOffspring = function(family, child) {
	  var childDcid, dcid;
	  childDcid = child.dcid;
	  for (dcid in child.family) {
	    if (family[dcid]) {
	      throw new Error('do not allow to have the same component to be referenced in different location of one List');
	    }
	    family[dcid] = true;
	  }
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
	  domNodeCache: {},
	  readyFnList: [],
	  useSystemUpdating: false,
	  directiveRegistry: {},
	  renderCallbackList: []
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(item) {
	  return item && item.renderDom;
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	var hasOwn, isPlainObject, toString;

	hasOwn = Object.prototype.hasOwnProperty;

	toString = Object.prototype.toString;

	isPlainObject = function(obj) {
	  'use strict';
	  var has_is_property_of_method, has_own_constructor, key;
	  if (!obj || toString.call(obj) !== '[object Object]') {
	    return false;
	  }
	  has_own_constructor = hasOwn.call(obj, 'constructor');
	  has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	  if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
	    return false;
	  }
	  for (key in obj) {
	    key = key;
	  }
	  return key === void 0 || hasOwn.call(obj, key);
	};

	module.exports = function() {
	  var clone, copy, copyIsArray, deep, i, length, name, options, src, target;
	  target = arguments[0];
	  i = 1;
	  length = arguments.length;
	  deep = false;
	  if (typeof target === 'boolean') {
	    deep = target;
	    target = arguments[1] || {};
	    i = 2;
	  } else if (typeof target !== 'object' && typeof target !== 'function' || target === null) {
	    target = {};
	  }
	  while (i < length) {
	    options = arguments[i];
	    if (options !== null) {
	      for (name in options) {
	        name = name;
	        src = target[name];
	        copy = options[name];
	        if (target === copy) {
	          ++i;
	          continue;
	        }
	        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
	          if (copyIsArray) {
	            copyIsArray = false;
	            clone = src && Array.isArray(src) ? src : [];
	          } else {
	            clone = src && isPlainObject(src) ? src : {};
	          }
	          target[name] = extend(deep, clone, copy);
	        } else if (copy !== void 0) {
	          target[name] = copy;
	        }
	      }
	    }
	    ++i;
	  }
	  return target;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(9);

	module.exports = exports = extend({}, __webpack_require__(11), __webpack_require__(29), __webpack_require__(31), __webpack_require__(22));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var route;

	route = __webpack_require__(12);

	module.exports = {
	  isComponent: __webpack_require__(8),
	  toComponent: __webpack_require__(15),
	  Component: __webpack_require__(14),
	  BaseComponent: __webpack_require__(17),
	  List: __webpack_require__(19),
	  Tag: __webpack_require__(21),
	  Text: __webpack_require__(18),
	  Comment: __webpack_require__(23),
	  Html: __webpack_require__(24),
	  Nothing: __webpack_require__(16),
	  TransformComponent: __webpack_require__(13),
	  If: __webpack_require__(25),
	  Case: __webpack_require__(26),
	  Func: __webpack_require__(20),
	  Each: __webpack_require__(27),
	  Defer: __webpack_require__(28),
	  Route: route.Route,
	  route: route
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  route '...', ((match, route) ->
	          ...
	          route ...),
	      ...
	      otherwise
	      baseIndex

	   * match: {items, basePath, segment, leftPath, childBase}
	  handler = (match, route) ->
	  otherwiseHandler = (route) ->

	  :user # yes: .../xxx  no: .../xxx/
	  :user/  # yes .../xxx/ no /xxx
	  :user:\w+/ # yes: .../xyz
	  :user:(a\d*)/**
	  :user**
	  :user/name=:name
	  **
	  *
	 */
	var Route, TransformComponent, getRoutePattern, isComponent, isEven, matchCurvedString, matchRoute, navigate, navigateTo, processPiecePatterns, processRouteItem, route, toComponent, _ref, _route,
	  __slice = [].slice,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	TransformComponent = __webpack_require__(13);

	isComponent = __webpack_require__(8);

	toComponent = __webpack_require__(15);

	_ref = __webpack_require__(3), isEven = _ref.isEven, matchCurvedString = _ref.matchCurvedString;

	module.exports = route = function() {
	  var baseIndex, otherwise, routeList, _i;
	  routeList = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), otherwise = arguments[_i++], baseIndex = arguments[_i++];
	  return _route(routeList, otherwise, baseIndex, 0);
	};

	_route = function(routeList, otherwise, baseIndex, defaultBaseIndex) {
	  var i, len, routeList2;
	  if (typeof baseIndex === 'function') {
	    routeList.push(otherwise);
	    routeList.push(baseIndex);
	    otherwise = null;
	    baseIndex = defaultBaseIndex;
	  } else if (isComponent(baseIndex)) {
	    routeList.push(otherwise);
	    otherwise = baseIndex;
	    baseIndex = defaultBaseIndex;
	  } else if (baseIndex && !isComponent(baseIndex) && baseIndex.otherwise) {
	    routeList.push(otherwise);
	    otherwise = baseIndex.otherwise;
	    baseIndex = defaultBaseIndex;
	  } else {
	    baseIndex = baseIndex >>> 0;
	    if (otherwise && !isComponent(otherwise) && otherwise.otherwise) {
	      otherwise = otherwise.otherwise;
	    }
	  }
	  len = routeList.length;
	  if (!isEven(len)) {
	    throw new Error('route parameter error: missing matched handler');
	  }
	  if (len < 2 || typeof routeList[len - 1] !== 'function') {
	    throw new Error('route parameter error:\n  expect route(pattern, handler, pattern, handler, ..., otherwise, baseIndex)');
	  }
	  routeList2 = [];
	  i = 0;
	  while (i < len) {
	    routeList2.push([routeList[i], routeList[i + 1]]);
	    i += 2;
	  }
	  return new Route(routeList2, otherwise, baseIndex);
	};

	route._navigateTo = navigateTo = function(oldPath, path, baseIndex) {
	  var base, upCount;
	  if (baseIndex == null) {
	    baseIndex = 0;
	  }
	  path = '' + path;
	  if (path[0] !== '/') {
	    upCount = 0;
	    while (path) {
	      if (path.slice(0, 2) === './') {
	        path = path.slice(2);
	      } else if (path.slice(0, 3) === '../') {
	        path = path.slice(3);
	        upCount++;
	      } else {
	        break;
	      }
	    }
	    baseIndex -= upCount;
	    if (baseIndex < 0) {
	      baseIndex = 0;
	    }
	    base = oldPath.split('/').slice(0, baseIndex).join('/') + '/';
	    if (base === '/') {
	      base = '';
	    }
	    return path = base + path;
	  } else {
	    return path = path.slice(1);
	  }
	};

	navigate = function(baseIndex) {
	  return function(path) {
	    var match, oldPath;
	    oldPath = window.history && window.history.pushState ? decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '') : (match = location.href.match(/#(.*)$/)) ? match[1] : '';
	    navigateTo(oldPath, path, baseIndex);
	    if (window.history && window.history.pushState) {
	      history.pushState(null, null, path);
	    } else {
	      location.href = location.href.replace(/#(.*)$/, '') + '#' + path;
	    }
	    return path;
	  };
	};

	route.to = navigate(0);

	route.Route = Route = (function(_super) {
	  __extends(Route, _super);

	  function Route(routeList, otherwise, baseIndex) {
	    var patternRoute, _i, _len;
	    this.routeList = routeList;
	    this.otherwise = otherwise;
	    this.baseIndex = baseIndex;
	    for (_i = 0, _len = routeList.length; _i < _len; _i++) {
	      patternRoute = routeList[_i];
	      patternRoute[0] = getRoutePattern(patternRoute[0]);
	    }
	    this.otherwise = toComponent(otherwise);
	    return;
	  }

	  Route.prototype.getContentComponent = function() {
	    var component, path, patternRoute, _i, _len, _ref1;
	    path = this.getPath();
	    _ref1 = this.routeList;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      patternRoute = _ref1[_i];
	      if (component = processRouteItem(patternRoute, path, this.baseIndex)) {
	        return component;
	      }
	    }
	    return this.otherwise;
	  };

	  Route.prototype.getPath = function() {
	    var match;
	    if (window.history && window.history.pushState) {
	      return decodeURI(location.pathname + location.search).replace(/\?(.*)$/, '');
	    } else if (match = location.href.match(/#(.*)$/)) {
	      return match[1];
	    } else {
	      return '';
	    }
	  };

	  return Route;

	})(TransformComponent);

	route._processRouteItem = processRouteItem = function(patternRoute, path, baseIndex) {
	  var childRoute, handler, match, pattern, test, _ref1;
	  pattern = patternRoute[0], handler = patternRoute[1];
	  if (pattern instanceof Array) {
	    _ref1 = pattern, pattern = _ref1[0], test = _ref1[1];
	  }
	  match = matchRoute(pattern, path, baseIndex);
	  if (!match || (test && !(match = test(match, path, baseIndex)))) {
	    return;
	  }
	  childRoute = function() {
	    var baseIndex, otherwise, routeList, _i;
	    routeList = 3 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 2) : (_i = 0, []), otherwise = arguments[_i++], baseIndex = arguments[_i++];
	    return _route(routeList, otherwise, baseIndex, match.base);
	  };
	  childRoute.to = navigate(match.base);
	  return toComponent(handler(match, childRoute));
	};

	route._processPiecePatterns = processPiecePatterns = function(segmentPattern, params, nonameRegExpIndex) {
	  var ch, i, key, len, pieces, start;
	  i = 0;
	  len = segmentPattern.length;
	  pieces = [];
	  while (ch = segmentPattern[i]) {
	    start = i;
	    if (ch === ':') {
	      ch = segmentPattern[++i];
	      if (!ch.match(/[A-Za-z_$]/)) {
	        throw new Error("route pattern error: expect a parameter identifier " + segmentPattern);
	      }
	      ch = segmentPattern[++i];
	      while (ch && ch.match(/[$\w]/)) {
	        ch = segmentPattern[++i];
	      }
	      if (i === start + 1) {
	        throw new Error("route pattern error: expect a parameter identifier " + segmentPattern);
	      }
	      key = segmentPattern.slice(start + 1, i);
	      if (params[key]) {
	        throw new Error('route pattern error: repeated parameter name');
	      } else {
	        params[key] = true;
	      }
	      if (ch === '(') {
	        start = i;
	        if (i = matchCurvedString(segmentPattern, i)) {
	          if (start + 1 === i - 1) {
	            throw new Error('route pattern error: empty regexp: ()');
	          }
	          pieces.push({
	            key: key,
	            pattern: new RegExp(segmentPattern.slice(start + 1, i - 1))
	          });
	          ch = segmentPattern[i];
	        } else {
	          throw new Error('route pattern error: missing ) for regexp');
	        }
	      } else {
	        pieces.push({
	          key: key,
	          pattern: new RegExp('\\w+')
	        });
	        ++i;
	      }
	    } else if (ch === '(') {
	      if (i = matchCurvedString(segmentPattern, i)) {
	        if (start + 1 === i - 1) {
	          throw new Error('route pattern error: empty regexp: ()');
	        }
	        pieces.push({
	          key: nonameRegExpIndex++,
	          pattern: new RegExp(segmentPattern.slice(start + 1, i - 1))
	        });
	      } else {
	        throw new Error('route pattern error: missing ) for regexp');
	      }
	    } else {
	      ++i;
	      while ((ch = segmentPattern[i]) && ch !== ':' && ch !== '(') {
	        i++;
	      }
	      pieces.push({
	        pattern: segmentPattern.slice(start, i)
	      });
	    }
	  }
	  return [pieces, nonameRegExpIndex];
	};

	route._getRoutePattern = getRoutePattern = function(pattern) {
	  var absolute, atHead, endSlash, i, len, moreComing, nonameRegExpIndex, params, pieces, segment, segmentPatterns, segments, upCount, _ref1;
	  pattern = '' + pattern;
	  if (pattern.match(/\\\//)) {
	    new Error('should not include /\\\// in pattern');
	  }
	  if (pattern === '') {
	    segments = [];
	  } else {
	    segments = pattern.split('/');
	  }
	  upCount = 0;
	  absolute = false;
	  atHead = true;
	  endSlash = false;
	  moreComing = false;
	  segmentPatterns = [];
	  params = {};
	  len = segments.length;
	  i = 0;
	  nonameRegExpIndex = 0;
	  while (i < len) {
	    segment = segments[i++];
	    if (segment === '.') {
	      if (atHead) {
	        continue;
	      } else {
	        throw new Error('route pattern error: do not use ./ pattern except the start');
	      }
	    } else if (segment === '..') {
	      if (atHead) {
	        upCount++;
	        continue;
	      } else {
	        throw new Error('route pattern error: do not use ../ except the start');
	      }
	    } else if (segment === '') {
	      if (atHead) {
	        absolute = true;
	      } else if (i === len) {
	        endSlash = true;
	      } else {
	        throw new Error('route pattern error: do not use ../ except the start');
	      }
	    } else if (segment === '*') {
	      segmentPatterns.push('*');
	    } else if (segment === '**') {
	      if (i === len) {
	        moreComing = true;
	      } else {
	        throw new Error('route pattern error: do not use ** except the last segment');
	      }
	    } else {
	      _ref1 = processPiecePatterns(segment, params, nonameRegExpIndex), pieces = _ref1[0], nonameRegExpIndex = _ref1[1];
	      segmentPatterns.push(pieces);
	    }
	    atHead = false;
	  }
	  return {
	    segmentPatterns: segmentPatterns,
	    absolute: absolute,
	    upCount: upCount,
	    endSlash: endSlash,
	    moreComing: moreComing
	  };
	};

	route._matchRoute = matchRoute = function(pattern, path, baseIndex) {
	  var base, basePath, i, items, leftPath, len, m, matchIndex, pathSegment, pathSegments, piece, piecePattern, segmentPattern, segmentStr, segments, _i, _j, _len, _len1, _ref1;
	  if (pattern.endSlash && path[path.length - 1] !== '/') {
	    return;
	  }
	  if (pattern.absolute) {
	    baseIndex = 0;
	  } else {
	    baseIndex -= pattern.upCount;
	    if (baseIndex < 0) {
	      baseIndex = 0;
	    }
	  }
	  if (path === '/' || path === '') {
	    pathSegments = [];
	  } else {
	    pathSegments = path.split('/');
	    if (path[0] === '') {
	      pathSegments.shift();
	    }
	  }
	  len = pathSegments.length;
	  base = baseIndex;
	  items = {};
	  segments = [];
	  _ref1 = pattern.segmentPatterns;
	  for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
	    segmentPattern = _ref1[i];
	    if (base >= len) {
	      return;
	    }
	    if (segmentPattern === '*') {
	      segments.push(pathSegments[base]);
	      base++;
	      continue;
	    }
	    matchIndex = 0;
	    segmentStr = pathSegment = pathSegments[base];
	    for (_j = 0, _len1 = segmentPattern.length; _j < _len1; _j++) {
	      piece = segmentPattern[_j];
	      piecePattern = piece.pattern;
	      if (typeof piecePattern === 'string') {
	        if (pathSegment.indexOf(piecePattern) === 0) {
	          pathSegment = pathSegment.slice(piecePattern.length);
	          matchIndex += piecePattern.length;
	        } else {
	          break;
	        }
	      } else {
	        if (m = pathSegment.match(piecePattern)) {
	          items[piece.key] = m;
	          matchIndex += m[0].length;
	        } else {
	          break;
	        }
	      }
	    }
	    if (matchIndex !== segmentStr.length) {
	      return;
	    }
	    segments.push(segmentStr);
	    base++;
	  }
	  if (base !== len && !pattern.moreComing) {
	    return;
	  }
	  basePath = '/' + pathSegments.slice(0, baseIndex + 1).join('/') + '/';
	  leftPath = '/' + pathSegments.slice(base).join('/');
	  return {
	    items: items,
	    basePath: basePath,
	    segments: segments,
	    leftPath: leftPath,
	    base: base
	  };
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Component, TransformComponent,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(14);

	module.exports = TransformComponent = (function(_super) {
	  __extends(TransformComponent, _super);

	  function TransformComponent() {
	    TransformComponent.__super__.constructor.call(this);
	    this.valid = false;
	    this.transformValid = false;
	    this.isTransformComponent = true;
	  }

	  TransformComponent.prototype.invalidate = function() {
	    if (!this.valid) {
	      return;
	    }
	    this.valid = false;
	    return this.holder && this.holder.invalidateContent(this);
	  };

	  TransformComponent.prototype.invalidateContent = function(content) {
	    return this.invalidate();
	  };

	  TransformComponent.prototype.invalidateTransform = function() {
	    this.transformValid = false;
	    return this.invalidate();
	  };

	  TransformComponent.prototype.renderDom = function() {
	    var baseComponent, content, node, oldContent, parentNode;
	    parentNode = this.parentNode, node = this.node;
	    if (!parentNode) {
	      this.holder = null;
	      if (node && node.parentNode) {
	        return this.removeDom();
	      } else {
	        return this;
	      }
	    }
	    if (this.valid) {
	      if (parentNode && !node.parentNode) {
	        baseComponent = this.baseComponent;
	        baseComponent.parentNode = parentNode;
	        baseComponent.nextNode = this.nextNode;
	        baseComponent.attachNode();
	      }
	      return this;
	    }
	    this.valid = true;
	    !this.node && this.emit('beforeAttach');
	    oldContent = this.content;
	    if (!this.transformValid) {
	      this.transformValid = true;
	      content = this.getContentComponent();
	      if (oldContent && content !== oldContent) {
	        this.emit('contentChanged', oldContent, content);
	        oldContent.parentNode = null;
	        if (oldContent.node && oldContent.node.parentNode) {
	          oldContent.removeDom();
	        }
	      }
	      this.content = content;
	    } else {
	      content = oldContent;
	    }
	    content.holder = this;
	    content.parentNode = this.parentNode;
	    content.nextNode = this.nextNode;
	    content.renderDom();
	    this.node = content.node;
	    this.firstNode = content.firstNode;
	    this.baseComponent = content.baseComponent;
	    return this;
	  };

	  TransformComponent.prototype.removeDom = function() {
	    var content;
	    content = this.content;
	    content.holder = null;
	    content.parentNode = null;
	    content.removeDom();
	    this.emit('afterRemoveDom');
	    return this;
	  };

	  return TransformComponent;

	})(Component);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Component, componentId, dc, extend, isComponent, mountList, newDcid, normalizeDomElement,
	  __slice = [].slice;

	extend = __webpack_require__(9);

	normalizeDomElement = __webpack_require__(6).normalizeDomElement;

	newDcid = __webpack_require__(3).newDcid;

	isComponent = __webpack_require__(8);

	dc = __webpack_require__(4);

	componentId = 1;

	mountList = [];

	module.exports = Component = (function() {
	  function Component() {
	    this.listeners = {};
	    this.baseComponent = null;
	    this.parentNode = null;
	    this.node = null;
	    this.dcid = newDcid();
	  }

	  Component.prototype.on = function(event, callback) {
	    var callbacks;
	    callbacks = this.listeners[event] || (this.listeners[event] = []);
	    callbacks.push(callback);
	    return this;
	  };

	  Component.prototype.off = function(event, callback) {
	    var callbacks;
	    callbacks = this.listeners[event] || (this.listeners[event] = []);
	    callbacks.indexOf(callback) >= 0 && callbacks.splice(index, 1);
	    !callbacks.length && (this.listeners[event] = null);
	    return this;
	  };

	  Component.prototype.emit = function() {
	    var args, callback, callbacks, event, _i, _len;
	    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    if (!(callbacks = this.listeners[event])) {
	      return;
	    }
	    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
	      callback = callbacks[_i];
	      callback.apply(this, args);
	    }
	    return this;
	  };


	  /* if mountNode is given, it should not the node of any Component
	  only use beforeNode if mountNode is given
	   */

	  Component.prototype.mount = function(mountNode, beforeNode) {
	    this.emit('beforeMount');
	    this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.getElementsByTagName('body')[0];
	    this.renderDom();
	    this.emit('afterMount');
	    return this;
	  };

	  Component.prototype.create = function() {
	    return this.renderDom();
	  };

	  Component.prototype.render = function() {
	    return this.renderDom();
	  };

	  Component.prototype.update = function() {
	    this.emit('update');
	    this.renderDom();
	    return this;
	  };

	  Component.prototype.unmount = function() {
	    var child, holder;
	    this.emit('beforeUnmount');
	    if (!this.node || !this.node.parentNode) {
	      this.emit('afterUnmount');
	      return this;
	    }
	    child = this;
	    holder = this.holder;
	    while (holder && !holder.isBaseComponent) {
	      child = holder;
	      holder = holder.holder;
	    }
	    if (holder && (holder.isList || holder.isTag)) {
	      holder.removeChild(holder.dcidIndexMap[child.dcid]);
	    }
	    child.parentNode = null;
	    if (holder && (holder.isList || holder.isTag)) {
	      holder.renderDom();
	    } else {
	      child.renderDom();
	    }
	    this.emit('afterUnmount');
	    return child;
	  };

	  Component.prototype.remount = function(parentNode) {
	    var child, holder, index;
	    this.emit('beforeMount');
	    child = this;
	    holder = this.holder;
	    while (holder && !holder.isBaseComponent) {
	      child = holder;
	      holder = holder.holder;
	    }
	    if ((holder.isList || holder.isTag) && (index = holder.dcidIndexMap[child.dcid])) {
	      index = index != null ? index : holder.children.length;
	      holder.insertChild(index, child);
	    }
	    child.parentNode = holder ? holder.parentNode : parentNode ? parentNode : document.body;
	    child.invalidate();
	    if (holder && (holder.isList || holder.isTag)) {
	      holder.renderDom();
	    } else {
	      child.renderDom();
	    }
	    this.emit('afterMount');
	    return child;
	  };


	  /*
	  component.updateWhen components, events
	  component.updateWhen setInterval, interval, options
	  component.updateWhen dc.raf, options
	   */

	  Component.prototype.updateWhen = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._renderWhenBy('update', args);
	  };

	  Component.prototype.renderWhen = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._renderWhenBy('render', args);
	  };

	  Component.prototype._renderWhenBy = function(method, args) {
	    if (args[0] === setInterval) {
	      if (args[1] === 'number') {
	        dc._renderWhenBy(method, setInterval, args[1], [this], args[2]);
	      } else {
	        dc._renderWhenBy(method, setInterval, [this], args[1]);
	      }
	    } else if (args[1] === dc.raf) {
	      dc._renderWhenBy(method, dc.raf, [this], args[1]);
	    } else {
	      dc._renderWhenBy(method, args[0], args[1], [this]);
	    }
	    return this;
	  };

	  Component.prototype.copyEventListeners = function(srcComponent) {
	    var event, myListeners, srcListeners;
	    myListeners = this.listeners;
	    srcListeners = srcComponent.listeners;
	    for (event in srcListeners) {
	      srcListeners[event] && (myListeners[event] = srcListeners[event].splice());
	    }
	    return this;
	  };

	  return Component;

	})();


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Component, Nothing, Text, isComponent, react, toComponent;

	Component = __webpack_require__(14);

	isComponent = __webpack_require__(8);

	Nothing = __webpack_require__(16);

	Text = __webpack_require__(18);

	react = __webpack_require__(2).react;

	module.exports = toComponent = function(item) {
	  var Func, List, component, e;
	  if (isComponent(item)) {
	    return item;
	  } else if (typeof item === 'function') {
	    return new Text(item);
	  } else if (item instanceof Array) {
	    List = __webpack_require__(19);
	    return new List((function() {
	      var _i, _len, _results;
	      _results = [];
	      for (_i = 0, _len = item.length; _i < _len; _i++) {
	        e = item[_i];
	        _results.push(toComponent(e));
	      }
	      return _results;
	    })());
	  } else if (item == null) {
	    return new Nothing();
	  } else if (item.then && item["catch"]) {
	    Func = __webpack_require__(20);
	    component = new Func(react(function() {
	      return component.promiseResult;
	    }));
	    item.then(function(value) {
	      component.promiseResult = value;
	      return component.invalideTransform();
	    })["catch"](function(error) {
	      component.promiseResult = error;
	      return component.invalideTransform();
	    });
	    return component;
	  } else {
	    return new Text(item);
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Nothing, newLine,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(17);

	newLine = __webpack_require__(3).newLine;

	module.exports = Nothing = (function(_super) {
	  __extends(Nothing, _super);

	  function Nothing() {
	    Nothing.__super__.constructor.apply(this, arguments);
	    this.firstNode = null;
	    this.family = {};
	    this.baseComponent = this;
	  }

	  Nothing.prototype.createDom = function() {
	    return this.node = [];
	  };

	  Nothing.prototype.updateDom = function() {
	    return this.node;
	  };

	  Nothing.prototype.attachNode = function(parentNode, nextNode) {
	    return this.node;
	  };

	  Nothing.prototype.clone = function() {
	    return new Nothing();
	  };

	  Nothing.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Nothing/>", indent, addNewLine);
	  };

	  return Nothing;

	})(BaseComponent);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Component, cloneObject,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(14);

	cloneObject = __webpack_require__(3).cloneObject;

	module.exports = BaseComponent = (function(_super) {
	  __extends(BaseComponent, _super);

	  function BaseComponent() {
	    BaseComponent.__super__.constructor.call(this);
	    this.isBaseComponent = true;
	    this.baseComponent = this;
	  }

	  BaseComponent.prototype.renderDom = function() {
	    if (!this.parentNode) {
	      if (this.node && this.node.parentNode) {
	        this.valid = true;
	        return this.removeDom();
	      } else {
	        return this;
	      }
	    }
	    if (!this.node) {
	      this.valid = true;
	      this.emit('beforeAttach');
	      this.createDom();
	    } else if (!this.valid) {
	      this.valid = true;
	      this.updateDom();
	    }
	    this.attachNode(this.parentNode, this.nextNode);
	    return this;
	  };

	  BaseComponent.prototype.invalidate = function() {
	    if (!this.valid) {
	      return;
	    }
	    this.valid = false;
	    return this.holder && this.holder.invalidateContent(this);
	  };

	  BaseComponent.prototype.removeDom = function() {
	    this.removeNode();
	    this.emit('afterRemoveDom');
	    return this;
	  };

	  BaseComponent.prototype.removeNode = function() {
	    return this.node.parentNode && this.node.parentNode.removeChild(this.node);
	  };

	  BaseComponent.prototype.attachNode = function() {
	    var node;
	    node = this.node;
	    if (this.parentNode === node.parentNode) {
	      return node;
	    }
	    this.parentNode.insertBefore(node, this.nextNode);
	    return node;
	  };

	  return BaseComponent;

	})(Component);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Text, constructTextLikeComponent, domField, domValue, dynamic, exports, funcString, newLine, value, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(17);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

	_ref1 = __webpack_require__(6), domField = _ref1.domField, domValue = _ref1.domValue;

	exports = module.exports = Text = (function(_super) {
	  __extends(Text, _super);

	  function Text(text) {
	    Text.__super__.constructor.call(this);
	    constructTextLikeComponent.call(this, text);
	  }

	  Text.prototype.createDom = function() {
	    this.textValid = true;
	    this.firstNode = this.node = document.createTextNode(domValue(this.text));
	    return this.node;
	  };

	  Text.prototype.updateDom = function() {
	    var text;
	    if (!this.textValid) {
	      return this.node;
	    }
	    this.textValid = true;
	    text = domValue(this.text);
	    if (text !== this.cacheText) {
	      if (this.node.parentNode) {
	        this.removeNode();
	      }
	      this.node = document.createTextNode(text);
	      this.firstNode = this.node;
	      this.cacheText = text;
	    }
	    return this.node;
	  };

	  Text.prototype.clone = function() {
	    return (new this.constructor(this.text)).copyEventListeners(this);
	  };

	  Text.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine(funcString(this.text), indent, addNewLine);
	  };

	  return Text;

	})(BaseComponent);

	exports.constructTextLikeComponent = constructTextLikeComponent = function(text) {
	  var me;
	  me = this;
	  this.text = text = domField(text);
	  if (typeof text === 'function') {
	    text.onInvalidate(function() {
	      return me.invalidate();
	    });
	  }
	  this.family = {};
	  this.family[this.dcid] = true;
	  return this;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, Nothing, binaryInsert, binarySearch, checkConflictOffspring, checkContainer, exports, newLine, substractSet, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __slice = [].slice;

	toComponent = __webpack_require__(15);

	BaseComponent = __webpack_require__(17);

	Nothing = __webpack_require__(16);

	_ref = __webpack_require__(3), checkContainer = _ref.checkContainer, newLine = _ref.newLine, binarySearch = _ref.binarySearch, binaryInsert = _ref.binaryInsert, substractSet = _ref.substractSet;

	checkConflictOffspring = __webpack_require__(6).checkConflictOffspring;

	module.exports = exports = List = (function(_super) {
	  __extends(List, _super);

	  function List(children) {
	    var child, dcidIndexMap, family, i, _i, _len;
	    this.children = children;
	    List.__super__.constructor.call(this);
	    this.family = family = {};
	    family[this.dcid] = true;
	    this.dcidIndexMap = dcidIndexMap = {};
	    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
	      child = children[i];
	      children[i] = child = toComponent(child);
	      checkConflictOffspring(family, child);
	      child.holder = this;
	      dcidIndexMap[child.dcid] = i;
	    }
	    this.isList = true;
	    return;
	  }

	  List.prototype.invalidateContent = function(child) {
	    this.valid = false;
	    this.contentValid = false;
	    this.node && binaryInsert(this.dcidIndexMap[child.dcid], this.invalidIndexes);
	    return this.holder && this.holder.invalidateContent(this);
	  };

	  List.prototype.createDom = function() {
	    var child, children, i, length, node, parentNode, _i, _len;
	    if (length = this.children.length) {
	      parentNode = this.parentNode, children = this.children;
	      children[length - 1].nextNode = this.nextNode;
	      for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
	        child = children[i];
	        child.parentNode = parentNode;
	      }
	    }
	    this.node = this.childNodes = node = [];
	    node.parentNode = this.parentNode;
	    this.createChildrenDom();
	    this.firstNode = this.childFristNode;
	    this.childrenNextNode = this.nextNode;
	    return this.node;
	  };

	  List.prototype.createChildrenDom = function() {
	    var child, children, firstNode, index, node;
	    node = this.childNodes;
	    this.invalidIndexes = [];
	    this.removedChildren = {};
	    children = this.children;
	    index = children.length - 1;
	    firstNode = null;
	    while (index >= 0) {
	      child = children[index];
	      if (child.holder !== this) {
	        child.invalidate();
	        child.holder = this;
	      }
	      child.renderDom();
	      node.unshift(child.node);
	      firstNode = child.firstNode || firstNode;
	      index && (children[index - 1].nextNode = firstNode || child.nextNode);
	      index--;
	    }
	    this.childFristNode = firstNode;
	    return node;
	  };

	  List.prototype.updateDom = function() {
	    var children, index, invalidIndexes, parentNode, _i, _len;
	    children = this.children, parentNode = this.parentNode, invalidIndexes = this.invalidIndexes;
	    for (_i = 0, _len = invalidIndexes.length; _i < _len; _i++) {
	      index = invalidIndexes[_i];
	      children[index].parentNode = parentNode;
	    }
	    this.childrenNextNode = this.nextNode;
	    return this.updateChildrenDom();
	  };

	  List.prototype.updateChildrenDom = function() {
	    var child, childNodes, children, i, invalidIndexes, listIndex, nextNode, parentNextNode, parentNode, _, _ref1, _ref2;
	    invalidIndexes = this.invalidIndexes;
	    if (!invalidIndexes.length) {
	      _ref1 = this.removedChildren;
	      for (_ in _ref1) {
	        child = _ref1[_];
	        child.removeDom();
	      }
	      this.removedChildren = {};
	      return childNodes;
	    }
	    children = this.children;
	    this.invalidIndexes = [];
	    parentNode = this.parentNode, nextNode = this.nextNode, childNodes = this.childNodes;
	    parentNextNode = nextNode;
	    i = invalidIndexes.length - 1;
	    children[children.length - 1].nextNode = this.childrenNextNode;
	    while (i >= 0) {
	      listIndex = invalidIndexes[i];
	      child = children[listIndex];
	      if (child.holder !== this) {
	        child.invalidate();
	        child.holder = this;
	      }
	      child.renderDom();
	      childNodes[listIndex] = child.node;
	      listIndex && (children[listIndex - 1].nextNode = child.firstNode || nextNode);
	      i--;
	    }
	    _ref2 = this.removedChildren;
	    for (_ in _ref2) {
	      child = _ref2[_];
	      child.removeDom();
	    }
	    this.removedChildren = {};
	    return childNodes;
	  };

	  List.prototype.removeNode = function() {
	    var child, _i, _len, _ref1;
	    this.node.parentNode = null;
	    _ref1 = this.children;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      child = _ref1[_i];
	      child.baseComponent.removeNode();
	    }
	  };

	  List.prototype.pushChild = function(child) {
	    return this.setChildren(this.children.length, child);
	  };

	  List.prototype.unshiftChild = function(child) {
	    return this.insertChild(0, child);
	  };

	  List.prototype.insertChild = function(index, child) {
	    var children, insertLocation, invalidIndexes, length;
	    children = this.children;
	    if (index >= children.length) {
	      return this.setChildren(index, child);
	    }
	    this.invalidate();
	    child = toComponent(child);
	    children.splice(index, 0, child);
	    this.dcidIndexMap[child.dcid] = index;
	    if (this.node) {
	      invalidIndexes = this.invalidIndexes;
	      insertLocation = binaryInsert(index, invalidIndexes);
	      length = invalidIndexes.length;
	      insertLocation++;
	      while (insertLocation < length) {
	        invalidIndexes[insertLocation]++;
	        insertLocation++;
	      }
	    }
	    return this;
	  };

	  List.prototype.removeChild = function(index) {
	    var child, children, invalidIndex, invalidIndexes;
	    children = this.children;
	    if (index > children.length) {
	      return this;
	    }
	    this.invalidate();
	    child = children[index];
	    child.parentNode = null;
	    substractSet(this.family, child.family);
	    children.splice(index, 1);
	    if (this.node) {
	      invalidIndexes = this.invalidIndexes;
	      invalidIndex = binarySearch(index, invalidIndexes);
	      if (invalidIndexes[invalidIndex] === index) {
	        invalidIndexes.splice(invalidIndexes, 1);
	      }
	      children[index - 1] && (children[index - 1].nextNode = child.nextNode);
	      this.node.splice(index, 1);
	      this.removedChildren[child.dcid] = child;
	    }
	    return this;
	  };

	  List.prototype.invalidChildren = function(startIndex, stopIndex) {
	    var insertLocation, invalidIndex, invalidIndexes;
	    if (stopIndex == null) {
	      stopIndex = startIndex + 1;
	    }
	    if (!this.node) {
	      return this;
	    }
	    this.invalidate();
	    invalidIndexes = this.invalidIndexes;
	    insertLocation = binarySearch(startIndex, this.invalidIndexes);
	    while (startIndex < stopIndex) {
	      invalidIndex = invalidIndexes[insertLocation];
	      if (invalidIndex !== startIndex) {
	        invalidIndexes.splice(insertLocation, 0, startIndex);
	      }
	      insertLocation++;
	      startIndex++;
	    }
	    return this;
	  };

	  List.prototype.setChildren = function() {
	    var child, children, dcidIndexMap, family, i, insertLocation, invalidIndex, invalidIndexes, newChildren, node, oldChild, oldChildrenLength, removedChildren, startIndex, stopIndex;
	    startIndex = arguments[0], newChildren = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    this.invalidate();
	    children = this.children, family = this.family, node = this.node, dcidIndexMap = this.dcidIndexMap;
	    if (startIndex > (oldChildrenLength = children.length)) {
	      i = oldChildrenLength;
	      while (i < startIndex) {
	        newChildren.unshift(new Nothing());
	        i++;
	      }
	      startIndex = oldChildrenLength;
	    }
	    if (node) {
	      invalidIndexes = this.invalidIndexes, removedChildren = this.removedChildren;
	      insertLocation = binarySearch(startIndex, this.invalidIndexes);
	    }
	    stopIndex = startIndex + newChildren.length;
	    i = 0;
	    while (startIndex < stopIndex) {
	      child = toComponent(newChildren[i]);
	      oldChild = children[startIndex];
	      if (oldChild == null) {
	        children[startIndex] = new Nothing();
	      }
	      if (oldChild === child) {
	        if (node) {
	          invalidIndex = invalidIndexes[insertLocation];
	          if (invalidIndex && invalidIndex < stopIndex) {
	            insertLocation++;
	          }
	        }
	      } else {
	        if (oldChild) {
	          substractSet(family, oldChild.family);
	          if (node) {
	            this.removedChildren[oldChild.dcid] = oldChild;
	          }
	        }
	        checkConflictOffspring(family, child);
	        children[startIndex] = child;
	        dcidIndexMap[child.dcid] = startIndex;
	        if (node) {
	          invalidIndex = invalidIndexes[insertLocation];
	          if (invalidIndex !== startIndex) {
	            invalidIndexes.splice(insertLocation, 0, startIndex);
	          }
	          insertLocation++;
	        }
	      }
	      startIndex++;
	      i++;
	    }
	    return this;
	  };

	  List.prototype.setLength = function(newLength) {
	    var children, insertLocation, last;
	    children = this.children;
	    if (newLength >= children.length) {
	      return this;
	    }
	    last = children.length - 1;
	    if (this.node) {
	      insertLocation = binarySearch(newLength, this.invalidIndexes);
	      this.invalidIndexes = this.invalidIndexes.slice(0, insertLocation);
	    }
	    while (last >= newLength) {
	      this.removeChild(last);
	      last--;
	    }
	    return this;
	  };

	  List.prototype.attachNode = function() {
	    var baseComponent, child, children, index, nextNode, parentNode;
	    children = this.children;
	    if ((parentNode = this.parentNode) !== this.node.parentNode) {
	      this.node.parentNode = parentNode;
	      if (children.length) {
	        nextNode = this.nextNode;
	        index = children.length - 1;
	        children[index].nextNode = nextNode;
	        while (index >= 0) {
	          child = children[index];
	          child.parentNode = parentNode;
	          baseComponent = child.baseComponent;
	          baseComponent.parentNode = parentNode;
	          baseComponent.nextNode = child.nextNode;
	          baseComponent.attachNode();
	          index && (children[index - 1].nextNode = child.firstNode || child.nextNode);
	          index--;
	        }
	      }
	    }
	    return this.node;
	  };

	  List.prototype.removeDom = function() {
	    var child, _i, _len, _ref1;
	    this.node.parentNode = null;
	    _ref1 = this.children;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      child = _ref1[_i];
	      child.parentNode = null;
	      child.removeDom();
	    }
	    this.emit('afterRemoveDom');
	    return this;
	  };

	  List.prototype.clone = function() {
	    var child;
	    return (new List((function() {
	      var _i, _len, _ref1, _results;
	      _ref1 = this.children;
	      _results = [];
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        child = _ref1[_i];
	        _results.push(child.clone());
	      }
	      return _results;
	    }).call(this))).copyEventListeners(this);
	  };

	  List.prototype.toString = function(indent, addNewLine) {
	    var child, s, _i, _len, _ref1;
	    if (indent == null) {
	      indent = 0;
	    }
	    if (!this.children.length) {
	      return newLine("<List/>", indent, addNewLine);
	    } else {
	      s = newLine("<List>", indent, addNewLine);
	      _ref1 = this.children;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        child = _ref1[_i];
	        s += child.toString(indent + 2, true);
	      }
	      return s += newLine('</List>', indent, true);
	    }
	  };

	  return List;

	})(BaseComponent);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Func, TransformComponent, funcString, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(15);

	TransformComponent = __webpack_require__(13);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	renew = __webpack_require__(2).renew;

	module.exports = Func = (function(_super) {
	  __extends(Func, _super);

	  function Func(func) {
	    Func.__super__.constructor.call(this);
	    if (!func.invalidate) {
	      this.func = renew(func);
	    } else {
	      this.func = func;
	    }
	    this.func.onInvalidate(this.invalidateTransform.bind(this));
	    this;
	  }

	  Func.prototype.getContentComponent = function() {
	    return toComponent(this.func());
	  };

	  Func.prototype.clone = function() {
	    return (new Func((function() {
	      return toComponent(func()).clone();
	    }))).copyEventListeners(this);
	  };

	  Func.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Func " + (funcString(this.func)) + "/>", indent, addNewLine);
	  };

	  return Func;

	})(TransformComponent);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, Tag, Text, attrToPropName, classFn, cloneObject, dc, directiveRegistry, domField, eventHandlerFromArray, extend, flow, funcString, newLine, styleFrom, toComponent, updating, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __slice = [].slice;

	extend = __webpack_require__(9);

	dc = __webpack_require__(4);

	_ref = __webpack_require__(22), classFn = _ref.classFn, styleFrom = _ref.styleFrom, eventHandlerFromArray = _ref.eventHandlerFromArray, attrToPropName = _ref.attrToPropName, updating = _ref.updating;

	BaseComponent = __webpack_require__(17);

	Text = __webpack_require__(18);

	List = __webpack_require__(19);

	_ref1 = __webpack_require__(3), funcString = _ref1.funcString, newLine = _ref1.newLine, cloneObject = _ref1.cloneObject;

	directiveRegistry = __webpack_require__(7).directiveRegistry;

	flow = __webpack_require__(2).flow;

	domField = __webpack_require__(6).domField;

	toComponent = __webpack_require__(15);

	module.exports = Tag = (function(_super) {
	  __extends(Tag, _super);

	  function Tag(tagName, attrs, children) {
	    if (attrs == null) {
	      attrs = {};
	    }
	    Tag.__super__.constructor.call(this, children);
	    delete this.isList;
	    this.isTag = true;
	    this.tagName = tagName = tagName.toLowerCase();
	    this.namespace = attrs.namespace;
	    if (!this.namespace) {
	      if (tagName === 'svg') {
	        this.namespace = "http://www.w3.org/2000/svg";
	      } else if (tagName === 'math') {
	        this.namespace = "http://www.w3.org/1998/Math/MathML";
	      }
	    }
	    this.attrs = attrs;
	    this.processAttrs();
	    return;
	  }

	  Tag.prototype.processAttrs = function() {
	    var attrStyle, attrs, className, directive, directives, events, generator, handler, key, me, props, style, value, _i, _len;
	    me = this;
	    this.hasActiveProperties = false;
	    attrs = this.attrs;
	    this.cacheClassName = "";
	    this.className = className = classFn(attrs.className, attrs["class"]);
	    delete attrs.className;
	    delete attrs['class'];
	    if (!className.valid) {
	      this.hasActiveProperties = true;
	    }
	    className.onInvalidate(function() {
	      if (className.valid) {
	        me.hasActiveProperties = true;
	        return me.invalidate();
	      }
	    });
	    this.hasActiveProps = false;
	    this.cacheProps = {};
	    this.props = props = {};
	    this['invalidateProps'] = {};
	    this.hasActiveStyle = false;
	    this.cacheStyle = {};
	    this.style = style = {};
	    this['invalidateStyle'] = {};
	    attrStyle = styleFrom(attrs.style);
	    for (key in attrStyle) {
	      value = attrStyle[key];
	      this.setProp(key, value, style, 'Style');
	    }
	    delete attrs.style;
	    this.hasActiveEvents = false;
	    this.events = events = {};
	    this.eventUpdateConfig = {};
	    directives = [];
	    for (key in attrs) {
	      value = attrs[key];
	      if (key.slice(0, 2) === 'on') {
	        if (typeof value === 'function') {
	          events[key] = [value];
	        } else {
	          events[key] = value;
	        }
	        this.hasActiveEvents = true;
	        this.hasActiveProperties = true;
	      } else if (key[0] === '$') {
	        generator = directiveRegistry[key];
	        if (value instanceof Array) {
	          handler = generator.apply(null, value);
	        } else {
	          handler = generator.apply(null, [value]);
	        }
	        directives.push(handler);
	      } else {
	        this.setProp(key, value, props, 'Props');
	      }
	    }
	    for (_i = 0, _len = directives.length; _i < _len; _i++) {
	      directive = directives[_i];
	      directive(this);
	    }
	  };

	  Tag.prototype.prop = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.props, 'Props');
	  };

	  Tag.prototype.css = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.style, 'Style');
	  };

	  Tag.prototype._prop = function(args, props, type) {
	    var key, prop, v;
	    if (args.length === 0) {
	      return props;
	    }
	    if (args.length === 1) {
	      prop = args[0];
	      if (typeof prop === 'string') {
	        return props[prop];
	      }
	      for (key in prop) {
	        v = prop[key];
	        this.setProp(key, v, props, type);
	      }
	    } else if (args.length === 2) {
	      this.setProp(args[0], args[1], props, type);
	    }
	    return this;
	  };

	  Tag.prototype.setProp = function(prop, value, props, type) {
	    var fn, me, oldValue;
	    prop = attrToPropName(prop);
	    value = domField(value);
	    oldValue = props[prop];
	    if (oldValue == null) {
	      if (typeof value === 'function') {
	        this.addActivity(props, prop, type);
	      } else if (value !== this['cache' + type][prop]) {
	        this.addActivity(props, prop, type);
	      }
	    } else {
	      if (typeof oldValue === 'function') {
	        oldValue.offInvalidate(this['invalidate' + type][prop]);
	      }
	    }
	    if (typeof value === 'function') {
	      me = this;
	      this['invalidate' + type][prop] = fn = function() {
	        me.addActivity(props, prop, type, true);
	        return props[prop] = value;
	      };
	      value.onInvalidate(fn);
	    }
	    props[prop] = value;
	  };

	  Tag.prototype.addActivity = function(props, prop, type) {
	    this['hasActive' + type] = true;
	    this.hasActiveProperties = true;
	    if (!this.node) {
	      return;
	    }
	    return this.invalidate();
	  };

	  Tag.prototype.bind = function(eventNames, handler, before) {
	    var eventHandlers, eventName, events, index, _i, _len;
	    eventNames = eventNames.split('\s+');
	    events = this.events;
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      eventName = eventNames[_i];
	      if (eventName.slice(0, 2) !== 'on') {
	        eventName = 'on' + eventName;
	      }
	      eventHandlers = events[eventName];
	      if (!eventHandlers) {
	        events[eventName] = [handler];
	        if (this.node) {
	          this.node[eventName] = eventHandlerFromArray(events[eventName], eventName, this);
	        } else {
	          this.hasActiveEvents = true;
	          this.hasActiveProperties = true;
	        }
	      } else {
	        index = eventHandlers.indexOf(handler);
	        if (index >= 0) {
	          continue;
	        }
	        if (before) {
	          eventHandlers.unshift.call(eventHandlers, handler);
	        } else {
	          eventHandlers.push.call(eventHandlers, handler);
	        }
	      }
	    }
	    return this;
	  };

	  Tag.prototype.unbind = function(eventNames, handler) {
	    var eventHandlers, eventName, events, index, _i, _len;
	    eventNames = eventNames.split('\s+');
	    events = this.events;
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      eventName = eventNames[_i];
	      if (eventName.slice(0, 2) !== 'on') {
	        eventName = 'on' + eventName;
	      }
	      eventHandlers = events[eventName];
	      if (!eventHandlers) {
	        continue;
	      }
	      index = eventHandlers.indexOf(handler);
	      if (index >= 0) {
	        eventHandlers.splice(index, 1);
	        if (!eventHandlers.length) {
	          events[eventName] = null;
	          this.node && (this.node[prop] = null);
	        }
	      }
	    }
	    return this;
	  };

	  Tag.prototype.addClass = function() {
	    var items;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.className.extend(items);
	    if (!this.className.valid) {
	      this.hasActiveProperties = true;
	      this.invalidate();
	    }
	    return this;
	  };

	  Tag.prototype.removeClass = function() {
	    var items, _ref2;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref2 = this.className).removeClass.apply(_ref2, items);
	    if (!this.className.valid) {
	      this.hasActiveProperties = true;
	      this.invalidate();
	    }
	    return this;
	  };

	  Tag.prototype.show = function(display) {
	    if (typeof display === 'function') {
	      display = display();
	      if (display == null) {
	        display = '';
	      }
	    }
	    if (display == null) {
	      this.setProp('display', 'block', this.style, 'Style');
	    } else if (display === 'visible') {
	      this.setProp('visibility', 'visible', this.style, 'Style');
	    } else {
	      this.setProp('display', display, this.style, 'Style');
	    }
	    this.update();
	    return this;
	  };

	  Tag.prototype.hide = function(display) {
	    if (typeof display === 'function') {
	      display = display();
	      if (display == null) {
	        display = '';
	      }
	    }
	    if (!display) {
	      this.setProp('display', 'none', this.style, 'Style');
	    } else if (display === 'hidden') {
	      this.setProp('visibility', 'hidden', this.style, 'Style');
	    } else {
	      this.setProp('display', display, this.style, 'Style');
	    }
	    this.update();
	    return this;
	  };

	  Tag.prototype.showHide = function(status, test, display) {
	    var fn, me, method, oldDisplay, style;
	    style = this.style;
	    test = domField(test);
	    oldDisplay = style.display;
	    if (!oldDisplay) {
	      this.addActivity(style, 'display', 'Style', this.node);
	    } else if (typeof oldDisplay === 'function' && oldDisplay.offInvalidate) {
	      oldDisplay.offInvalidate(this.invalidateStyle.display);
	    }
	    style.display = method = flow(test, oldDisplay, function() {
	      var d;
	      if ((typeof test === 'function' ? !!test() : !!test) === status) {
	        if (display) {
	          if (typeof display === 'function') {
	            return display();
	          } else {
	            return display;
	          }
	        } else if (oldDisplay != null) {
	          if (typeof oldDisplay === 'function') {
	            d = oldDisplay();
	          } else {
	            d = oldDisplay;
	          }
	          if (d !== 'none') {
	            return d;
	          } else {
	            return 'block';
	          }
	        } else {
	          return oldDisplay = 'block';
	        }
	      } else {
	        return 'none';
	      }
	    });
	    me = this;
	    this.invalidateStyle.display = fn = function() {
	      me.addActivity(style, 'display', 'Style', true);
	      return style.display = method;
	    };
	    method.onInvalidate(fn);
	    this.style = style;
	    return this;
	  };

	  Tag.prototype.showOn = function(test, display) {
	    return this.showHide(true, test, display);
	  };

	  Tag.prototype.hideOn = function(test, display) {
	    return this.showHide(false, test, display);
	  };

	  Tag.prototype.createDom = function() {
	    var child, children, length, node, _i, _len;
	    this.node = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
	    this.hasActiveProperties && this.updateProperties();
	    children = this.children;
	    for (_i = 0, _len = children.length; _i < _len; _i++) {
	      child = children[_i];
	      child.parentNode = node;
	    }
	    if (length = children.length) {
	      children[length - 1].nextNode = null;
	    }
	    this.childNodes = [];
	    this.createChildrenDom();
	    this.firstNode = node;
	    return node;
	  };

	  Tag.prototype.updateDom = function() {
	    var children, index, invalidIndexes, node, _i, _len;
	    this.hasActiveProperties && this.updateProperties();
	    children = this.children, node = this.node, invalidIndexes = this.invalidIndexes;
	    for (_i = 0, _len = invalidIndexes.length; _i < _len; _i++) {
	      index = invalidIndexes[_i];
	      children[index].parentNode = node;
	    }
	    this.updateChildrenDom();
	    return this.firstNode = this.node;
	  };

	  Tag.prototype.removeDom = function() {
	    this.removeNode();
	    this.emit('afterRemoveDom');
	    return this;
	  };

	  Tag.prototype.attachNode = function() {
	    var node;
	    node = this.node;
	    if (this.parentNode === node.parentNode) {
	      return node;
	    }
	    this.parentNode.insertBefore(node, this.nextNode);
	    return node;
	  };

	  Tag.prototype.removeNode = function() {
	    return this.node.parentNode.removeChild(this.node);
	  };

	  Tag.prototype.updateProperties = function() {
	    var cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, events, node, prop, props, style, value;
	    this.hasActiveProperties = false;
	    node = this.node, className = this.className;
	    if (!className.valid) {
	      classValue = className();
	      if (classValue !== this.cacheClassName) {
	        this.cacheClassName = node.className = classValue;
	      }
	    }
	    if (this.hasActiveProps) {
	      props = this.props, cacheProps = this.cacheProps;
	      this.hasActiveProps = false;
	      for (prop in props) {
	        value = props[prop];
	        delete props[prop];
	        if (typeof value === 'function') {
	          value = value();
	        }
	        if (value == null) {
	          value = '';
	        }
	        cacheProps[prop] = node[prop] = value;
	      }
	    }
	    if (this.hasActiveStyle) {
	      style = this.style, cacheStyle = this.cacheStyle;
	      this.hasActiveStyle = false;
	      elementStyle = node.style;
	      for (prop in style) {
	        value = style[prop];
	        delete style[prop];
	        if (typeof value === 'function') {
	          value = value();
	        }
	        if (value == null) {
	          value = '';
	        }
	        cacheStyle[prop] = elementStyle[prop] = value;
	      }
	    }
	    if (this.hasActiveEvents) {
	      events = this.events;
	      for (eventName in events) {
	        callbackList = events[eventName];
	        node[eventName] = eventHandlerFromArray(callbackList, eventName, this);
	      }
	    }
	    this.hasActiveEvents = false;
	  };

	  Tag.prototype.clone = function() {
	    var child, children, _i, _len, _ref2;
	    children = [];
	    _ref2 = this.children;
	    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	      child = _ref2[_i];
	      children.push(child.clone());
	    }
	    return new Tag(this.tagName, this.attrs, children).copyEventListeners(this);
	  };

	  Tag.prototype.toString = function(indent, addNewLine) {
	    var child, children, key, s, v, value, _i, _len, _ref2, _ref3, _ref4;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine("<" + this.tagName, indent, addNewLine);
	    _ref2 = this.props;
	    for (key in _ref2) {
	      value = _ref2[key];
	      s += ' ' + key + '=' + funcString(value);
	    }
	    if (this.hasActiveStyle) {
	      s += ' style={';
	      _ref3 = this.style;
	      for (key in _ref3) {
	        value = _ref3[key];
	        if (typeof value === 'string') {
	          s += value;
	        } else {
	          for (key in value) {
	            v = value[key];
	            s += ' ' + key + '=' + funcString(v);
	          }
	        }
	      }
	      s += '}';
	    }
	    s += '>';
	    children = this.children;
	    if (children.length > 1) {
	      _ref4 = this.children;
	      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
	        child = _ref4[_i];
	        s += child.toString(indent + 2, true);
	      }
	      return s += newLine("</" + this.tagName + ">", indent + 2, true);
	    } else {
	      if (children.length === 1) {
	        s += children[0].toString(indent + 2);
	      }
	      return s += newLine("</" + this.tagName + ">", indent + 2);
	    }
	  };

	  return Tag;

	})(List);


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var attrPropNameMap, classFn, cloneObject, config, domField, extend, extendEventValue, isArray, isComponent, overAttrs, react, styleFrom, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(3), isArray = _ref.isArray, cloneObject = _ref.cloneObject;

	domField = __webpack_require__(6).domField;

	react = __webpack_require__(2).react;

	extend = __webpack_require__(9);

	isComponent = __webpack_require__(8).isComponent;

	exports.extendEventValue = extendEventValue = function(props, prop, value, before) {
	  var oldValue;
	  oldValue = props[prop];
	  if (!oldValue) {
	    oldValue = [];
	  } else if (!(oldValue instanceof Array)) {
	    oldValue = [oldValue];
	  }
	  if (!value) {
	    value = [];
	  } else if (!(value instanceof Array)) {
	    value = [value];
	  }
	  if (before) {
	    return props[prop] = value.concat(oldValue);
	  } else {
	    return props[prop] = oldValue.concat(value);
	  }
	};

	exports.extendAttrs = function(attrs, obj, options) {
	  var key, objClass, value;
	  if (options == null) {
	    options = {};
	  }
	  if (!obj) {
	    return attrs;
	  } else if (!attrs) {
	    return obj;
	  }
	  objClass = classFn([obj["class"], obj.className]);
	  if (options.replaceClass) {
	    attrs.className = objClass;
	  } else {
	    attrs.className = classFn([attrs["class"], attrs.className]);
	    delete attrs["class"];
	    attrs.className = classFn([attrs.className, objClass]);
	  }
	  if (obj.style) {
	    extend(styleFrom(attrs.style), obj.style);
	  }
	  for (key in obj) {
	    value = obj[key];
	    if (key.slice(0, 2) === 'on') {
	      if (options['replace_' + key] || options.replaceEvents) {
	        attrs[key] = value;
	      } else {
	        extendEventValue(attrs, key, value);
	      }
	    } else {
	      attrs[key] = value;
	    }
	  }
	  return attrs;
	};

	exports.overAttrs = overAttrs = function(attrs, obj) {
	  var key, value;
	  if (!obj) {
	    attrs = extend({}, attrs);
	    if (attrs.style) {
	      attrs.style = extend({}, styleFrom(attrs.style));
	    }
	    return attrs;
	  } else if (!attrs) {
	    return obj;
	  } else {
	    for (key in attrs) {
	      value = attrs[key];
	      if (obj[key] == null) {
	        obj[key] = value;
	      }
	      if (key === 'style') {
	        obj[key] = overAttrs(attrs[key], obj[key]);
	      }
	    }
	    return obj;
	  }
	};

	exports.classFn = classFn = function() {
	  var classMap, extendClassMap, items, method, processClassValue;
	  items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  classMap = {};
	  method = function() {
	    var klass, lst, value;
	    if (!arguments.length) {
	      lst = [];
	      method.valid = true;
	      for (klass in classMap) {
	        value = classMap[klass];
	        if (typeof value === 'function') {
	          value = value();
	        }
	        if (value) {
	          lst.push(klass);
	        }
	      }
	      return lst.join(' ');
	    } else {
	      extendClassMap(arguments.slice());
	    }
	  };
	  processClassValue = function(name, value) {
	    var oldValue;
	    value = domField(value);
	    oldValue = classMap[name];
	    if (typeof oldValue === 'function') {
	      oldValue.offInvalidate(method.invalidate);
	    }
	    if (!value && oldValue) {
	      method.invalidate();
	      return delete classMap[name];
	    } else {
	      if (oldValue !== value) {
	        method.invalidate();
	        if (typeof value === 'function') {
	          value.onInvalidate(method.invalidate);
	        }
	        return classMap[name] = value;
	      }
	    }
	  };
	  extendClassMap = function(items) {
	    var item, name, names, value, _i, _j, _len, _len1, _ref1;
	    if (!items) {
	      return;
	    }
	    if (!isArray(items)) {
	      items = [items];
	    }
	    for (_i = 0, _len = items.length; _i < _len; _i++) {
	      item = items[_i];
	      if (!item) {
	        continue;
	      }
	      if (typeof item === 'string') {
	        names = item.trim().split(/\s+(?:,\s+)?/);
	        for (_j = 0, _len1 = names.length; _j < _len1; _j++) {
	          name = names[_j];
	          if (name[0] === '!') {
	            processClassValue(name.slice(1), false);
	          } else {
	            processClassValue(name, true);
	          }
	        }
	      } else if (item instanceof Array) {
	        extendClassMap(item);
	      } else if (item && item.classMap) {
	        _ref1 = item.classMap;
	        for (name in _ref1) {
	          value = _ref1[name];
	          if (typeof value !== 'function') {
	            value = true;
	          }
	          processClassValue(name, value);
	        }
	      } else if (typeof item === 'object') {
	        for (name in item) {
	          value = item[name];
	          if (typeof value !== 'function') {
	            value = true;
	          }
	          processClassValue(name, value);
	        }
	      }
	    }
	  };
	  react(method);
	  extendClassMap(items);
	  method.classMap = classMap;
	  method.valid = !Object.keys(classMap).length;
	  method.removeClass = function() {
	    var item, items, _i, _len, _results;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    _results = [];
	    for (_i = 0, _len = items.length; _i < _len; _i++) {
	      item = items[_i];
	      _results.push(processClassValue(item, false));
	    }
	    return _results;
	  };
	  method.extend = function() {
	    var items;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return extendClassMap(items);
	  };
	  return method;
	};

	exports.styleFrom = styleFrom = function(value) {
	  var item, key, result, v, _i, _j, _len, _len1, _ref1, _ref2;
	  if (typeof value === 'string') {
	    result = {};
	    value = value.trim().split(/\s*;\s*/);
	    for (_i = 0, _len = value.length; _i < _len; _i++) {
	      item = value[_i];
	      item = item.trim();
	      if (!item) {
	        continue;
	      }
	      _ref1 = item.split(/\s*:\s*/), key = _ref1[0], v = _ref1[1];
	      result[key] = v;
	    }
	    return result;
	  } else if (value instanceof Array) {
	    result = {};
	    for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
	      item = value[_j];
	      if (typeof item === 'string') {
	        item = item.trim();
	        if (!item) {
	          continue;
	        }
	        _ref2 = item.split(/\s*:\s*/), key = _ref2[0], value = _ref2[1];
	      } else {
	        key = item[0], value = item[1];
	      }
	      result[key] = value;
	    }
	    return result;
	  } else if (value && typeof value !== 'object') {
	    return {};
	  } else {
	    return cloneObject(value);
	  }
	};

	config = __webpack_require__(7);

	exports.eventHandlerFromArray = function(callbackList, eventName, component) {
	  return function(event) {
	    var comp, fn, node, options, updateList, _i, _j, _len, _len1, _ref1;
	    node = component.node;
	    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
	      fn = callbackList[_i];
	      fn && fn.call(node, event, component);
	    }
	    updateList = component.eventUpdateConfig[eventName];
	    if (updateList) {
	      for (_j = 0, _len1 = updateList.length; _j < _len1; _j++) {
	        _ref1 = updateList[_j], comp = _ref1[0], options = _ref1[1];
	        if (options.alwaysUpdating || !config.useSystemUpdating) {
	          comp[options.method]();
	        }
	      }
	    }
	    if (!event) {
	      return;
	    }
	    !event.executeDefault && event.preventDefault();
	    !event.continuePropagation && event.stopPropagation();
	  };
	};

	attrPropNameMap = {
	  'for': 'htmlFor'
	};

	exports.attrToPropName = function(name) {
	  var i, len, newName, pieces;
	  if (newName = attrPropNameMap[name]) {
	    newName;
	  }
	  pieces = name.split('-');
	  if (pieces.length === 1) {
	    return name;
	  }
	  i = 1;
	  len = pieces.length;
	  while (i < len) {
	    pieces[i] = pieces[i][0].toUpperCase() + pieces[i].slice(1);
	    i++;
	  }
	  return pieces.join('');
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Comment, constructTextLikeComponent, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(17);

	constructTextLikeComponent = __webpack_require__(18).constructTextLikeComponent;

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(6).domValue;

	module.exports = Comment = (function(_super) {
	  __extends(Comment, _super);

	  function Comment(text) {
	    Comment.__super__.constructor.call(this);
	    constructTextLikeComponent.call(this, text);
	  }

	  Comment.prototype.createDom = function(parentNode, nextNode) {
	    this.node = document.createComment(domValue(this.text));
	    return this.node;
	  };

	  Comment.prototype.updateDom = function(parentNode, nextNode) {
	    this.text && (this.node.data = domValue(this.text));
	    return this.node;
	  };

	  Comment.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Comment " + (funcString(this.text)) + "/>", indent, addNewLine);
	  };

	  return Comment;

	})(BaseComponent);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Html, constructTextLikeComponent, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(17);

	constructTextLikeComponent = __webpack_require__(18).constructTextLikeComponent;

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(6).domValue;

	module.exports = Html = (function(_super) {
	  __extends(Html, _super);

	  function Html(text, transform) {
	    this.transform = transform;
	    Html.__super__.constructor.call(this);
	    constructTextLikeComponent.call(this, text);
	  }

	  Html.prototype.createDom = function() {
	    var node;
	    this.textValid = true;
	    node = document.createElement('DIV');
	    node.innerHTML = this.cacheText = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
	    this.node = (function() {
	      var _i, _len, _ref1, _results;
	      _ref1 = node.childNodes;
	      _results = [];
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        node = _ref1[_i];
	        _results.push(node);
	      }
	      return _results;
	    })();
	    this.firstNode = this.node[0];
	    return this;
	  };

	  Html.prototype.updateDom = function() {
	    var node, text;
	    if (!this.textValid) {
	      return this;
	    }
	    this.textValid = true;
	    text = this.transform && this.transform(domValue(this.text)) || domValue(this.text);
	    if (text !== this.cacheText) {
	      if (this.node.parentNode) {
	        this.removeNode();
	      }
	      node = document.createElement('DIV');
	      node.innerHTML = text;
	      this.node = node.childNodes;
	      this.firstNode = this.node[0];
	      this.cacheText = text;
	    }
	    return this;
	  };

	  Html.prototype.attachNode = function() {
	    var childNode, node, parentNode, _i, _len;
	    node = this.node, parentNode = this.parentNode;
	    if (parentNode === node.parentNode) {
	      return node;
	    }
	    node.parentNode = parentNode;
	    for (_i = 0, _len = node.length; _i < _len; _i++) {
	      childNode = node[_i];
	      parentNode.insertBefore(childNode, this.nextNode);
	    }
	    return node;
	  };

	  Html.prototype.removeNode = function() {
	    var childNode, parentNode, _i, _len, _ref1;
	    parentNode = this.node.parentNode;
	    _ref1 = this.node;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      childNode = _ref1[_i];
	      parentNode.removeChild(childNode);
	    }
	    this.node.parentNode = null;
	  };

	  Html.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Html " + (funcString(this.text)) + "/>", indent, addNewLine);
	  };

	  return Html;

	})(BaseComponent);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var If, TransformComponent, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(15);

	TransformComponent = __webpack_require__(13);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	module.exports = If = (function(_super) {
	  __extends(If, _super);

	  function If(test, then_, else_) {
	    var family;
	    if (then_ === else_) {
	      return toComponent(then_);
	    }
	    then_ = toComponent(then_);
	    else_ = toComponent(else_);
	    if (typeof test !== 'function') {
	      if (test) {
	        return then_;
	      } else {
	        return else_;
	      }
	    }
	    If.__super__.constructor.call(this);
	    this.then_ = then_;
	    this.else_ = else_;
	    this.family = family = intersect([then_.family, else_.family]);
	    family[this.dcid] = true;
	    if (!test.invalidate) {
	      this.test = renew(test);
	    } else {
	      this.test = test;
	    }
	    this.test.onInvalidate(this.invalidateTransform.bind(this));
	    this;
	  }

	  If.prototype.getContentComponent = function() {
	    if (this.test()) {
	      return this.then_;
	    } else {
	      return this.else_;
	    }
	  };

	  If.prototype.clone = function() {
	    return (new If(this.test, this.then_.clone(), this.else_.clone())).copyEventListeners(this);
	  };

	  If.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    if (addNewLine == null) {
	      addNewLine = '';
	    }
	    return newLine('', indent, addNewLine) + '<if ' + funcString(this.test) + '>' + this.then_.toString(indent + 2, true) + this.else_.toString(indent + 2, true) + newLine('</if>', indent, true);
	  };

	  return If;

	})(TransformComponent);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Case, TransformComponent, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(15);

	TransformComponent = __webpack_require__(13);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	module.exports = Case = (function(_super) {
	  __extends(Case, _super);

	  function Case(test, map, else_) {
	    var families, family, key, value, _;
	    this.map = map;
	    if (typeof test !== 'function') {
	      if (map.hasOwnPoperty(test)) {
	        return toComponent(map[key]);
	      } else {
	        return toComponent(else_);
	      }
	    }
	    Case.__super__.constructor.call(this);
	    if (!test.invalidate) {
	      this.test = renew(test);
	    } else {
	      this.test = test;
	    }
	    this.test.onInvalidate(this.invalidateTransform.bind(this));
	    for (key in map) {
	      value = map[key];
	      map[key] = toComponent(value);
	    }
	    this.else_ = toComponent(else_);
	    families = (function() {
	      var _ref1, _results;
	      _ref1 = this.map;
	      _results = [];
	      for (_ in _ref1) {
	        value = _ref1[_];
	        _results.push(value.family);
	      }
	      return _results;
	    }).call(this);
	    families.push(this.else_.family);
	    this.family = family = intersect(families);
	    family[this.dcid] = true;
	  }

	  Case.prototype.getContentComponent = function() {
	    return this.map[this.test()] || this.else_;
	  };

	  Case.prototype.clone = function() {
	    var cloneMap, key, value, _ref1;
	    cloneMap = {};
	    _ref1 = this.map;
	    for (key in _ref1) {
	      value = _ref1[key];
	      cloneMap[key] = value.clone();
	    }
	    return (new Case(this.test, cloneMap, this["else"].clone())).copyEventListeners(this);
	  };

	  Case.prototype.toString = function(indent, addNewLine) {
	    var comp, key, s, _ref1;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine('', indent, addNewLine) + '<Case ' + funcString(this.test) + '>';
	    _ref1 = this.map;
	    for (key in _ref1) {
	      comp = _ref1[key];
	      s += newLine(key + ': ' + comp.toString(indent + 2, false), indent + 2, true);
	    }
	    return s += this.else_.toString(indent + 2, true) + newLine('</Case>', indent, true);
	  };

	  return Case;

	})(TransformComponent);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Each, Func, List, Text, TransformComponent, flow, funcString, isArray, newLine, react, renew, toComponent, watchEachList, watchEachObject, _ref, _ref1, _ref2,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	isArray = __webpack_require__(3).isArray;

	toComponent = __webpack_require__(15);

	TransformComponent = __webpack_require__(13);

	List = __webpack_require__(19);

	Func = __webpack_require__(20);

	Text = __webpack_require__(18);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	_ref1 = __webpack_require__(2), react = _ref1.react, renew = _ref1.renew, flow = _ref1.flow;

	_ref2 = __webpack_require__(1), watchEachList = _ref2.watchEachList, watchEachObject = _ref2.watchEachObject;

	module.exports = Each = (function(_super) {
	  __extends(Each, _super);

	  function Each(items, itemFn, options) {
	    var key, me;
	    this.itemFn = itemFn;
	    if (options == null) {
	      options = {};
	    }
	    Each.__super__.constructor.call(this);
	    this.family = {};
	    me = this;
	    if (typeof items === 'function') {
	      this.isFunction = true;
	      !items.invalidate && (items = renew(items));
	      items.onInvalidate(this.invalidateTransform.bind(this));
	    }
	    this.items = items;
	    if (options.sort) {
	      this.needSort = true;
	      if (typeof options.sort === 'function') {
	        this.sortFunction = options.sort;
	      } else {
	        this.sortFunction = null;
	      }
	    }
	    key = options.key;
	    this.keyFunction = typeof key === 'function' ? key : key != null ? function(item, i) {
	      return item[key];
	    } : void 0;
	    this.childReactives = [];
	    this.memoComponents = {};
	    this.memoChildMap = {};
	    this.cacheChildren = [];
	    this.listComponent = new List([]);
	    this.listComponent.holder = this;
	    return;
	  }

	  Each.prototype.getItems = function() {};

	  Each.prototype.getContentComponent = function() {
	    var isFunction, items, key, length, listComponent, needSort, value, watchingMe, _items;
	    listComponent = this.listComponent, items = this.items, isFunction = this.isFunction, needSort = this.needSort;
	    if (!items) {
	      return this.emptyPlaceHolder || (this.emptyPlaceHolder = new Nothing());
	    }
	    if (isFunction) {
	      items = items();
	      if (!items) {
	        return this.emptyPlaceHolder || (this.emptyPlaceHolder = new Nothing());
	      }
	      if (typeof items !== 'object') {
	        throw new Error('Each Component need an array or object');
	      }
	    }
	    if (!(this.isArrayItems = items instanceof Array)) {
	      items = (function() {
	        var _results;
	        _results = [];
	        for (key in items) {
	          value = items[key];
	          _results.push([key, value]);
	        }
	        return _results;
	      })();
	    }
	    if (needSort) {
	      items.sort(this.sortFunction);
	    } else {
	      _items = this._items;
	      _items && _items.watchingComponents && delete _items.watchingComponents[this.dcid];
	      watchingMe = items && items.watchingComponents && items.watchingComponents[this.dcid];
	      if (!this.notWatch && !watchingMe) {
	        if (this.isArrayItems) {
	          watchEachList(items, this);
	        } else {
	          watchEachObject(items, this);
	        }
	      }
	    }
	    this._items = items;
	    length = items.length;
	    if (length < listComponent.children.length) {
	      this._setLength(length);
	      if (isFunction || needSort || !this.isArrayItems) {
	        this.invalidateChildren(0, length);
	      }
	    } else {
	      this.invalidateChildren(0, length);
	    }
	    return listComponent;
	  };

	  Each.prototype.getChild = function(index) {
	    var cacheChildren, child, childReactives, children, itemFn, keyFunction, listComponent, me, memoKey;
	    me = this;
	    if (keyFunction) {
	      memoKey = this.isArrayItems ? keyFunction(_items[index], index) : keyFunction(_items[index][0], _items[index][1], index);
	    }
	    listComponent = this.listComponent, cacheChildren = this.cacheChildren, children = this.children, childReactives = this.childReactives, keyFunction = this.keyFunction, itemFn = this.itemFn;
	    children = listComponent.children;
	    if (keyFunction) {
	      if (this.memoChildMap[memoKey]) {
	        throw new Error('duplicated memo key in Each Component');
	      }
	      if (child = this.memoComponents[memoKey]) {
	        child.valid = false;
	        child.transformValid = false;
	        children[index] = cacheChildren[index] = child;
	        this.memoChildMap[memoKey] = child;
	        return child;
	      }
	    }
	    if (index < children.length) {
	      child = children[index];
	      child.valid = false;
	      child.transformValid = false;
	    } else if (index < cacheChildren.length) {
	      child = children[index] = cacheChildren[index];
	      child.valid = false;
	      child.transformValid = false;
	    } else {
	      childReactives[index] = react(function() {
	        var item, items, key, result, value;
	        items = me._items;
	        item = items[index];
	        if (itemFn.pouring) {
	          child.invalidateTransform();
	        }
	        return result = me.isArrayItems ? itemFn(item, index, items, me) : ((key = item[0], value = item[1], item), itemFn(value, key, index, items, me));
	      });
	      children[index] = cacheChildren[index] = child = new Func(childReactives[index]);
	      child.holder = listComponent;
	      listComponent.dcidIndexMap[child.dcid] = index;
	    }
	    return child;
	  };

	  Each.prototype.invalidateChildren = function(start, stop) {
	    var children, i, listComponent, oldChildrenLength;
	    if (stop == null) {
	      stop = start + 1;
	    }
	    i = start;
	    listComponent = this.listComponent;
	    children = listComponent.children;
	    oldChildrenLength = children.length;
	    while (i < stop) {
	      this.getChild(i);
	      i++;
	    }
	    if (stop > oldChildrenLength) {
	      children[stop - 1].nextNode = this.nextNode;
	    }
	    listComponent.invalidChildren(start, stop);
	    return this;
	  };

	  Each.prototype._setLength = function(length) {
	    var index, listComponent, oldLength;
	    listComponent = this.listComponent;
	    oldLength = listComponent.children.length;
	    if (length >= oldLength) {
	      return this;
	    } else {
	      if (this.keyFunction) {
	        index = length;
	        while (index < oldLength) {
	          delete memoChildMap[children[index].memoKey];
	          index++;
	        }
	      }
	      listComponent.setLength(length);
	      return this;
	    }
	  };

	  Each.prototype.clone = function(options) {
	    return (new Each(this.items, this.itemFn, options || this.options)).copyEventListeners(this);
	  };

	  Each.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    return newLine("<Each " + (funcString(this.items)) + " " + (funcString(this.itemFn)) + "/>", indent, addNewLine);
	  };

	  return Each;

	})(TransformComponent);


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var Defer, FULFILL, INIT, REJECT, TransformComponent, extend, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(15);

	TransformComponent = __webpack_require__(13);

	extend = __webpack_require__(9);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	INIT = 0;

	FULFILL = 1;

	REJECT = 2;

	module.exports = Defer = (function(_super) {
	  __extends(Defer, _super);

	  function Defer(promise, fulfill, reject, init) {
	    var family;
	    this.promise = promise;
	    Defer.__super__.constructor.apply(this, arguments);
	    this.fulfill = fulfill || function(result) {
	      return result;
	    };
	    this.reject = reject || function(error) {
	      return error;
	    };
	    this.init = init && init(promise, this) || new Nothing();
	    this.family = family = intersect([fullfill.family, reject.family, init.family]);
	    family[this.dcid] = true;
	    this.promiseState = INIT;
	    promise.then(function(value) {
	      this.promiseResult = value;
	      this.promiseState = FULFILL;
	      return this.invalidateTransform();
	    })["catch"](function(error) {
	      this.promiseResult = error;
	      this.promiseState = REJECT;
	      return this.invalidateTransform();
	    });
	    this;
	  }

	  Defer.prototype.getContentComponent = function() {
	    var state;
	    if ((state = this.promiseState) === INIT) {
	      return init;
	    } else if (state === FULFILL) {
	      return toComponent(this.fulfill(this.promiseResult, this.promise, this));
	    } else {
	      return toComponent(this.reject(this.promiseResult, this.promise, this));
	    }
	  };

	  Defer.prototype.clone = function() {
	    return (new Defer(this.promise, this.fulfill, this.reject, this.init.clone)).copyEventListeners(this);
	  };

	  Defer.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    if (addNewLine == null) {
	      addNewLine = '';
	    }
	    return newLine('', indent, addNewLine) + '<Defer ' + this.promise + '>' + newLine('', indent, addNewLine) + funcString(this.fulfill) + newLine('', indent, addNewLine) + funcString(this.reject) + this.init.toString(indent + 2, true) + newLine('</Defer>', indent, true);
	  };

	  return Defer;

	})(TransformComponent);

	extend(Defer, {
	  INIT: INIT,
	  FULFILL: FULFILL,
	  REJECT: REJECT
	});


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Case, Comment, Component, Defer, Each, Func, Html, If, List, Tag, Text, attrsChildren, every, isAttrs, isComponent, isEven, list, numbers, tag, toComponent, toTagChildren, _ref, _ref1,
	  __slice = [].slice;

	_ref = __webpack_require__(11), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Each = _ref.Each, Defer = _ref.Defer;

	_ref1 = __webpack_require__(3), isEven = _ref1.isEven, numbers = _ref1.numbers;

	isAttrs = __webpack_require__(30).isAttrs;

	attrsChildren = function(args) {
	  var attrs;
	  attrs = args[0];
	  if (!args.length) {
	    return [{}, []];
	  } else if (attrs==null) {
	    return [{}, args.slice(1)];
	  } else if (attrs instanceof Array) {
	    return [{}, args];
	  } else if (typeof attrs === 'function') {
	    return [{}, args];
	  } else if (typeof attrs === 'object') {
	    if (isComponent(attrs)) {
	      return [{}, args];
	    } else {
	      return [attrs, args.slice(1)];
	    }
	  } else {
	    return [{}, args];
	  }
	};

	toTagChildren = function(args) {
	  if (!(args instanceof Array)) {
	    return [args];
	  } else if (!args.length) {
	    return [];
	  } else if (args.length === 1) {
	    return toTagChildren(args[0]);
	  } else {
	    return args;
	  }
	};

	tag = exports.tag = function() {
	  var args, attrs, children, tagName, _ref2;
	  tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  _ref2 = attrsChildren(args), attrs = _ref2[0], children = _ref2[1];
	  return new Tag(tagName, attrs, toTagChildren(children));
	};

	exports.nstag = function() {
	  var args, attrs, children, namespace, tagName, _ref2;
	  tagName = arguments[0], namespace = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
	  _ref2 = attrsChildren(args), attrs = _ref2[0], children = _ref2[1];
	  return new Tag(tagName, attrs, toTagChildren(children), namespace);
	};

	exports.txt = function(attrs, text) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Text(text)]);
	  } else {
	    return new Text(attrs);
	  }
	};

	exports.comment = function(attrs, text) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Comment(text)]);
	  } else {
	    return new Comment(attrs);
	  }
	};

	exports.html = function(attrs, text, transform) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Html(text, transform)]);
	  } else {
	    return new Html(attrs, text);
	  }
	};

	exports.if_ = function(attrs, test, then_, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_)]);
	  } else {
	    return new If(attrs, test, then_, else_);
	  }
	};

	exports.case_ = function(attrs, test, map, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Case(test, map, else_)]);
	  } else {
	    return new Case(attrs, test, map, else_);
	  }
	};

	exports.cond = function() {
	  var attrs, condComponents, else_, _i;
	  attrs = arguments[0], condComponents = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), else_ = arguments[_i++];
	  if (isAttrs(attrs)) {
	    if (!isEven(condComponents)) {
	      condComponents.push(else_);
	      else_ = null;
	    }
	    return new Tag('div', attrs, [new Cond(condComponents, else_)]);
	  } else {
	    condComponents.unshift(attrs);
	    if (!isEven(condComponents)) {
	      condComponents.push(else_);
	      else_ = null;
	    }
	    return new Cond(condComponents, else_);
	  }
	};

	exports.func = function(attrs, fn) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Func(fn)]);
	  } else {
	    return new Func(attrs);
	  }
	};

	exports.list = list = function() {
	  var attrs, lst;
	  attrs = arguments[0], lst = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new List(lst)]);
	  } else {
	    lst.unshift(attrs);
	    if (lst.length === 1) {
	      return toComponent(lst[0]);
	    } else {
	      return new List(lst);
	    }
	  }
	};


	/**
	  @param
	    itemFn - function (item, index, list, component) { ... }
	    itemFn - function (value, key, index, hash, component) { ... }
	 */

	exports.each = function(attrs, list, itemFn) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Each(list, itemFn)]);
	  } else {
	    return new Each(attrs, list);
	  }
	};

	exports.every = every = function(attrs, list, itemFn) {
	  var children, i, item, _i, _j, _len, _len1;
	  if (isAttrs(attrs)) {
	    if (!list) {
	      return new Nothing();
	    }
	    children = [];
	    for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
	      item = list[i];
	      children.push(itemFn(item, i, list));
	    }
	    return new Tag('div', attrs, [new List(children)]);
	  } else {
	    if (!attrs) {
	      return new Nothing();
	    }
	    children = [];
	    for (i = _j = 0, _len1 = attrs.length; _j < _len1; i = ++_j) {
	      item = attrs[i];
	      children.push(list(item, i, attrs));
	    }
	    return new List(children);
	  }
	};

	exports.all = function(attrs, hash, itemFn) {
	  var children, i, key, value;
	  if (isAttrs(attrs)) {
	    if (!hash) {
	      return new Nothing();
	    }
	    children = [];
	    i = 0;
	    for (key in hash) {
	      value = hash[key];
	      if (!hash.hasOwnProperty(key)) {
	        break;
	      }
	      children.push(itemFn(key, value, i, hash));
	      i++;
	    }
	    return new Tag('div', attrs, [new List(children)]);
	  } else {
	    if (!attrs) {
	      return new Nothing();
	    }
	    children = [];
	    i = 0;
	    for (key in attrs) {
	      value = attrs[key];
	      if (!attrs.hasOwnProperty(key)) {
	        break;
	      }
	      children.push(itemFn(key, value, i, hash));
	      i++;
	    }
	    return new List(children);
	  }
	};

	exports.nItems = function(attrs, n, itemFn) {
	  if (isAttrs) {
	    if (typeof n === 'function') {
	      return new Tag('div', attrs, [new Each(numbers(n), itemFn)]);
	    } else {
	      return new Tag('div', every(numbers(n), itemFn));
	    }
	  } else {
	    if (typeof atrrs === 'function') {
	      return new Each(numbers(atrrs), n);
	    } else {
	      return every(numbers(atrrs), n);
	    }
	  }
	};

	exports.defer = function(attrs, promise, fulfill, reject, init) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Defer(promise, fulfill, reject, init)]);
	  } else {
	    return new Defer(attrs, promise, fulfill, reject);
	  }
	};

	exports.clone = function(attrs, src) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [toComponent(src).clone()]);
	  } else {
	    return toComponent(attrs).clone(src);
	  }
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var Comment, Func, Html, Text, isComponent, mergeThenElseValue, toComponent, _ref;

	_ref = __webpack_require__(11), isComponent = _ref.isComponent, toComponent = _ref.toComponent;

	Func = __webpack_require__(20);

	Text = __webpack_require__(18);

	Html = __webpack_require__(24);

	Comment = __webpack_require__(23);

	exports.isAttrs = function(item) {
	  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
	};

	mergeThenElseValue = function(test, thenValue, elseValue) {
	  return dc.flow.if_(test, thenValue, elseValue);
	};

	exports._maybeIf = function(test, then_, else_) {
	  var attrs, elseAttrs, key, thenAttrs;
	  then_ = toComponent(then_);
	  else_ = toComponent(else_);
	  if (then_ === else_) {
	    return then_;
	  }
	  if (then_ instanceof Nothing && else_ instanceof Nothing) {
	    return then_;
	  }
	  if (typeof test === 'function') {
	    if (then_.isTag && else_.isTag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
	      attrs = {};
	      thenAttrs = then_.attrs;
	      elseAttrs = else_.attrs;
	      for (key in bothKeys(thenAttrs, elseAttrs)) {
	        attrs[key] = mergeThenElseValue(test, thenAttrs[key], elseAttrs[key]);
	      }
	      attrs.namespace = then_.namespace;
	      return new Tag(then_.tagName, attrs, children);
	    } else if (then_ instanceof Text && else_ instanceof Text) {
	      return new Text(mergeThenElseValue(test, then_.text, else_.text));
	    } else if (then_ instanceof Comment && else_ instanceof Comment) {
	      return new Comment(mergeThenElseValue(test, then_.text, else_.text));
	    } else if (then_ instanceof Html && else_ instanceof Html) {
	      return new Html(mergeThenElseValue(test, then_.text, else_.text));
	    } else if (then_ instanceof Func && else_ instanceof Func) {
	      return new Func(flow.if_(test, then_.func, else_.func));
	    } else {
	      return new If(test, then_, else_);
	    }
	  } else if (test) {
	    return then_;
	  } else {
	    return else_;
	  }
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var extend, getBindProp, input, inputTypes, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref,
	  __slice = [].slice;

	extend = __webpack_require__(9);

	tag = __webpack_require__(29).tag;

	getBindProp = __webpack_require__(6).getBindProp;

	tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section";

	tagNames = tagNames.split(' ');

	_fn = function(tagName) {
	  return exports[tagName] = function() {
	    return tag.apply(null, [tagName].concat(__slice.call(arguments)));
	  };
	};
	for (_i = 0, _len = tagNames.length; _i < _len; _i++) {
	  tagName = tagNames[_i];
	  _fn(tagName);
	}

	exports.tagHtml = tag.apply(null, [tagName].concat(__slice.call(arguments)));

	inputTypes = 'text checkbox radio date email number'.split(' ');

	input = exports.input = function(type, attrs, value) {
	  var component;
	  if (typeof type === 'object') {
	    value = attrs;
	    attrs = type;
	    type = 'text';
	  }
	  attrs = extend({
	    type: type
	  }, attrs);
	  component = tag('input', attrs);
	  if (value != null) {
	    component.prop(getBindProp(component), value);
	    if (value.isDuplex) {
	      component.bind('onchange', (function(event, comp) {
	        return value(this.value);
	      }), 'before');
	    }
	  }
	  return component;
	};

	_ref = 'text checkbox radio date email tel number'.split(' ');
	_fn1 = function(type) {
	  return exports[type] = function(value, attrs) {
	    var temp;
	    if (typeof value === 'object') {
	      temp = attrs;
	      attrs = value;
	      value = temp;
	    }
	    attrs = attrs || {};
	    return input(type, attrs, value);
	  };
	};
	for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
	  type = _ref[_j];
	  _fn1(type);
	}

	exports.textarea = function(attrs, value) {
	  var component;
	  if (isAttrs(attrs)) {
	    if (value != null) {
	      attrs = extend({
	        value: value
	      }, attrs);
	      component = tag('textarea', attrs);
	      if (value.isDuplex) {
	        component.bind('onchange', (function(event, comp) {
	          return value(this.value);
	        }), 'before');
	      }
	    } else {
	      component = tag('textarea', attrs);
	    }
	  } else {
	    if (attrs != null) {
	      component = tag('textarea', {
	        value: attrs
	      });
	      if (attrs.isDuplex) {
	        component.bind('onchange', (function(event, comp) {
	          return attrs(this.value);
	        }), 'before');
	      }
	    } else {
	      component = tag('textarea');
	    }
	  }
	  return component;
	};


/***/ }
/******/ ])
});
;