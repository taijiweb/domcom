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
/***/ function(module, exports, __webpack_require__) {

	var dc, extend;

	module.exports = dc = __webpack_require__(4);

	if (typeof window !== 'undefined') {
	  window.dc = dc;
	}

	dc.DomNode = __webpack_require__(5);

	dc.extend = extend = __webpack_require__(9);

	extend(dc, __webpack_require__(7), __webpack_require__(2), __webpack_require__(1), __webpack_require__(6), __webpack_require__(3), __webpack_require__(10), __webpack_require__(44));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var ListWatchMixin, ObjectWatchMixin, flow, isArray, isEachObjectSystemKey, react, slice, watchList, watchObject,
	  __slice = [].slice;

	react = (flow = __webpack_require__(2)).react;

	isArray = __webpack_require__(3).isArray;

	module.exports = flow;

	slice = Array.prototype.slice;

	flow.watchList = watchList = function(listItems, listComponent) {
	  var watchingListComponents;
	  watchingListComponents = listItems.watchingListComponents || (listItems.watchingListComponents = {});
	  watchingListComponents[listComponent.dcid] = listComponent;
	  if (listItems.eachWatching) {
	    return;
	  }
	  listItems.eachWatching = true;
	  listItems._shift = listItems.shift;
	  listItems._pop = listItems.pop;
	  listItems._push = listItems.push;
	  listItems._reverse = listItems.reverse;
	  listItems._sort = listItems.sort;
	  listItems._splice = listItems.splice;
	  listItems._unshift = listItems.unshift;
	  listItems.shift = ListWatchMixin.shift;
	  listItems.pop = ListWatchMixin.pop;
	  listItems.push = ListWatchMixin.push;
	  listItems.reverse = ListWatchMixin.reverse;
	  listItems.sort = ListWatchMixin.sort;
	  listItems.splice = ListWatchMixin.splice;
	  listItems.unshift = ListWatchMixin.unshift;
	  listItems.setItem = ListWatchMixin.setItem;
	  listItems.setLength = ListWatchMixin.setLength;
	  listItems.updateComponents = ListWatchMixin.updateComponents;
	  listItems.updateComponent = ListWatchMixin.updateComponent;
	  return listItems.getListChildren = ListWatchMixin.getListChildren;
	};

	ListWatchMixin = {};

	ListWatchMixin.getListChildren = function(listComponent, start, stop) {
	  var children, i, itemComponent;
	  children = [];
	  i = start;
	  while (i < stop) {
	    itemComponent = listComponent.getItemComponent(this[i], start + i);
	    itemComponent.valid = true;
	    children.push(itemComponent);
	    i++;
	  }
	  return children;
	};

	ListWatchMixin.updateComponent = function(listComponent, start, stop) {
	  var children;
	  children = this.getListChildren(listComponent, start, stop);
	  listComponent.setChildren.apply(listComponent, [start].concat(__slice.call(children)));
	  return this;
	};

	ListWatchMixin.updateComponents = function(start, stop) {
	  var listComponent, watchingListComponents, _;
	  watchingListComponents = this.watchingListComponents;
	  for (_ in watchingListComponents) {
	    listComponent = watchingListComponents[_];
	    this.updateComponent(listComponent, start, stop);
	  }
	  return this;
	};

	ListWatchMixin.setItem = function() {
	  var i, start, value, values, _i, _len;
	  start = arguments[0], values = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  start = start >>> 0;
	  if (start < 0) {
	    start = 0;
	  }
	  for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
	    value = values[i];
	    this[start + i] = values[i];
	  }
	  this.updateComponents(start, start + values.length);
	  return this;
	};

	ListWatchMixin.pop = function() {
	  var listComponent, result, watchingListComponents, _;
	  if (!this.length) {

	  } else {
	    watchingListComponents = this.watchingListComponents;
	    result = this._pop();
	    for (_ in watchingListComponents) {
	      listComponent = watchingListComponents[_];
	      listComponent.popChild();
	    }
	    return result;
	  }
	};

	ListWatchMixin.push = function() {
	  var args, child, length, listComponent, result, watchingListComponents, _;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  watchingListComponents = this.watchingListComponents;
	  length = this.length;
	  result = this._push.apply(this, arguments);
	  for (_ in watchingListComponents) {
	    listComponent = watchingListComponents[_];
	    child = listComponent.getItemComponent(this[length], length);
	    listComponent.pushChild(child);
	  }
	  return result;
	};

	ListWatchMixin.shift = function() {
	  var args, length, listComponent, watchingListComponents, _;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (!this.length) {
	    return this;
	  } else {
	    watchingListComponents = this.watchingListComponents;
	    this._shift();
	    length = this.length;
	    for (_ in watchingListComponents) {
	      listComponent = watchingListComponents[_];
	      if (!listComponent.updateSuccChild) {
	        listComponent.shiftChild();
	      } else {
	        this.updateComponent(listComponent, length);
	      }
	    }
	    return this;
	  }
	};

	ListWatchMixin.unshift = function(child) {
	  var listComponent, watchingListComponents, _, _results;
	  this._unshift(child);
	  watchingListComponents = this.watchingListComponents;
	  _results = [];
	  for (_ in watchingListComponents) {
	    listComponent = watchingListComponents[_];
	    if (!listComponent.updateSuccChild) {
	      child = listComponent.getItemComponent(this[0], 0);
	      _results.push(listComponent.unshiftChild(child));
	    } else {
	      _results.push(this.updateComponent(listComponent, this.length));
	    }
	  }
	  return _results;
	};

	ListWatchMixin.reverse = function() {
	  var listLength;
	  listLength = this.length;
	  if (listLength <= 1) {
	    return this;
	  } else {
	    this._reverse();
	    return this.updateComponents(0, listLength);
	  }
	};

	ListWatchMixin.sort = function() {
	  var listLength;
	  listLength = this.length;
	  if (listLength <= 1) {
	    return this;
	  } else {
	    this._sort();
	    return this.updateComponents(0, listLength);
	  }
	};

	ListWatchMixin.splice = function(start, deleteCount) {
	  var child, i, inserted, insertedLength, listComponent, newLength, oldListLength, result, _;
	  inserted = slice.call(arguments, 2);
	  insertedLength = inserted.length;
	  if (deleteCount === 0 && insertedLength === 0) {
	    return this;
	  } else {
	    oldListLength = this.length;
	    start = start >>> 0;
	    if (start < 0) {
	      start = 0;
	    } else if (start > oldListLength) {
	      start = oldListLength;
	    }
	    result = this._splice.apply(this, [start, deleteCount].concat(inserted));
	    newLength = result.length;
	    if (newLength === oldListLength) {
	      this.updateComponents(start, start + insertedLength);
	    } else {
	      for (_ in watchingListComponents) {
	        listComponent = watchingListComponents[_];
	        if (!listComponent.updateSuccChild) {
	          if (insertedLength > deleteCount) {
	            i = start;
	            while (i < deleteCount) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.replaceChild(i, child);
	              i++;
	            }
	            while (i < insertedLength) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.insertChild(i, child);
	              i++;
	            }
	          } else {
	            i = start;
	            while (i < insertedLength) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.replaceChild(i, child);
	              i++;
	            }
	            while (i < deleteCount) {
	              listComponent.removeChild(start + insertedLength);
	              i++;
	            }
	          }
	        } else {
	          this.updateComponent(listComponent, start, newLength);
	        }
	      }
	    }
	    return result;
	  }
	};

	ListWatchMixin.setLength = function(length) {
	  var listComponent, oldListLength, watchingListComponents, _;
	  oldListLength = this.length;
	  if (length === oldListLength) {
	    return this;
	  } else if (length <= oldListLength) {
	    watchingListComponents = this.watchingListComponents;
	    this.length = length;
	    for (_ in watchingListComponents) {
	      listComponent = watchingListComponents[_];
	      listComponent.setLength(length);
	    }
	    return this;
	  } else {
	    this.updateComponents(oldListLength, length);
	    return this;
	  }
	};

	flow.watchObject = watchObject = function(objectItems, listComponent, itemFn) {
	  var watchingListComponents;
	  watchingListComponents = objectItems.watchingListComponents || (objectItems.watchingListComponents = {});
	  watchingListComponents[listComponent.dcid] = listComponent;
	  if (objectItems.eachWatching) {
	    return;
	  }
	  objectItems.eachWatching = true;
	  objectItems.deleteItem = ObjectWatchMixin.deleteItem;
	  objectItems.setItem = ObjectWatchMixin.setItem;
	  return objectItems.extendItems = ObjectWatchMixin.extendItems;
	};

	ObjectWatchMixin = {};

	ObjectWatchMixin.deleteItem = function() {
	  var children, i, index, key, keyChildMap, keys, length, listComponent, newChild, oldChild, watchingListComponents, _, _i, _len;
	  keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  watchingListComponents = this.watchingListComponents;
	  if (!watchingListComponents.length) {
	    return this;
	  }
	  for (_i = 0, _len = keys.length; _i < _len; _i++) {
	    key = keys[_i];
	    if (this.hasOwnProperty(key)) {
	      if (key.slice(0, 3) === '$dc') {
	        throw new Error('do not remove the key: ' + key + ', which is used by "each component" of dc');
	      }
	      delete this[key];
	      for (_ in watchingListComponents) {
	        listComponent = watchingListComponents[_];
	        keyChildMap = listComponent.keyChildMap;
	        index = keyChildMap[key];
	        children = listComponent.children;
	        length = children.length;
	        break;
	      }
	      for (_ in watchingListComponents) {
	        listComponent = watchingListComponents[_];
	        if (!listComponent.updateSuccChild) {
	          listComponent.removeChild(index);
	        } else {
	          i = index + 1;
	          children = listComponent.children;
	          while (i < length) {
	            oldChild = children[i];
	            newChild = listComponent.getItemComponent(oldChild.$watchingKey, i, this, listComponent);
	            listComponent.replaceChild(oldChild, newChild);
	            i++;
	          }
	          listComponent.removeChild(index);
	        }
	        delete keyChildMap[key];
	      }
	    }
	  }
	  return this;
	};

	ObjectWatchMixin.setItem = function(key, value) {
	  var length, listComponent, newChild, oldChildIndex, watchingListComponents, _;
	  if (isEachObjectSystemKey(key)) {
	    throw new Error('do not use the key: ' + key + ', which is used by "each component" of dc');
	  }
	  watchingListComponents = this.watchingListComponents;
	  if (this.hasOwnProperty(key)) {
	    this[key] = value;
	    for (_ in watchingListComponents) {
	      listComponent = watchingListComponents[_];
	      oldChildIndex = listComponent.keyChildMap[key];
	      newChild = listComponent.getItemComponent(key, oldChildIndex, this, listComponent);
	      listComponent.replaceChild(oldChild, newChild);
	    }
	  } else {
	    length = listComponent.children.length;
	    for (_ in watchingListComponents) {
	      listComponent = watchingListComponents[_];
	      newChild = listComponent.getItemComponent(key, length, this, listComponent);
	      listComponent.pushChild(newChild);
	    }
	  }
	  return this;
	};

	ObjectWatchMixin.extendItems = function(obj) {
	  var key, value;
	  for (key in obj) {
	    value = obj[key];
	    this.setItem(key, value);
	  }
	  return this;
	};

	flow.isEachObjectSystemKey = isEachObjectSystemKey = function(key) {
	  return /setItem|deleteItem|extendItems|watchingListComponents|eachWatching/.test(key);
	};

	flow.watchItems = function(items, listComponent) {
	  if (!items) {
	    throw new Error('items to be watched should be an array or object.');
	  }
	  if (isArray(items)) {
	    watchList(items, listComponent);
	  } else {
	    watchObject(items, listComponent);
	  }
	  return listComponent;
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
	    if (typeof callback !== 'function') {
	      throw new Error("call back should be a function");
	    }
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
	    if (!method.valid) {
	      return;
	    }
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
	    var value;
	    if (!arguments.length) {
	      value = computation();
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
	  if (!deps.length) {
	    return react(computation);
	  }
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
	  reactive = react(function(value) {
	    if (!arguments.length) {
	      if (!reactive.valid) {
	        reactive.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      if (value === cacheValue) {
	        return value;
	      } else {
	        cacheValue = computation(value);
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
	        var args, _k, _len1;
	        if (argumnets.length) {
	          throw new Error("flow.pipe is not allow to have arguments");
	        }
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
	            set(value);
	          }
	          getter.invalidate();
	          return getter.cacheValue = value;
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
	            set(value);
	          }
	          get && get.invalidate && get.invalidate();
	          method.invalidate();
	          return method.cacheValue = value;
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
/* 3 */
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var DomNode, addEventListener, addRenderUpdate, addSetIntervalUpdate, dc, dcid, dcidIndexMap, directiveRegistry, domNodeCache, isComponent, isElement, isEven, newDcid, nextNodes, parentNodes, querySelector, raf, readyFnList, refreshComponents, removeComponents, render, renderCallbackList, renderLoop, requestAnimationFrame, _ref, _ref1, _ref2, _renderComponentWhenBy;

	DomNode = __webpack_require__(5);

	_ref = __webpack_require__(6), requestAnimationFrame = _ref.requestAnimationFrame, raf = _ref.raf, isElement = _ref.isElement, addEventListener = _ref.addEventListener;

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

	if (typeof window !== 'undefined') {
	  window.dcid = newDcid();
	  dcid = document.dcid = newDcid();
	  window.$document = dc.$document = domNodeCache[dcid] = new DomNode(document);
	}

	dc.onReady = function(callback) {
	  return readyFnList.push(callback);
	};

	dc.offReady = function(callback) {
	  return readyFnList.indexOf(callback) >= 0 && readyFnList.splice(index, 1);
	};

	dc.ready = function() {
	  var callback, e, _i, _len;
	  for (_i = 0, _len = readyFnList.length; _i < _len; _i++) {
	    callback = readyFnList[_i];
	    try {
	      callback();
	    } catch (_error) {
	      e = _error;
	      dc.onerror(e);
	    }
	  }
	};

	if (typeof window !== 'undefined') {
	  document.addEventListener('DOMContentLoaded', dc.ready, false);
	  addEventListener(document, 'DOMContentLoaded', function() {
	    dcid = document.body.dcid = newDcid();
	    return window.$body = dc.$body = domNodeCache[dcid] = new DomNode(document.body);
	  });
	}

	dc.render = render = function() {
	  var callback, e, _i, _len;
	  for (_i = 0, _len = renderCallbackList.length; _i < _len; _i++) {
	    callback = renderCallbackList[_i];
	    try {
	      callback();
	    } catch (_error) {
	      e = _error;
	      dc.onerror(e);
	    }
	  }
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
	          _renderComponentWhenBy(component, event, updateList);
	        }
	      }
	    } else {
	      for (_k = 0, _len2 = components.length; _k < _len2; _k++) {
	        component = components[_k];
	        _renderComponentWhenBy(component, events, updateList);
	      }
	    }
	  } else if (components === setInterval) {
	    if (isComponent(events)) {
	      addSetIntervalUpdate(events, updateList);
	    } else if (events instanceof Array) {
	      for (_l = 0, _len3 = events.length; _l < _len3; _l++) {
	        component = events[_l];
	        addSetIntervalUpdate(events, updateList);
	      }
	    } else if (typeof events === 'number') {
	      options = options || {};
	      options.interval = events;
	      addSetIntervalUpdate(updateList, options);
	    }
	  } else if (components === render) {
	    if (isComponent(events)) {
	      addRafUpdate(events, updateList);
	    } else if (events instanceof Array) {
	      for (_m = 0, _len4 = events.length; _m < _len4; _m++) {
	        component = events[_m];
	        addRafUpdate(events, updateList);
	      }
	    }
	  } else if (events instanceof Array) {
	    if (!(updateList instanceof Array)) {
	      updateList = [updateList];
	    }
	    for (_n = 0, _len5 = events.length; _n < _len5; _n++) {
	      event = events[_n];
	      _renderComponentWhenBy(components, event, updateList);
	    }
	  } else {
	    if (!(updateList instanceof Array)) {
	      updateList = [updateList];
	    }
	    _renderComponentWhenBy(components, events, updateList);
	  }
	};

	_renderComponentWhenBy = function(component, event, updateList, options) {
	  var comp, i, item, _i, _len;
	  if (event.slice(0, 2) !== 'on') {
	    event = 'on' + event;
	  }
	  if (options) {
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
	      updateList[i] = isComponent(item) ? [item, {}] : item;
	    }
	    component.eventUpdateConfig[event] = updateList;
	  }
	};

	addSetIntervalUpdate = function(component, options) {
	  var callback, clear, handler, interval, test;
	  handler = null;
	  test = options.test, interval = options.interval, clear = options.clear;
	  callback = function() {
	    if (!test || test()) {
	      dc.update();
	    }
	    if (clear && clear()) {
	      return clearInterval(handler);
	    }
	  };
	  return handler = setInterval(callback, interval || 16);
	};

	addRenderUpdate = function(component, options) {
	  var callback, clear, test;
	  test = options.test, clear = options.clear;
	  callback = function() {
	    if (!test || test()) {
	      dc.update();
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

	dc.dcidIndexMap = dcidIndexMap = {};

	dc.parentNodes = parentNodes = [];

	dc.nextNodes = nextNodes = [];

	dc.listIndex = 0;

	dc.getChildParentNode = function(child) {
	  return parentNodes[dcidIndexMap[child.dcid]];
	};

	dc.getChildNextNode = function(child) {
	  return this.nextNodes[dcidIndexMap[child.dcid]];
	};

	dc.renderingMap = {};

	dc.removingMap = {};

	dc.invalidate = function() {
	  return dc.valid = false;
	};

	dc.invalidateOffspring = function(offspring) {
	  dc.valid = false;
	  return dc.renderingMap[offspring.dcid] = [offspring, offspring.holder];
	};

	dc.refreshComponents = refreshComponents = function() {
	  var component, holder, renderingMap, _, _ref3;
	  this.valid = true;
	  renderingMap = this.oldRenderingMap = this.renderingMap;
	  this.renderingMap = {};
	  for (_ in renderingMap) {
	    _ref3 = renderingMap[_], component = _ref3[0], holder = _ref3[1];
	    holder.updateChildHolder(component);
	    component.renderDom(component.baseComponent);
	  }
	  this.valid = false;
	  return this;
	};

	dc.removeComponents = removeComponents = function() {
	  var removingMap;
	  removingMap = this.removingMap;
	  this.removingMap = {};
	  for (dcid in removingMap) {
	    removingMap[dcid].removeDom();
	  }
	  return this;
	};

	dc.update = function(force) {
	  if ((force || dc.alwaysUpdate) && !dc.valid) {
	    refreshComponents.call(this);
	    return removeComponents.call(this);
	  }
	};

	dc.updateChildHolder = function(component) {
	  if (component.holder !== this) {
	    component.invalidate();
	    component.holder = this;
	    component.setParentNode(this.getChildParentNode(component));
	    component.sinkNextNode(this.getChildNextNode(component));
	  }
	};

	dc.raiseNode = function() {};

	dc.raiseFirstNextNode = function() {};

	dc.linkNextNode = function() {};

	dc.clear = function() {
	  dc.dcidIndexMap = dcidIndexMap = {};
	  dc.parentNodes = parentNodes = [];
	  dc.nextNodes = nextNodes = [];
	  dc.listIndex = 0;
	  dc.renderingMap = {};
	  return dc.removingMap = {};
	};

	dc.toString = function() {
	  return 'domcom';
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
	    var n, name, node, _i, _j, _len, _len1;
	    eventNames = eventNames.split(/\s+/);
	    node = this.node;
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      name = eventNames[_i];
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
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      name = eventNames[_i];
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

	if (typeof window !== 'undefined') {
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
	}

	exports.getBindProp = function(component) {
	  var tagName;
	  tagName = component.tagName;
	  if (!tagName) {
	    throw new Error('trying to bind a Component which is not a Tag');
	  } else if (tagName === 'textarea' || tagName === 'select') {
	    return 'value';
	  } else if (component.props.type === 'checkbox') {
	    return 'checked';
	  } else {
	    return 'value';
	  }
	};

	if (typeof window !== 'undefined') {
	  if (document.addEventListener) {
	    exports.addEventListener = function(node, name, handler) {
	      node.addEventListener(name, handler, false);
	    };
	    exports.removeEventListener = function(node, name, handler) {
	      node.removeEventListener(name, handler);
	    };
	  } else {
	    exports.addEventListener = function(node, name, handler) {
	      node.attachEvent(name, handler);
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
	}

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

	exports.extendChildFamily = function(family, child) {
	  var dcid;
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
	  return item && (item.renderDom != null);
	};


/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(9);

	module.exports = exports = extend({}, __webpack_require__(11), __webpack_require__(41), __webpack_require__(43), __webpack_require__(26));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var route;

	route = __webpack_require__(16);

	module.exports = {
	  isComponent: __webpack_require__(8),
	  toComponent: __webpack_require__(19),
	  toComponentList: __webpack_require__(23),
	  Component: __webpack_require__(14),
	  BaseComponent: __webpack_require__(13),
	  ListMixin: __webpack_require__(22),
	  List: __webpack_require__(21),
	  Tag: __webpack_require__(25),
	  Text: __webpack_require__(15),
	  Comment: __webpack_require__(31),
	  Cdata: __webpack_require__(12),
	  Html: __webpack_require__(32),
	  Nothing: __webpack_require__(20),
	  TransformComponentMixin: __webpack_require__(18),
	  TransformComponent: __webpack_require__(17),
	  TestComponent: __webpack_require__(33),
	  If: __webpack_require__(34),
	  Case: __webpack_require__(38),
	  Func: __webpack_require__(24),
	  Pick: __webpack_require__(39),
	  Defer: __webpack_require__(40),
	  Route: route.Route,
	  route: route
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Cdata, Text, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(13);

	Text = __webpack_require__(15);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(6).domValue;

	module.exports = Cdata = (function(_super) {
	  __extends(Cdata, _super);

	  function Cdata(text) {
	    Cdata.__super__.constructor.call(this, text);
	  }


	  /*
	    this operation is not supported in html document
	   */

	  Cdata.prototype.createDom = function(parentNode, nextNode) {
	    this.node = document.createCDATASection(domValue(this.text));
	    return this.node;
	  };

	  Cdata.prototype.updateDom = function(parentNode, nextNode) {
	    this.text && (this.node.data = domValue(this.text));
	    return this.node;
	  };

	  Cdata.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<CDATA " + (funcString(this.text)) + "/>", indent, addNewLine);
	  };

	  return Cdata;

	})(Text);


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Component, cloneObject, refreshComponents,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(14);

	cloneObject = __webpack_require__(3).cloneObject;

	refreshComponents = __webpack_require__(4).refreshComponents;

	module.exports = BaseComponent = (function(_super) {
	  __extends(BaseComponent, _super);

	  function BaseComponent() {
	    BaseComponent.__super__.constructor.call(this);
	    this.isBaseComponent = true;
	    this.removing = false;
	    this.baseComponent = this;
	  }

	  BaseComponent.prototype.invalidate = function() {
	    if (this.valid) {
	      this.valid = false;
	      return this.holder && this.holder.invalidateOffspring(this);
	    } else {
	      return this;
	    }
	  };

	  BaseComponent.prototype.invalidateOffspring = function(offspring) {
	    var holder;
	    holder = this.holder;
	    if (!holder) {
	      this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
	      this;
	    } else {
	      if (this.inWillRenderender) {
	        this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
	        offspring.renderingHolder = this;
	      } else if (holder === dc) {
	        dc.invalidateOffspring(offspring);
	      } else {
	        if (!holder.isBaseComponent) {
	          this.renderingMap[offspring.dcid] = [offspring, offspring.holder];
	          offspring.renderingHolder = this;
	          holder.invalidate();
	        } else {
	          holder.invalidateOffspring(offspring);
	        }
	      }
	    }
	    return this;
	  };

	  BaseComponent.prototype.markRemovingDom = function(removing) {
	    this.removing = removing;
	    if (removing) {
	      if (this.node && this.node.parentNode) {
	        dc.valid = false;
	        dc.removingMap[this.dcid] = this;
	        if (this.renderHolder) {
	          this.renerHolder = null;
	          delete this.renderHolder.renderingMap[this.dcid];
	        }
	        delete dc.renderingMap[this.dcid];
	        delete dc.oldRenderingMap[this.dcid];
	      }
	      this.holder = null;
	    }
	    return this;
	  };

	  BaseComponent.prototype.updateBaseComponent = function() {
	    return this;
	  };

	  BaseComponent.prototype.renderContent = function(oldBaseComponent) {
	    var holder;
	    this.renderDom(oldBaseComponent);
	    if (holder = this.holder) {
	      holder.raiseNode(this);
	      return holder.raiseFirstNextNode(this);
	    }
	  };

	  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
	    this.rendering = true;
	    this.inWillRenderender = true;
	    this.emit('willRender');
	    this.inWillRenderender = false;
	    if (oldBaseComponent && oldBaseComponent !== this) {
	      oldBaseComponent.markRemovingDom(true);
	    }
	    if (!this.node) {
	      this.valid = true;
	      this.renderingMap = {};
	      this.createDom();
	    } else {
	      this.refreshDom();
	    }
	    this.attachNode(this.parentNode, this.nextNode);
	    this.rendering = false;
	    this.emit('didRender');
	    return this;
	  };

	  BaseComponent.prototype.removeDom = function() {
	    if (this.removing && this.attached) {
	      this.removing = false;
	      this.emit('willDetach');
	      this.removeNode();
	      this.emit('didDetach');
	      this.attached = false;
	    }
	    return this;
	  };

	  BaseComponent.prototype.removeNode = function() {
	    var component, holder, nextNode, node, prevNode;
	    node = this.node;
	    prevNode = node.previousSibling;
	    nextNode = node.nextSibling;
	    node.parentNode.removeChild(node);
	    if (prevNode && (component = prevNode.component)) {
	      component.nextNode = nextNode;
	      if (holder = component.holder) {
	        holder.linkNextNode(component);
	      }
	    }
	  };

	  BaseComponent.prototype.attachNode = function() {
	    var attached, e, holder, nextNode, node, parentNode;
	    if (!(attached = this.attached)) {
	      this.attached = true;
	      this.emit('willAttach');
	    }
	    this.removing = false;
	    node = this.node;
	    parentNode = this.parentNode;
	    nextNode = this.nextNode;
	    if (parentNode !== node.parentNode || nextNode !== node.nextSibling) {
	      node = this.node;
	      try {
	        parentNode.insertBefore(node, nextNode);
	      } catch (_error) {
	        e = _error;
	        dc.error(e);
	      }
	    }
	    if (holder = this.holder) {
	      holder.raiseNode(this);
	      holder.raiseFirstNextNode(this);
	    }
	    if (!attached) {
	      this.emit('didAttach');
	    }
	    return node;
	  };

	  BaseComponent.prototype.setParentNode = function(parentNode) {
	    this.parentNode = parentNode;
	  };

	  BaseComponent.prototype.sinkNextNode = function(nextNode) {
	    if (nextNode !== this.nextNode) {
	      return this.nextNode = nextNode;
	    }
	  };

	  BaseComponent.prototype.getPrevChainComponentOf = function(child) {
	    throw new Error('Atomic BaseComponent should not has child component.');
	  };

	  return BaseComponent;

	})(Component);


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Component, dc, extend, isComponent, newDcid, normalizeDomElement,
	  __slice = [].slice;

	extend = __webpack_require__(9);

	normalizeDomElement = __webpack_require__(6).normalizeDomElement;

	newDcid = __webpack_require__(3).newDcid;

	isComponent = __webpack_require__(8);

	dc = __webpack_require__(4);

	module.exports = Component = (function() {
	  function Component() {
	    this.listeners = this.listeners || {};
	    this.baseComponent = null;
	    this.parentNode = null;
	    this.nextNode = null;
	    this.node = null;
	    this.attached = false;
	    this.destroyed = false;
	    this.holder = null;
	    this.dcid = newDcid();
	    this.valid = true;
	  }

	  Component.prototype.on = function(event, callback) {
	    var callbacks, eventName, listeners, _i, _len, _ref;
	    if (!arguments.length) {
	      dc.error('missing arguments for Component.on(event, callback)');
	    }
	    if (arguments.length === 1) {
	      if (!event || typeof event !== 'object') {
	        dc.error('wrong arguments for Component.on(event, callback)');
	      } else {
	        for (eventName in event) {
	          callback = event[eventName];
	          this.on(eventName, callback);
	        }
	      }
	    } else {
	      if (!(listeners = this.listeners)) {
	        this.listeners = listeners = {};
	      }
	      _ref = event.split(/\s*,\s*|\s+/);
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        event = _ref[_i];
	        if (callbacks = listeners[event]) {
	          if (callbacks.indexOf(callback) < 0) {
	            callbacks.push(callback);
	          }
	        } else {
	          listeners[event] = [callback];
	        }
	      }
	    }
	    return this;
	  };

	  Component.prototype.off = function(event, callback) {
	    var callbacks, listeners, _i, _j, _len, _len1, _ref, _ref1;
	    if (this.argmuents.length) {
	      dc.error('missing arguments for Component.off(event, callback)');
	    } else if (arguments.length === 1) {
	      listeners = this.listeners;
	      _ref = event.split(/\s*,\s*|\s+/);
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        event = _ref[_i];
	        listeners[event] = null;
	      }
	    } else {
	      listeners = this.listeners;
	      _ref1 = event.split(/\s*,\s*|\s+/);
	      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	        event = _ref1[_j];
	        callbacks = listeners[event];
	        if (callbacks && callbacks.indexOf(callback) >= 0) {
	          callbacks.splice(index, 1);
	          if (!callbacks.length) {
	            listeners[event] = null;
	          }
	        }
	      }
	    }
	    return this;
	  };

	  Component.prototype.emit = function() {
	    var args, callback, callbacks, event, method, _i, _len;
	    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    if (this.destroyed) {
	      return this;
	    }
	    if (callbacks = this.listeners[event]) {
	      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
	        callback = callbacks[_i];
	        callback.apply(this, args);
	      }
	    } else {
	      if (method = this[event]) {
	        method.apply(this, args);
	      }
	    }
	    return this;
	  };


	  /* if mountNode is given, it should not be the node of any Component
	  only use beforeNode if mountNode is given
	   */

	  Component.prototype.create = function(mountNode, beforeNode, force) {
	    var listIndex;
	    if (mountNode && mountNode.component) {
	      mountNode = mountNode.component;
	    } else if (beforeNode && beforeNode.component) {
	      console.log(mountNode);
	      console.log(beforeNode);
	      throw new Error('error while mounting: mountNode is not a component, but beforeNode is a component');
	    }
	    if (isComponent(mountNode)) {
	      if (!beforeNode) {
	        if (!mountNode.children) {
	          console.log(mountNode);
	          throw new Error('error while mounting: mountNode is a component, but is not a Tag or List component');
	        }
	        mountNode.pushChild(this);
	      } else {
	        if (!isComponent(beforeNode)) {
	          beforeNode = beforeNode.component;
	          if (!beforeNode) {
	            console.log(beforeNode);
	            throw new Error('error while mounting: can not mount beforeNode');
	          }
	        }
	        if (beforeNode.holder !== mountNode || !mountNode.children) {
	          console.log(mountNode);
	          console.log(beforeNode);
	          throw new Error('both mountNode and beforeNode is component, but mountNode is not the parent of beforeNode');
	        }
	        this.emit('willMount');
	        mountNode.insertChildBefore(this, beforeNode);
	      }
	    } else {
	      this.emit('willMount');
	      this.holder = dc;
	      dc.dcidIndexMap[this.dcid] = listIndex = dc.listIndex;
	      dc.invalidateOffspring(this);
	      dc.parentNodes[listIndex] = this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body;
	      dc.nextNodes[listIndex] = this.nextNode = beforeNode;
	      dc.listIndex++;
	    }
	    dc.update(force);
	    return this;
	  };

	  Component.prototype.mount = function(mountNode, beforeNode) {
	    this.emit('willMount');
	    this.create(mountNode, beforeNode, true);
	    return this.emit('didMount');
	  };

	  Component.prototype.unmount = function() {
	    this.emit('willUnmount');
	    this.remove(true);
	    this.emit('didUnmount');
	    return this;
	  };

	  Component.prototype.remove = function(force) {
	    var component, holder;
	    holder = this.holder;
	    if (holder === dc) {
	      this.markRemovingDom(true);
	    } else {
	      component = this;
	      while (holder && holder !== dc && !holder.isBaseComponent) {
	        component = holder;
	        holder = holder.holder;
	      }
	      if (!holder) {
	        return this;
	      } else if (holder.children) {
	        holder.removeChild(component);
	      } else if (holder !== dc) {
	        dc.error('Should not remove the content of TransformComponent');
	      }
	    }
	    return dc.update(force);
	  };

	  Component.prototype.replace = function(oldComponent, force) {
	    var holder;
	    if (this.destroyed || this === oldComponent) {
	      return;
	    }
	    holder = oldComponent.holder;
	    if (holder !== dc) {
	      if (holder.isTransformComponent) {
	        dc.error('Should not replace the content of TransformComponent');
	      } else {
	        holder.replaceChild(oldComponent, this);
	      }
	    } else {
	      this.setParentNode(oldComponent.parentNode);
	      this.sinkNextNode(oldComponent.nextNode);
	      oldComponent.markRemovingDom(true);
	      this.holder = holder;
	      this.invalidate();
	    }
	    dc.update(force);
	    return this;
	  };

	  Component.prototype.destroy = function() {
	    this.destroyed = true;
	    this.remove();
	    this.listeners = null;
	    if (this.node) {
	      this.node.component = null;
	      this.node = null;
	    }
	    this.baseComponent = null;
	    return this.parentNode = null;
	  };


	  /*
	  component.updateWhen components, events
	  component.updateWhen setInterval, interval, options
	  component.updateWhen dc.raf, options
	   */

	  Component.prototype.updateWhen = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    if (args[0] === setInterval) {
	      if (args[1] === 'number') {
	        dc.updateWhen(setInterval, args[1], [this], args[2]);
	      } else {
	        dc.updateWhen(setInterval, [this], args[1]);
	      }
	    } else if (args[1] === dc.raf) {
	      dc.updateWhen(dc.raf, [this], args[1]);
	    } else {
	      dc.updateWhen(args[0], args[1], [this]);
	    }
	    return this;
	  };

	  Component.prototype.raiseNode = function(child) {
	    var e, holder, node;
	    node = child.node;
	    if (this.children) {
	      try {
	        return this.childNodes[this.dcidIndexMap[child.dcid]] = node;
	      } catch (_error) {
	        e = _error;
	        throw e;
	      }
	    } else {
	      this.node = node;
	      if (holder = this.holder) {
	        return holder.raiseNode(this);
	      }
	    }
	  };

	  Component.prototype.raiseFirstNextNode = function(child) {
	    var children, firstNode, index, node;
	    children = this.children;
	    firstNode = child.firstNode;
	    if (children) {
	      index = this.dcidIndexMap[child.dcid];
	      while (index) {
	        index--;
	        node = firstNode || child.nextNode;
	        this.nextNodes[index] = children[index].nextNode = node;
	        child = children[index];
	        firstNode = child.firstNode;
	      }
	      if (!index && this.isList) {
	        if (this.firstNode !== firstNode) {
	          this.firstNode = firstNode;
	          return this.holder.raiseFirstNextNode(this);
	        }
	      }
	    } else {
	      if (this.firstNode !== firstNode) {
	        this.firstNode = firstNode;
	        return this.holder.raiseFirstNextNode(this);
	      }
	    }
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

	var BaseComponent, Text, domField, domValue, dynamic, exports, funcString, hasTextContent, newLine, value, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(13);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

	_ref1 = __webpack_require__(6), domField = _ref1.domField, domValue = _ref1.domValue;

	if ('textContent' in document.documentElement) {
	  hasTextContent = true;
	} else {
	  hasTextContent = false;
	}

	exports = module.exports = Text = (function(_super) {
	  __extends(Text, _super);

	  function Text(text) {
	    var me;
	    Text.__super__.constructor.call(this);
	    this.text = text = domField(text);
	    me = this;
	    if (typeof text === 'function') {
	      text.onInvalidate(function() {
	        me.textValid = false;
	        return me.invalidate();
	      });
	    }
	    this.isText = true;
	    this.family = {};
	    this.family[this.dcid] = true;
	    this;
	  }

	  Text.prototype.invalidateOffspring = function(offspring) {
	    var holder;
	    holder = this.holder;
	    if (!holder) {
	      this;
	    } else {
	      if (holder === dc) {
	        dc.invalidateOffspring(offspring);
	      } else {
	        if (holder.isBaseComponent) {
	          holder.invalidateOffspring(offspring);
	        } else {
	          holder.invalidate();
	        }
	      }
	    }
	    return this;
	  };

	  Text.prototype.createDom = function() {
	    var node, text;
	    this.textValid = true;
	    text = domValue(this.text);
	    node = document.createTextNode(text);
	    node.component = this;
	    this.node = node;
	    this.firstNode = node;
	    this.cacheText = text;
	    return node;
	  };

	  Text.prototype.refreshDom = function() {
	    var node, text;
	    this.valid = true;
	    node = this.node;
	    if (this.textValid) {
	      return node;
	    } else {
	      this.textValid = true;
	      text = domValue(this.text);
	      if (text !== this.cacheText) {
	        if (hasTextContent) {
	          node.textContent = text;
	        } else {
	          node.innerText = text;
	        }
	        this.cacheText = text;
	      }
	      return node;
	    }
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


/***/ },
/* 16 */
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

	TransformComponent = __webpack_require__(17);

	isComponent = __webpack_require__(8);

	toComponent = __webpack_require__(19);

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
	    Route.__super__.constructor.call(this);
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Component, TransformComponent, TransformComponentMixin, extend,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	extend = __webpack_require__(9);

	Component = __webpack_require__(14);

	TransformComponentMixin = __webpack_require__(18);

	module.exports = TransformComponent = (function(_super) {
	  __extends(TransformComponent, _super);

	  function TransformComponent() {
	    TransformComponent.__super__.constructor.apply(this, arguments);
	    this.initTransformComponent();
	  }

	  return TransformComponent;

	})(Component);

	extend(TransformComponent.prototype, TransformComponentMixin);


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
	  initTransformComponent: function() {
	    this.transformValid = false;
	    return this.isTransformComponent = true;
	  },
	  invalidate: function() {
	    return this.invalidateOffspring(this);
	  },
	  invalidateOffspring: function(offspring) {
	    if (this.valid) {
	      this.valid = false;
	      if (this.holder) {
	        this.holder.invalidateOffspring(this);
	      }
	    }
	    return this;
	  },
	  invalidateTransform: function() {
	    this.transformValid = false;
	    return this.invalidate();
	  },
	  markRemovingDom: function(removing) {
	    if (this.baseComponent) {
	      this.baseComponent.markRemovingDom(removing);
	    }
	    this.holder = null;
	    return this;
	  },
	  updateBaseComponent: function() {
	    var content;
	    if (!this.transformValid) {
	      this.transformValid = true;
	      this.content = content = this.getContentComponent();
	      if (content !== this) {
	        content.holder = this;
	        content.parentNode = this.parentNode;
	        content.nextNode = this.nextNode;
	        this.baseComponent = content.updateBaseComponent();
	      }
	    }
	    return this.baseComponent;
	  },
	  renderDom: function(oldBaseComponent) {
	    this.rendering = true;
	    this.emit('willRender');
	    if (this.node && this.valid && oldBaseComponent === this.baseComponent) {
	      this.baseComponent.attachNode();
	    } else {
	      this.valid = true;
	      this.updateBaseComponent();
	      this.renderContent(oldBaseComponent);
	    }
	    this.rendering = false;
	    this.emit('didRender');
	    return this;
	  },
	  renderContent: function(oldBaseComponent) {
	    return this.baseComponent.renderDom(oldBaseComponent);
	  },
	  getChildParentNode: function(child) {
	    return this.parentNode;
	  },
	  setParentNode: function(parentNode) {
	    if (this.parentNode !== parentNode) {
	      this.parentNode = parentNode;
	      this.content && this.content.setParentNode(parentNode);
	    }
	  },
	  linkNextNode: function(child) {
	    var holder;
	    if (holder = this.holder) {
	      this.nextNode = child.nextNode;
	      return holder.linkNextNode(this);
	    }
	  },
	  sinkNextNode: function(nextNode) {
	    if (nextNode !== this.nextNode) {
	      this.nextNode = nextNode;
	      return this.content.sinkNextNode(nextNode);
	    }
	  }
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Nothing, Text, isComponent, react, toComponent;

	isComponent = __webpack_require__(8);

	Nothing = __webpack_require__(20);

	Text = __webpack_require__(15);

	react = __webpack_require__(2).react;

	module.exports = toComponent = function(item) {
	  var Func, List, component, e;
	  if (isComponent(item)) {
	    return item;
	  } else if (typeof item === 'function') {
	    return new Text(item);
	  } else if (item instanceof Array) {
	    List = __webpack_require__(21);
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
	    Func = __webpack_require__(24);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Nothing, newLine,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(13);

	newLine = __webpack_require__(3).newLine;

	module.exports = Nothing = (function(_super) {
	  __extends(Nothing, _super);

	  function Nothing() {
	    Nothing.__super__.constructor.apply(this, arguments);
	    this.firstNode = null;
	    this.family = {};
	    this.isNothing = true;
	    this.baseComponent = this;
	  }

	  Nothing.prototype.invalidateOffspring = function() {
	    return this;
	  };

	  Nothing.prototype.invalidate = function() {
	    return this;
	  };

	  Nothing.prototype.renderDom = function(oldBaseComponent) {
	    if (oldBaseComponent && oldBaseComponent !== this) {
	      oldBaseComponent.markRemovingDom(true);
	    }
	    this.valid = true;
	    if (!this.node) {
	      this.node = [];
	    }
	    this.attachNode();
	    return this;
	  };

	  Nothing.prototype.createDom = function() {
	    return this.node = [];
	  };

	  Nothing.prototype.refreshDom = function() {
	    this.valid = true;
	    return this.node;
	  };

	  Nothing.prototype.attachNode = function() {
	    var holder;
	    if (holder = this.holder) {
	      holder.raiseNode(this);
	      holder.raiseFirstNextNode(this);
	    }
	    return this.node;
	  };

	  Nothing.prototype.markRemovingDom = function(removing) {
	    this.removing = removing;
	    if (removing) {
	      this.holder = null;
	    }
	    return this;
	  };

	  Nothing.prototype.removeDom = function() {
	    return this;
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, ListMixin, ListMixinLinkNextNode, dc, exports, getFirstNodeFromArray, isArray, mixin, newLine, refreshComponents, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(13);

	_ref = __webpack_require__(3), newLine = _ref.newLine, isArray = _ref.isArray;

	refreshComponents = (dc = __webpack_require__(4)).refreshComponents;

	getFirstNodeFromArray = function(nodes) {
	  var node, _i, _len;
	  if (!nodes.length) {
	    return null;
	  } else {
	    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
	      node = nodes[_i];
	      if (!isArray(node) && node) {
	        return node;
	      } else if (node = getFirstNodeFromArray(node)) {
	        return node;
	      }
	    }
	    return null;
	  }
	};

	module.exports = exports = List = (function(_super) {
	  __extends(List, _super);

	  function List(children) {
	    List.__super__.constructor.call(this);
	    this.renderingMap = {};
	    this.removingMap = {};
	    this.initChildren(children);
	    this.isList = true;
	    return;
	  }

	  List.prototype.createDom = function() {
	    var children, length, nextNodes, node;
	    this.valid = true;
	    children = this.children;
	    nextNodes = this.nextNodes;
	    this.node = this.childNodes = node = [];
	    this.childParentNode = this.parentNode;
	    this.childNextNode = this.nextNode;
	    nextNodes.length = length = children.length;
	    if (length) {
	      nextNodes[length - 1] = this.nextNode;
	      this.createChildrenDom();
	    }
	    this.firstNode = this.childFirstNode;
	    return node;
	  };

	  List.prototype.getChildParentNode = function(child) {
	    return this.parentNode;
	  };

	  List.prototype.updateChildHolder = function(child, listIndex) {
	    if (child.holder !== this) {
	      if (child.holder && child.node) {
	        child.invalidate();
	      }
	      child.setParentNode(this.parentNode);
	      child.holder = this;
	    }
	  };

	  List.prototype.sinkNextNode = function(nextNode) {
	    var child, children, i, length, _results;
	    if (nextNode !== this.nextNode) {
	      this.nextNode = nextNode;
	      children = this.children;
	      length = children.length;
	      if (length) {
	        i = length - 1;
	        _results = [];
	        while (i >= 0) {
	          child = children[i];
	          child.sinkNextNode();
	          if (child.firstNode) {
	            break;
	          } else {
	            _results.push(i--);
	          }
	        }
	        return _results;
	      }
	    }
	  };

	  List.prototype.refreshDom = function() {
	    this.valid = true;
	    refreshComponents.call(this);
	    return this.node;
	  };

	  List.prototype.setParentNode = function(parentNode) {
	    var child, _i, _len, _ref1;
	    if (this.parentNode !== parentNode) {
	      this.parentNode = parentNode;
	      _ref1 = this.children;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        child = _ref1[_i];
	        child.setParentNode(parentNode);
	      }
	    }
	  };

	  List.prototype.markRemovingDom = function(removing) {
	    var child, node, _i, _len, _ref1;
	    this.removing = removing;
	    if (removing) {
	      if (this.renderHolder) {
	        this.renderHolder = null;
	        delete this.renderHolder.renderingMap[this.dcid];
	        delete this.oldRenderingMap[this.dcid];
	      }
	      delete dc.renderingMap[this.dcid];
	      delete dc.oldRenderingMap[this.dcid];
	      node = this.node;
	      if (node) {
	        if (node.parentNode) {
	          node.parentNode = null;
	          _ref1 = this.children;
	          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	            child = _ref1[_i];
	            child.markRemovingDom(removing);
	          }
	        }
	      }
	      this.holder = null;
	    }
	    return this;
	  };

	  List.prototype.removeDom = function() {
	    var child, _i, _len, _ref1;
	    if (this.removing && this.attached) {
	      this.removing = false;
	      this.attached = false;
	      this.emit('willDetach');
	      _ref1 = this.children;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        child = _ref1[_i];
	        child.removeDom();
	      }
	      this.emit('didDetach');
	    }
	    return this;
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

	  List.prototype.linkNextNode = function(child) {
	    var holder, i;
	    i = ListMixinLinkNextNode.call(this, child);
	    if (i === length) {
	      this.nextNode = child.nextNode;
	      if (holder = this.holder) {
	        holder.linkNextNode(this);
	      }
	    }
	  };

	  List.prototype.attachNode = function() {
	    var attached, baseComponent, child, children, holder, index, length, nextNode, node, parentNode;
	    children = this.children, parentNode = this.parentNode, nextNode = this.nextNode, node = this.node;
	    if (!(attached = this.attached)) {
	      this.attached = true;
	      this.emit('willAttach');
	    }
	    if (parentNode !== node.parentNode || nextNode !== node.nextSibling) {
	      node.parentNode = parentNode;
	      length = children.length;
	      if (length) {
	        index = length - 1;
	        children[index].nextNode = nextNode;
	        while (index >= 0) {
	          child = children[index];
	          if (child.holder && child.holder !== this.holder) {
	            child.invalidate();
	            child.holder = this.holder;
	          }
	          child.parentNode = parentNode;
	          baseComponent = child.baseComponent;
	          baseComponent.parentNode = parentNode;
	          baseComponent.nextNode = child.nextNode;
	          baseComponent.attachNode();
	          if (index) {
	            children[index - 1].nextNode = child.firstNode || child.nextNode;
	          }
	          index--;
	        }
	      }
	    }
	    if (holder = this.holder) {
	      holder.raiseNode(this);
	      holder.raiseFirstNextNode(this);
	    }
	    if (!attached) {
	      this.emit('didAttach');
	    }
	    return this.node;
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

	mixin = __webpack_require__(3).mixin;

	ListMixin = __webpack_require__(22);

	mixin(List.prototype, ListMixin);

	ListMixinLinkNextNode = ListMixin.linkNextNode;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Nothing, extendChildFamily, getChildNextNode, isArray, isComponent, substractSet, toComponent, toComponentList, updateChildHolder, updateDcidIndexMap, _ref, _ref1,
	  __slice = [].slice;

	_ref = __webpack_require__(3), isArray = _ref.isArray, substractSet = _ref.substractSet;

	isComponent = __webpack_require__(8);

	toComponent = __webpack_require__(19);

	toComponentList = __webpack_require__(23);

	Nothing = __webpack_require__(20);

	extendChildFamily = __webpack_require__(6).extendChildFamily;

	_ref1 = __webpack_require__(4), updateChildHolder = _ref1.updateChildHolder, getChildNextNode = _ref1.getChildNextNode;

	updateDcidIndexMap = function(dcidIndexMap, children, start) {
	  var i, length;
	  length = children.length;
	  i = start;
	  while (i < length) {
	    dcidIndexMap[children[i].dcid] = i;
	    i++;
	  }
	};

	module.exports = {
	  initChildren: function(children) {
	    var child, dcidIndexMap, family, i, nextNodes, _i, _len;
	    children = toComponentList(children);
	    this.dcidIndexMap = dcidIndexMap = {};
	    this.renderingMap = {};
	    this.removingMap = {};
	    this.nextNodes = nextNodes = [];
	    this.family = family = {};
	    family[this.dcid] = true;
	    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
	      child = children[i];
	      child = children[i];
	      child.holder = this;
	      extendChildFamily(family, child);
	      dcidIndexMap[child.dcid] = i;
	    }
	    return this.children = children;
	  },
	  getChildNextNode: getChildNextNode,
	  updateChildHolder: updateChildHolder,
	  linkNextNode: function(child) {
	    var children, i, length, nextNode, nextNodes;
	    nextNode = child.nextNode;
	    children = this.children;
	    nextNodes = this.nextNodes;
	    length = children.length;
	    i = this.dcidIndexMap[child.dcid];
	    nextNodes[i] = nextNode;
	    i++;
	    while (i < length) {
	      child = children[i];
	      if (!child.firstNode) {
	        child.sinkNextNode(nextNode);
	        nextNodes[i] = this.nextNodes;
	      }
	      i++;
	    }
	    return i;
	  },
	  createChildrenDom: function() {
	    var child, children, e, firstNode, i, nextNode, nextNodes, node;
	    nextNodes = this.nextNodes;
	    children = this.children;
	    node = this.childNodes;
	    node.nextSibling = nextNode = this.childNextNode;
	    node.parentNode = this.childParentNode;
	    i = children.length - 1;
	    nextNodes[i] = nextNode;
	    while (i >= 0) {
	      child = children[i];
	      child.parentNode = this.childParentNode;
	      child.nextNode = nextNode;
	      if (child.holder !== this) {
	        if (child.node) {
	          child.invalidate();
	        }
	        child.holder = this;
	      }
	      try {
	        child.renderDom(child.baseComponent);
	      } catch (_error) {
	        e = _error;
	        dc.onerror(e);
	      }
	      node[i] = child.node;
	      i--;
	      firstNode = child.firstNode;
	      if (i >= 0) {
	        nextNodes[i] = nextNode = firstNode || nextNode;
	      }
	    }
	    this.childFirstNode = firstNode;
	    return node;
	  },
	  insertChildBefore: function(child, refChild) {
	    return this.insertChild(refChild, child);
	  },
	  insertChildAfter: function(child, refChild) {
	    var children;
	    children = this.children;
	    if (isComponent(refChild)) {
	      refChild = children.indexOf(refChild);
	      if (refChild < 0) {
	        refChild = 0;
	      }
	    }
	    return this.insertChild(refChild + 1, child);
	  },
	  pushChild: function(child) {
	    return this.insertChild(this.children.length, child);
	  },
	  unshiftChild: function(child) {
	    return this.insertChild(0, child);
	  },
	  insertChild: function(refChild, child) {
	    var children, dcidIndexMap, index, length, nextNode;
	    children = this.children, dcidIndexMap = this.dcidIndexMap;
	    length = children.length;
	    if (isComponent(refChild)) {
	      index = dcidIndexMap[refChild.dcid];
	      if (index == null) {
	        index = length;
	      }
	    } else if (refChild > length) {
	      index = length;
	      refChild = null;
	    } else if (refChild < 0) {
	      index = 0;
	      refChild = null;
	    } else {
	      index = refChild;
	      refChild = children[index];
	    }
	    this.emit('onInsertChild', index, refChild, child);
	    extendChildFamily(this.family, child);
	    this.updateChildHolder(child);
	    if (!refChild) {
	      nextNode = this.nextNode;
	    } else {
	      nextNode = refChild.firstNode || refChild.nextNode;
	    }
	    child.sinkNextNode(nextNode);
	    child.invalidate();
	    dcidIndexMap[child.dcid] = index;
	    children.splice(index, 0, child);
	    if (this.childNodes) {
	      this.childNodes.splice(index, 0, null);
	    }
	    updateDcidIndexMap(dcidIndexMap, children, index + 1, 0);
	    return this;
	  },
	  removeChild: function(child) {
	    var children, dcidIndexMap, index;
	    if (child == null) {
	      dc.error('child to be removed is undefined');
	    }
	    children = this.children;
	    dcidIndexMap = this.dcidIndexMap;
	    if (isComponent(child)) {
	      index = dcidIndexMap[child.dcid];
	      if (index == null) {
	        dc.error('child to be removed is not in the children');
	      }
	    } else if (child >= children.length || child < 0) {
	      dc.error('child to be removed is out of bound');
	    } else {
	      index = child;
	      child = children[index];
	    }
	    delete dcidIndexMap[child.dcid];
	    children[index].markRemovingDom(true);
	    substractSet(this.family, child.family);
	    children.splice(index, 1);
	    if (this.childNodes) {
	      this.childNodes.splice(index, 1);
	    }
	    updateDcidIndexMap(dcidIndexMap, children, index);
	    return this;
	  },
	  shiftChild: function() {
	    var child, children, i;
	    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    children = [];
	    i = children.length(-1);
	    while (i >= 0) {
	      child = toComponent(children[i]);
	      this.insertChild(0, child);
	    }
	    return this;
	  },
	  unshiftChild: function() {
	    return this.removeChild(0);
	  },
	  popChild: function() {
	    var length;
	    length = this.children.length;
	    if (length) {
	      return this.removeChild(length - 1);
	    } else {
	      return this;
	    }
	  },
	  replaceChild: function(oldChild, newChild) {
	    var children, dcidIndexMap, index;
	    children = this.children, dcidIndexMap = this.dcidIndexMap;
	    if (isComponent(oldChild)) {
	      index = dcidIndexMap[oldChild.dcid];
	      if (index == null) {
	        dc.error('oldChild to be replaced is not in the children');
	      }
	      delete dcidIndexMap[oldChild.id];
	    } else {
	      if (oldChild >= children.length || oldChild < 0) {
	        dc.error('oldChild to be replaced is out of bound');
	      }
	      index = oldChild;
	      oldChild = children[index];
	    }
	    this.emit('onReplaceChild', index, oldChild, newChild);
	    newChild = toComponent(newChild);
	    if (oldChild === newChild) {
	      return this;
	    }
	    delete dcidIndexMap[oldChild.dcid];
	    children[index] = newChild;
	    dcidIndexMap[newChild.dcid] = index;
	    newChild.holder = this;
	    newChild.setParentNode(this.childParentNode);
	    newChild.sinkNextNode(oldChild.nextNode);
	    newChild.invalidate();
	    oldChild.markRemovingDom(true);
	    substractSet(this.family, oldChild.family);
	    extendChildFamily(this.family, newChild);
	    return this;
	  },
	  invalidateChildren: function(startIndex, stopIndex) {
	    var children;
	    if (stopIndex == null) {
	      stopIndex = startIndex + 1;
	    }
	    if (!this.node) {
	      return this;
	    }
	    children = this.children;
	    while (startIndex < stopIndex) {
	      children[startIndex].invalidate();
	      startIndex++;
	    }
	    return this;
	  },
	  setChildren: function() {
	    var child, children, i, n, newChildren, oldChildrenLength, startIndex, _i, _len;
	    startIndex = arguments[0], newChildren = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    children = this.children;
	    oldChildrenLength = children.length;
	    n = oldChildrenLength;
	    while (n < startIndex) {
	      this.pushChild(new Nothing());
	      n++;
	    }
	    for (i = _i = 0, _len = newChildren.length; _i < _len; i = ++_i) {
	      child = newChildren[i];
	      if (startIndex + i < oldChildrenLength) {
	        this.replaceChild(startIndex + i, newChildren[i]);
	      } else {
	        this.pushChild(newChildren[i]);
	      }
	    }
	    return this;
	  },
	  setLength: function(newLength) {
	    var last, length, n;
	    length = this.children.length;
	    if (newLength >= length) {
	      n = length;
	      while (n < newLength) {
	        this.pushChild(new Nothing());
	        n++;
	      }
	    } else {
	      last = length - 1;
	      while (last >= newLength) {
	        this.removeChild(last);
	        last--;
	      }
	    }
	    return this;
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var toComponent, toComponentList;

	toComponent = __webpack_require__(19);

	module.exports = toComponentList = function(item) {
	  var e, _i, _len, _results;
	  if (!item) {
	    return [];
	  } else if (item instanceof Array) {
	    _results = [];
	    for (_i = 0, _len = item.length; _i < _len; _i++) {
	      e = item[_i];
	      _results.push(toComponent(e));
	    }
	    return _results;
	  } else {
	    return [toComponent(item)];
	  }
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Func, TransformComponent, funcString, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(19);

	TransformComponent = __webpack_require__(17);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	renew = __webpack_require__(2).renew;

	module.exports = Func = (function(_super) {
	  __extends(Func, _super);

	  function Func(func) {
	    var me;
	    Func.__super__.constructor.call(this);
	    if (!func.invalidate) {
	      this.func = renew(func);
	    } else {
	      this.func = func;
	    }
	    me = this;
	    this.func.onInvalidate(function() {
	      return me.invalidateTransform();
	    });
	    this;
	  }

	  Func.prototype.getContentComponent = function() {
	    return toComponent(this.func());
	  };

	  Func.prototype.clone = function() {
	    var me;
	    me = this;
	    return (new Func((function() {
	      return toComponent(me.func()).clone();
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
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, ListMixin, Tag, attrToPropName, classFn, cloneObject, dc, directiveRegistry, domField, domValue, eventHandlerFromArray, extend, flow, funcString, mixin, newLine, react, refreshComponents, styleFrom, updating, _ref, _ref1, _ref2, _ref3,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __slice = [].slice;

	extend = __webpack_require__(9);

	refreshComponents = (dc = __webpack_require__(4)).refreshComponents;

	_ref = __webpack_require__(6), domField = _ref.domField, domValue = _ref.domValue;

	_ref1 = __webpack_require__(26), classFn = _ref1.classFn, styleFrom = _ref1.styleFrom, eventHandlerFromArray = _ref1.eventHandlerFromArray, attrToPropName = _ref1.attrToPropName, updating = _ref1.updating;

	BaseComponent = __webpack_require__(13);

	_ref2 = __webpack_require__(3), funcString = _ref2.funcString, newLine = _ref2.newLine, cloneObject = _ref2.cloneObject;

	directiveRegistry = __webpack_require__(7).directiveRegistry;

	_ref3 = __webpack_require__(2), flow = _ref3.flow, react = _ref3.react;

	module.exports = Tag = (function(_super) {
	  __extends(Tag, _super);

	  function Tag(tagName, attrs, children) {
	    if (attrs == null) {
	      attrs = {};
	    }
	    if (!(this instanceof Tag)) {
	      throw 'should use new SubclassComponent(...) with the subclass of Tag';
	    }
	    Tag.__super__.constructor.call(this);
	    this.initChildren(children);
	    this.isTag = true;
	    tagName = tagName || 'div';
	    this.tagName = tagName.toLowerCase();
	    this.namespace = attrs.namespace;
	    this.initAttrs();
	    this.extendAttrs(attrs);
	    return;
	  }

	  Tag.prototype.initAttrs = function() {
	    var className, me;
	    me = this;
	    this.hasActiveProperties = false;
	    this.cacheClassName = "";
	    this.className = className = classFn();
	    this.className.onInvalidate(function() {
	      if (className.valid) {
	        me.hasActiveProperties = true;
	        return me.invalidate();
	      }
	    });
	    this.cacheProps = {};
	    this.props = {};
	    this.boundProps = {};
	    this['invalidateProps'] = {};
	    this.nodeProps = {};
	    this.hasActiveNodeAttrs = false;
	    this.cacheNodeAttrs = {};
	    this.nodeAttrs = {};
	    this.boundNodeAttrs = {};
	    this['invalidateNodeAttrs'] = {};
	    this.hasActiveStyle = false;
	    this.cacheStyle = {};
	    this.style = {};
	    this.boundStyle = {};
	    this['invalidateStyle'] = {};
	    this.hasActiveEvents = false;
	    this.events = this.events || {};
	    return this.eventUpdateConfig = {};
	  };

	  Tag.prototype.extendAttrs = function(attrs) {
	    var className, generator, handler, key, nodeAttrs, props, style, styles, v, v0, value, _i, _j, _len, _len1, _ref4;
	    className = this.className, style = this.style, props = this.props, nodeAttrs = this.nodeAttrs;
	    for (key in attrs) {
	      value = attrs[key];
	      if (key === 'style') {
	        styles = styleFrom(value);
	        for (key in styles) {
	          value = styles[key];
	          this.setProp(key, value, style, 'Style');
	        }
	      } else if (key === 'class' || key === 'className') {
	        className.extend(value);
	      } else if (key.slice(0, 2) === 'on') {
	        if (!value) {
	          continue;
	        } else if (typeof value === 'function') {
	          this.bindOne(key, value);
	        } else {
	          v0 = value[0];
	          if (v0 === 'before' || v0 === 'after') {
	            _ref4 = value.slice(1);
	            for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
	              v = _ref4[_i];
	              this.bindOne(key, v, v0 === 'before');
	            }
	          } else {
	            for (_j = 0, _len1 = value.length; _j < _len1; _j++) {
	              v = value[_j];
	              this.bindOne(key, v);
	            }
	          }
	        }
	      } else if (key[0] === '$') {
	        generator = directiveRegistry[key];
	        if (value instanceof Array) {
	          handler = generator.apply(null, value);
	        } else {
	          handler = generator.apply(null, [value]);
	        }
	        handler(this);
	      } else if (key.slice(0, 5) === 'attr_') {
	        this.setProp(key.slice(5), value, nodeAttrs, 'NodeAttrs');
	      } else {
	        this.setProp(key, value, props, 'Props');
	      }
	    }
	    return this;
	  };

	  Tag.prototype.prop = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.props, 'Props');
	  };

	  Tag.prototype.propBind = function(prop) {
	    return this._propBind([prop], this.props, 'Props');
	  };

	  Tag.prototype.css = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.style, 'Style');
	  };

	  Tag.prototype.cssBind = function(prop) {
	    return this._propBind(prop, this.style, 'Style');
	  };

	  Tag.prototype.attr = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.nodeAttrs, 'NodeAttrs');
	  };

	  Tag.prototype.attrBind = function(prop) {
	    return this._propBind(prop, this.nodeAttrs, 'NodeAttrs');
	  };

	  Tag.prototype._propBind = function(prop, props, type) {
	    var bound, boundProps, me;
	    boundProps = this['bound' + type];
	    if (bound = boundProps[prop]) {
	      return bound;
	    } else {
	      me = this;
	      return boundProps[prop] = react(function() {
	        return me._prop(prop, props, type);
	      });
	    }
	  };

	  Tag.prototype._prop = function(args, props, type) {
	    var key, prop, v, value;
	    if (args.length === 0) {
	      return props;
	    }
	    if (args.length === 1) {
	      prop = args[0];
	      if (typeof prop === 'string') {
	        value = props[prop];
	        if (value != null) {
	          if (typeof value === 'function') {
	            return domValue(value());
	          } else {
	            return domValue(value);
	          }
	        } else {
	          return domValue(this['cache' + type][prop]);
	        }
	      } else {
	        for (key in prop) {
	          v = prop[key];
	          this.setProp(key, v, props, type);
	        }
	      }
	    } else if (args.length === 2) {
	      if (type === 'NodeAttrs') {
	        this.setProp(args[0], args[1], props, type);
	      } else {
	        this.setProp(args[0], args[1], props, type);
	      }
	    }
	    return this;
	  };

	  Tag.prototype.setProp = function(prop, value, props, type) {
	    var bound, fn, me, oldValue;
	    prop = attrToPropName(prop);
	    value = domField(value);
	    oldValue = props[prop];
	    if (value === oldValue) {
	      return this;
	    } else if (oldValue == null) {
	      if (typeof value === 'function') {
	        me = this;
	        this['invalidate' + type][prop] = fn = function() {
	          var bound;
	          me.addActivity(props, prop, type, true);
	          if (bound = me['bound' + type][prop]) {
	            bound.invalidate();
	          }
	          return props[prop] = value;
	        };
	        value.onInvalidate(fn);
	        this.addActivity(props, prop, type);
	        props[prop] = value;
	      } else if (value !== this['cache' + type][prop]) {
	        this.addActivity(props, prop, type);
	        if (bound = this['bound' + type][prop]) {
	          bound.invalidate();
	        }
	        props[prop] = value;
	      }
	    } else {
	      if (typeof oldValue === 'function') {
	        oldValue.offInvalidate(this['invalidate' + type][prop]);
	      }
	      if (typeof value === 'function') {
	        me = this;
	        this['invalidate' + type][prop] = fn = function() {
	          me.addActivity(props, prop, type, true);
	          if (bound = me['bound' + type][prop]) {
	            bound.invalidate();
	          }
	          return props[prop] = value;
	        };
	        value.onInvalidate(fn);
	      }
	      if (bound = this['bound' + type][prop]) {
	        bound.invalidate();
	      }
	      props[prop] = value;
	    }
	    return this;
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
	    var eventName, _i, _len;
	    if (arguments.length === 1) {
	      for (eventName in eventNames) {
	        handler = eventNames[eventName];
	        this.bindOne(eventName, handler);
	      }
	    } else {
	      if (!this.events) {
	        this.events = {};
	      }
	      eventNames = eventNames.split('\s+');
	      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	        eventName = eventNames[_i];
	        this.bindOne(eventName, handler, before);
	      }
	    }
	    return this;
	  };

	  Tag.prototype.bindOne = function(eventName, handler, before) {
	    var eventHandlers, events, index;
	    if (eventName.slice(0, 2) !== 'on') {
	      eventName = 'on' + eventName;
	    }
	    events = this.events;
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
	        return this;
	      }
	      if (before) {
	        eventHandlers.unshift.call(eventHandlers, handler);
	      } else {
	        eventHandlers.push.call(eventHandlers, handler);
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
	    if (this.node && !this.className.valid) {
	      this.hasActiveProperties = true;
	      this.invalidate();
	    }
	    return this;
	  };

	  Tag.prototype.removeClass = function() {
	    var items, _ref4;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref4 = this.className).removeClass.apply(_ref4, items);
	    if (this.node && !this.className.valid) {
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
	    dc.update();
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
	    dc.update();
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

	  Tag.prototype.getChildParentNode = function(child) {
	    return this.node;
	  };

	  Tag.prototype.createDom = function() {
	    var childNodes, children, length, nextNodes, node;
	    this.valid = true;
	    this.node = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
	    node.component = this;
	    this.hasActiveProperties && this.updateProperties();
	    children = this.children;
	    this.childNodes = childNodes = [];
	    nextNodes = this.nextNodes;
	    childNodes.length = nextNodes.length = length = children.length;
	    this.childParentNode = this.node;
	    this.childNextNode = null;
	    if (length = children.length) {
	      nextNodes[length - 1] = null;
	      this.createChildrenDom();
	    }
	    return this.firstNode = node;
	  };

	  Tag.prototype.refreshDom = function() {
	    this.valid = true;
	    if (this.hasActiveProperties) {
	      this.updateProperties();
	    }
	    refreshComponents.call(this);
	    return this.node;
	  };

	  Tag.prototype.updateProperties = function() {
	    var cacheNodeAttrs, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, events, node, nodeAttrs, prop, props, style, value;
	    this.hasActiveProperties = false;
	    node = this.node, className = this.className;
	    if (!className.valid) {
	      classValue = className();
	      if (classValue !== this.cacheClassName) {
	        this.cacheClassName = node.className = classValue;
	      }
	    }
	    if (this.hasActiveNodeAttrs) {
	      nodeAttrs = this.nodeAttrs, cacheNodeAttrs = this.cacheNodeAttrs;
	      this.hasActiveNodeAttrs = false;
	      for (prop in nodeAttrs) {
	        value = nodeAttrs[prop];
	        delete nodeAttrs[prop];
	        value = domValue(value);
	        cacheNodeAttrs[prop] = node[prop] = value;
	        node.setAttribute(prop, value);
	      }
	    }
	    if (this.hasActiveProps) {
	      props = this.props, cacheProps = this.cacheProps;
	      this.hasActiveProps = false;
	      for (prop in props) {
	        value = props[prop];
	        delete props[prop];
	        value = domValue(value);
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
	        value = domValue(value);
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

	  Tag.prototype.getPrevChainComponentOf = function(child) {
	    var children, index;
	    children = this.children;
	    if (index = this.dcidIndexMap[child.dcid]) {
	      return children[index - 1];
	    } else {
	      return null;
	    }
	  };

	  Tag.prototype.clone = function() {
	    var child, children, _i, _len, _ref4;
	    children = [];
	    _ref4 = this.children;
	    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
	      child = _ref4[_i];
	      children.push(child.clone());
	    }
	    return new Tag(this.tagName, this.attrs, children).copyEventListeners(this);
	  };

	  Tag.prototype.toString = function(indent, addNewLine) {
	    var child, children, key, s, v, value, _i, _len, _ref4, _ref5, _ref6;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine("<" + this.tagName, indent, addNewLine);
	    _ref4 = this.props;
	    for (key in _ref4) {
	      value = _ref4[key];
	      s += ' ' + key + '=' + funcString(value);
	    }
	    if (this.hasActiveStyle) {
	      s += ' style={';
	      _ref5 = this.style;
	      for (key in _ref5) {
	        value = _ref5[key];
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
	      _ref6 = this.children;
	      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
	        child = _ref6[_i];
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

	})(BaseComponent);

	mixin = __webpack_require__(3).mixin;

	ListMixin = __webpack_require__(22);

	mixin(Tag.prototype, ListMixin);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(9);

	module.exports = exports = extend({}, __webpack_require__(27), __webpack_require__(28), __webpack_require__(30));

	exports.classFn = __webpack_require__(29);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var attrPropNameMap, classFn, extend, extendEventValue, isComponent, overAttrs, styleFrom;

	extend = __webpack_require__(9);

	isComponent = __webpack_require__(8).isComponent;

	extendEventValue = __webpack_require__(28).extendEventValue;

	classFn = __webpack_require__(29);

	styleFrom = __webpack_require__(30).styleFrom;

	exports.extendAttrs = function(attrs, obj, options) {
	  var key, objClass, style, value;
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
	  style = styleFrom(attrs.style);
	  if (obj.style) {
	    attrs.style = extend(style, obj.style);
	  } else {
	    attrs.style = style;
	  }
	  for (key in obj) {
	    value = obj[key];
	    if (key === 'class' || key === 'className') {
	      continue;
	    } else if (key.slice(0, 2) === 'on') {
	      if (options['replace_' + key] || options.replaceEvents) {
	        attrs[key] = value;
	      } else {
	        extendEventValue(attrs, key, value);
	      }
	    } else if (key === 'style') {
	      continue;
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

	attrPropNameMap = {
	  'for': 'htmlFor'
	};

	exports.attrToPropName = function(name) {
	  var i, len, newName, pieces;
	  if (newName = attrPropNameMap[name]) {
	    return newName;
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var config, extendEventValue;

	config = __webpack_require__(7);

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

	exports.eventHandlerFromArray = function(callbackList, eventName) {
	  return function(event) {
	    var comp, component, fn, options, updateList, _i, _j, _len, _len1, _ref;
	    component = this.component;
	    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
	      fn = callbackList[_i];
	      if (fn) {
	        fn.call(this, event, component);
	      }
	    }
	    updateList = component.eventUpdateConfig[eventName];
	    if (updateList) {
	      for (_j = 0, _len1 = updateList.length; _j < _len1; _j++) {
	        _ref = updateList[_j], comp = _ref[0], options = _ref[1];
	        if (options.alwaysUpdating || !config.useSystemUpdating) {
	          dc.update();
	        }
	      }
	    }
	    if (!event) {
	      return;
	    }
	    if (!event.executeDefault) {
	      event.preventDefault();
	    }
	    if (!event.continuePropagation) {
	      event.stopPropagation();
	    }
	  };
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var domField, isArray, react,
	  __slice = [].slice;

	react = __webpack_require__(2).react;

	domField = __webpack_require__(6).domField;

	isArray = __webpack_require__(3).isArray;

	module.exports = function() {
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
	    var item, name, names, value, _i, _j, _len, _len1, _ref;
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
	        _ref = item.classMap;
	        for (name in _ref) {
	          value = _ref[name];
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


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var cloneObject, styleFrom;

	cloneObject = __webpack_require__(3).cloneObject;

	exports.styleFrom = styleFrom = function(value) {
	  var item, key, result, v, _i, _j, _len, _len1, _ref, _ref1;
	  if (typeof value === 'string') {
	    result = {};
	    value = value.trim().split(/\s*;\s*/);
	    for (_i = 0, _len = value.length; _i < _len; _i++) {
	      item = value[_i];
	      item = item.trim();
	      if (!item) {
	        continue;
	      }
	      _ref = item.split(/\s*:\s*/), key = _ref[0], v = _ref[1];
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
	        _ref1 = item.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
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


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Comment, Text, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(13);

	Text = __webpack_require__(15);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(6).domValue;

	module.exports = Comment = (function(_super) {
	  __extends(Comment, _super);

	  function Comment(text) {
	    Comment.__super__.constructor.call(this, text);
	  }

	  Comment.prototype.createDom = function() {
	    var node, text;
	    this.textValid = true;
	    text = domValue(this.text);
	    node = document.createComment(text);
	    this.node = this.firstNode = node;
	    this.cacheText = text;
	    return this.node;
	  };

	  Comment.prototype.updateDom = function() {
	    var node, parentNode, text;
	    if (this.textValid) {
	      return this.node;
	    }
	    this.textValid = true;
	    text = domValue(this.text);
	    if (text !== this.cacheText) {
	      parentNode = node.parentNode;
	      if (parentNode) {
	        parentNode.removeChild(node);
	      }
	      node = document.createComment(text);
	      this.node = this.firstNode = node;
	      this.cacheText = text;
	    }
	    return this.node;
	  };

	  Comment.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Comment " + (funcString(this.text)) + "/>", indent, addNewLine);
	  };

	  return Comment;

	})(Text);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Html, HtmlMixin, ListMixin, Tag, domField, domValue, extend, funcString, method, mixin, newLine, _fn, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Tag = __webpack_require__(25);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, mixin = _ref.mixin;

	_ref1 = __webpack_require__(6), domValue = _ref1.domValue, domField = _ref1.domField;

	module.exports = Html = (function(_super) {
	  __extends(Html, _super);

	  function Html(attrs, text, transform) {
	    var tagName;
	    if (typeof attrs === 'string' || typeof attrs === 'function') {
	      transform = text;
	      text = attrs;
	      attrs = {};
	    } else {
	      attrs = attrs || {};
	    }
	    if (attrs.tagName) {
	      tagName = attrs.tagName;
	      delete attrs.tagName;
	    } else {
	      tagName = 'div';
	    }
	    this.initHtmlComponent(text, transform);
	    Html.__super__.constructor.call(this, tagName, attrs, []);
	  }

	  Html.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Html " + (funcString(this._text)) + "/>", indent, addNewLine);
	  };

	  return Html;

	})(Tag);

	Html.HtmlMixin = HtmlMixin = {
	  initHtmlComponent: function(text, transform) {
	    var me, set;
	    this._text = text = domField(text);
	    this.transform = transform;
	    me = this;
	    if (typeof text === 'function') {
	      text.onInvalidate(function() {
	        me.textValid = false;
	        return me.invalidate();
	      });
	    }
	    if (Object.defineProperty) {
	      ({
	        get: function() {
	          return me._text;
	        }
	      });
	      set = function(text) {
	        me.setText(text);
	        return text;
	      };
	      return Object.defineProperty(this, 'text', {
	        set: set
	      });
	    }
	  },
	  initChildren: function() {},
	  createDom: function() {
	    var node;
	    this.textValid = true;
	    this.node = this.firstNode = node = document.createElement(this.tagName);
	    node.component = this;
	    this.updateProperties();
	    this.cacheText = node.innerHTML = this.transform && this.transform(domValue(this._text)) || domValue(this._text);
	    return this;
	  },
	  refreshDom: function() {
	    var node, text;
	    this.valid = true;
	    if (this.textValid) {
	      return this;
	    }
	    this.textValid = true;
	    text = this.transform && this.transform(domValue(this._text)) || domValue(this._text);
	    node = this.node;
	    if (text !== this.cacheText) {
	      if (node.childNodes.length >= 2) {
	        if (node.parentNode) {
	          this.removeNode();
	        }
	        this.node = this.firstNode = node = node.cloneNode(false);
	        this.attachNode();
	        node.component = this;
	      }
	      node.innerHTML = text;
	      this.cacheText = text;
	    }
	    this.updateProperties();
	    return this;
	  },
	  setText: function(text) {
	    var me;
	    text = domField(text);
	    if (this._text === text) {
	      return this;
	    }
	    this.textValid = false;
	    this._text = text;
	    me = this;
	    if (typeof text === 'function') {
	      text.onInvalidate(function() {
	        me.textValid = false;
	        return me.invalidate();
	      });
	    }
	    this.invalidate();
	    return this;
	  },
	  invalidateOffspring: function(offspring) {
	    var holder;
	    holder = this.holder;
	    if (!holder) {
	      this;
	    } else {
	      if (holder === dc) {
	        dc.invalidateOffspring(offspring);
	      } else {
	        if (holder.isBaseComponent) {
	          holder.invalidateOffspring(offspring);
	        } else {
	          holder.invalidate();
	        }
	      }
	    }
	    return this;
	  }
	};

	ListMixin = __webpack_require__(22);

	_fn = function(method) {
	  return Html.prototype[method] = function() {
	    return dc.error("Html component has no children components, do not call ListMixin method(" + method + ") on it");
	  };
	};
	for (method in ListMixin) {
	  _fn(method);
	}

	extend = __webpack_require__(9);

	extend(Html.prototype, HtmlMixin);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var ObjectDefineProperty, TestComponent, TransformComponent, funcString, intersect, newLine, renew, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	TransformComponent = __webpack_require__(17);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	ObjectDefineProperty = Object.defineProperty;

	module.exports = TestComponent = (function(_super) {
	  __extends(TestComponent, _super);

	  function TestComponent(test) {
	    var get, me, set;
	    TestComponent.__super__.constructor.apply(this, arguments);
	    this.__cacheTest = null;
	    me = this;
	    this.invalidateHandler = function() {
	      return me.invalidateTransform();
	    };
	    if (ObjectDefineProperty) {
	      get = function() {
	        return me._test;
	      };
	      set = function(test) {
	        me.setTest(test);
	        return test;
	      };
	      ObjectDefineProperty(this, 'test', {
	        get: get,
	        set: set
	      });
	    }
	    this.setTest(test);
	    this;
	  }

	  TestComponent.prototype.getTestValue = function() {
	    var test;
	    test = this.test;
	    if (typeof test === 'function') {
	      return this.__cacheTest = test.call(this);
	    } else {
	      return this.__cacheTest = test;
	    }
	  };

	  TestComponent.prototype.setTest = function(test) {
	    var oldTest, testField;
	    oldTest = this.test;
	    if (test === oldTest) {
	      return test;
	    } else {
	      if (typeof oldTest === 'function') {
	        if (test === this.__originalTest) {
	          return test;
	        }
	        this.__originalTest.offInvalidate(this.invalidateHandler);
	      }
	      if (ObjectDefineProperty) {
	        testField = '_test';
	      } else {
	        testField = 'test';
	      }
	      if (typeof test === 'function') {
	        this.__originalTest = test;
	        if (!test.invalidate) {
	          test = renew(test);
	        }
	        test.onInvalidate(this.invalidateHandler);
	      }
	      if (this.__cacheTest !== test) {
	        this.invalidateTransform();
	      }
	      return this[testField] = test;
	    }
	  };

	  return TestComponent;

	})(TransformComponent);


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var If, ObjectDefineProperty, TestComponent, funcString, intersect, mergeIf, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(19);

	TestComponent = __webpack_require__(33);

	_ref = __webpack_require__(3), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	mergeIf = __webpack_require__(35);

	ObjectDefineProperty = Object.defineProperty;

	module.exports = If = (function(_super) {
	  __extends(If, _super);

	  function If(test, then_, else_, merge, recursive, forceIf) {
	    var family;
	    if (forceIf == null) {
	      forceIf = false;
	    }
	    if (then_ === else_) {
	      return toComponent(then_);
	    }
	    then_ = toComponent(then_);
	    else_ = toComponent(else_);
	    if (!forceIf) {
	      if (typeof test !== 'function') {
	        if (test) {
	          return then_;
	        } else {
	          return else_;
	        }
	      } else if (merge) {
	        return mergeIf(test, then_, else_, recursive);
	      }
	    }
	    If.__super__.constructor.call(this, test);
	    this.then_ = then_;
	    this.else_ = else_;
	    this.family = family = intersect([then_.family, else_.family]);
	    family[this.dcid] = true;
	    return this;
	  }

	  If.prototype.getContentComponent = function() {
	    if (this.getTestValue()) {
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

	})(TestComponent);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var List, Nothing, Tag, emptyEventCallback, eventHandlerFromArray, exports, extend, flow, flowIf, mergeIf, mergeIfChild, mergeIfChildren, mergeIfClassFn, mergeIfEvents, mergeIfProps;

	extend = __webpack_require__(9);

	Tag = __webpack_require__(25);

	List = __webpack_require__(21);

	Nothing = __webpack_require__(20);

	eventHandlerFromArray = __webpack_require__(26).eventHandlerFromArray;

	flow = __webpack_require__(36);

	flowIf = flow.if_;

	exports = module.exports = mergeIf = function(test, then_, else_, recursive) {
	  var If, children, className, component, elseTransform, events, props, style, thenTransform, transform;
	  If = __webpack_require__(34);
	  if (then_ === else_) {
	    return then_;
	  } else if (then_.constructor === Tag && else_.constructor === Tag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
	    children = mergeIfChildren(test, then_, else_, recursive);
	    component = new Tag(then_.tagName, {}, children);
	    className = mergeIfClassFn(test, then_.className, else_.className);
	    props = mergeIfProps(test, then_.props, else_.props);
	    style = mergeIfProps(test, then_.style, else_.style);
	    events = mergeIfEvents(test, then_.events, else_.events, component);
	    return component.addClass(className).prop(props).css(style).bind(events);
	  } else if (then_.isHtml && else_.isHtml) {
	    thenTransform = then_.transform;
	    elseTransform = else_.transform;
	    transform = function(text) {
	      if (test()) {
	        return thenTransform && thenTransform(text) || text;
	      } else {
	        return elseTransform && elseTransform(text) || text;
	      }
	    };
	    return new then_.constructor(flowIf(test, then_.text, else_.text), transform);
	  } else if (then_.isText && else_.isText && then_.constructor === else_.constructor) {
	    return new then_.constructor(flowIf(test, then_.text, else_.text));
	  } else if (then_.isNothing && else_.isNothing) {
	    return then_;
	  } else if (then_.isList && else_.isList) {
	    return new List(mergeIfChildren(test, then_, else_, recursive));
	  } else {
	    return new If(test, then_, else_, false, false, true);
	  }
	};

	mergeIfChild = function(test, then_, else_, recursive) {
	  var If;
	  if (!recursive && (then_.isList || else_.isList)) {
	    If = __webpack_require__(34);
	    return new If(test, then_, else_, false, false, true);
	  } else {
	    return mergeIf(test, then_, else_, recursive);
	  }
	};

	exports.mergeIfChildren = mergeIfChildren = function(test, then_, else_, recursive) {
	  var children, elseChildren, elseChildrenLength, elseItem, i, thenChildren, thenChildrenLength, thenItem, _i, _j, _k, _len, _len1, _len2;
	  thenChildren = then_.children;
	  elseChildren = else_.children;
	  thenChildrenLength = thenChildren.length;
	  elseChildrenLength = elseChildren.length;
	  if (thenChildrenLength === elseChildrenLength) {
	    children = new Array(thenChildrenLength);
	    for (i = _i = 0, _len = thenChildren.length; _i < _len; i = ++_i) {
	      thenItem = thenChildren[i];
	      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
	    }
	  } else if (thenChildrenLength < elseChildrenLength) {
	    children = new Array(elseChildrenLength);
	    for (i = _j = 0, _len1 = thenChildren.length; _j < _len1; i = ++_j) {
	      thenItem = thenChildren[i];
	      children[i] = mergeIfChild(test, thenItem, elseChildren[i], recursive);
	    }
	    while (i < elseChildrenLength) {
	      children[i] = mergeIf(test, new Nothing(), elseChildren[i]);
	      i++;
	    }
	  } else {
	    children = new Array(thenChildrenLength);
	    for (i = _k = 0, _len2 = elseChildren.length; _k < _len2; i = ++_k) {
	      elseItem = elseChildren[i];
	      children[i] = mergeIfChild(test, thenChildren[i], elseItem, recursive);
	    }
	    while (i < thenChildrenLength) {
	      children[i] = mergeIf(test, thenChildren[i], new Nothing());
	      i++;
	    }
	  }
	  return children;
	};

	mergeIfClassFn = function(test, thenClassName, elseClassName) {
	  return mergeIfProps(test, thenClassName.classMap, elseClassName.classMap);
	};

	mergeIfProps = function(test, thenProps, elseProps) {
	  var prop, unified;
	  unified = extend({}, thenProps, elseProps);
	  for (prop in unified) {
	    unified[prop] = flowIf(test, thenProps[prop], elseProps[prop]);
	  }
	  return unified;
	};

	emptyEventCallback = function() {};

	mergeIfEvents = function(test, thenEvents, elseEvents, component) {
	  var elseCallbackList, elseHandler, eventName, thenCallbackList, thenHandler, unified;
	  unified = extend({}, thenEvents, elseEvents);
	  for (eventName in unified) {
	    if (thenCallbackList = thenEvents[eventName]) {
	      thenHandler = eventHandlerFromArray(thenCallbackList.slice(0), eventName, component);
	    } else {
	      thenHandler = emptyEventCallback;
	    }
	    if (elseCallbackList = elseEvents[eventName]) {
	      elseHandler = eventHandlerFromArray(elseCallbackList.slice(0), eventName, component);
	    } else {
	      elseHandler = emptyEventCallback;
	    }
	    unified[eventName] = function(event) {
	      if (test()) {
	        return thenHandler.call(component.node, event, component);
	      } else {
	        return elseHandler.call(component.node, event, component);
	      }
	    };
	  }
	  return unified;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var binary, bind, duplex, flow, see, unary, _ref;

	_ref = __webpack_require__(37), see = _ref.see, bind = _ref.bind, duplex = _ref.duplex, flow = _ref.flow, unary = _ref.unary, binary = _ref.binary;

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

	flow.no = flow.not = flow.not_ = function(x) {
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


/***/ },
/* 37 */
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
	    if (typeof callback !== 'function') {
	      throw new Error("call back should be a function");
	    }
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
	    if (!method.valid) {
	      return;
	    }
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
	    var value;
	    if (!arguments.length) {
	      value = computation();
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
	  if (!deps.length) {
	    return react(computation);
	  }
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
	  reactive = react(function(value) {
	    if (!arguments.length) {
	      if (!reactive.valid) {
	        reactive.valid = true;
	        return cacheValue = computation();
	      } else {
	        return cacheValue;
	      }
	    } else {
	      if (value === cacheValue) {
	        return value;
	      } else {
	        cacheValue = computation(value);
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
	        var args, _k, _len1;
	        if (argumnets.length) {
	          throw new Error("flow.pipe is not allow to have arguments");
	        }
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
	            set(value);
	          }
	          getter.invalidate();
	          return getter.cacheValue = value;
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
	            set(value);
	          }
	          get && get.invalidate && get.invalidate();
	          method.invalidate();
	          return method.cacheValue = value;
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Case, TestComponent, foreach, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(19);

	TestComponent = __webpack_require__(33);

	_ref = __webpack_require__(3), foreach = _ref.foreach, funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(2).renew;

	module.exports = Case = (function(_super) {
	  __extends(Case, _super);

	  function Case(test, map, else_, forceCase) {
	    var families, family;
	    this.map = map;
	    if (forceCase == null) {
	      forceCase = false;
	    }
	    if (!forceCase && typeof test !== 'function') {
	      if (map.hasOwnPoperty(test)) {
	        return toComponent(map[key]);
	      } else {
	        return toComponent(else_);
	      }
	    }
	    foreach(map, function(value, index) {
	      return map[index] = toComponent(value);
	    });
	    this.else_ = toComponent(else_);
	    families = [];
	    foreach(map, function(value) {
	      return families.push(value.family);
	    });
	    families.push(this.else_.family);
	    this.family = family = intersect(families);
	    family[this.dcid] = true;
	    Case.__super__.constructor.call(this, test);
	  }

	  Case.prototype.getContentComponent = function() {
	    return this.map[this.getTestValue()] || this.else_;
	  };

	  Case.prototype.clone = function() {
	    var cloneMap;
	    cloneMap = foreach(this.map, function(value) {
	      return value.clone();
	    });
	    return (new Case(this.test, cloneMap, this["else"].clone())).copyEventListeners(this);
	  };

	  Case.prototype.toString = function(indent, addNewLine) {
	    var s;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine('', indent, addNewLine) + '<Case ' + funcString(this.test) + '>';
	    foreach(this.map, function(value, index) {
	      return s += newLine(index + ': ' + value.toString(indent + 2, false), indent + 2, true);
	    });
	    return s += this.else_.toString(indent + 2, true) + newLine('</Case>', indent, true);
	  };

	  return Case;

	})(TestComponent);


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var Pick, TransformComponent, extend, newLine, toComponent,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(19);

	TransformComponent = __webpack_require__(17);

	newLine = __webpack_require__(3).newLine;

	extend = __webpack_require__(9);

	module.exports = Pick = (function(_super) {
	  __extends(Pick, _super);

	  function Pick(host, field, initialContent) {
	    var family, get, me, set;
	    this.host = host;
	    Pick.__super__.constructor.call(this);
	    me = this;
	    if (field == null) {
	      this.field = field = 'content';
	    } else {
	      this.field = field;
	    }
	    if (initialContent) {
	      this._content = host[field] = toComponent(initialContent);
	    } else {
	      this._content = host[field] = toComponent(host[field]);
	    }
	    this.family = family = extend({}, this._content.family);
	    family[this.dcid] = true;
	    if (Object.defineProperty) {
	      get = function() {
	        return me._content;
	      };
	      set = function(content) {
	        me.setContent(content);
	        return content;
	      };
	      Object.defineProperty(host, field, {
	        get: get,
	        set: set
	      });
	    }
	  }

	  Pick.prototype.setContent = function(content) {
	    var oldContent;
	    oldContent = this._content;
	    if (content === oldContent) {
	      return this;
	    } else {
	      this.invalidateTransform();
	      this.onSetContent(content, oldContent);
	      this._content = toComponent(content);
	      return this;
	    }
	  };

	  Pick.prototype.onSetContent = function(content, oldContent) {
	    return this;
	  };

	  Pick.prototype.getContentComponent = function() {
	    return this._content;
	  };

	  Pick.prototype.clone = function() {
	    return (new this.constructor(this.host, this.field)).copyEventListeners(this);
	  };

	  Pick.prototype.toString = function(indent, addNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    if (addNewLine == null) {
	      addNewLine = '';
	    }
	    return newLine('', indent, addNewLine) + '<Pick:' + this.field + ': ' + this._content.toString(indent + 2, true) + '>';
	  };

	  return Pick;

	})(TransformComponent);


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var Defer, FULFILL, INIT, REJECT, TransformComponent, extend, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(19);

	TransformComponent = __webpack_require__(17);

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
	    return this;
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Case, Comment, Component, Defer, Func, Html, If, List, Nothing, Pick, Tag, Text, attrsChildren, defaultItemFunction, each, every, getEachArgs, isArray, isAttrs, isComponent, isEachObjectSystemKey, isEven, isObject, list, renew, tag, toComponent, toTagChildren, watchItems, _each, _ref, _ref1, _ref2,
	  __slice = [].slice;

	_ref = __webpack_require__(11), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Pick = _ref.Pick, Nothing = _ref.Nothing, Defer = _ref.Defer;

	isEven = __webpack_require__(3).isEven;

	isAttrs = __webpack_require__(42).isAttrs;

	_ref1 = __webpack_require__(3), isArray = _ref1.isArray, isObject = _ref1.isObject;

	_ref2 = __webpack_require__(1), watchItems = _ref2.watchItems, isEachObjectSystemKey = _ref2.isEachObjectSystemKey;

	renew = __webpack_require__(2).renew;

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
	  var args, attrs, children, tagName, _ref3;
	  tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  _ref3 = attrsChildren(args), attrs = _ref3[0], children = _ref3[1];
	  return new Tag(tagName, attrs, toTagChildren(children));
	};

	exports.nstag = function() {
	  var args, attrs, children, namespace, tagName, _ref3;
	  tagName = arguments[0], namespace = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
	  _ref3 = attrsChildren(args), attrs = _ref3[0], children = _ref3[1];
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
	  return new Html(attrs, text, transform);
	};

	exports.if_ = function(attrs, test, then_, else_, merge, recursive) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_, merge, recursive)]);
	  } else {
	    return new If(attrs, test, then_, merge, recursive);
	  }
	};

	exports.forceIf = function(attrs, test, then_, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_, true, false, true)]);
	  } else {
	    return new If(attrs, test, then_, true, false, true);
	  }
	};

	exports.mergeIf = function(attrs, test, then_, else_, recursive) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_, true, recursive)]);
	  } else {
	    return new If(attrs, test, then_, true, recursive);
	  }
	};

	exports.recursiveIf = function(attrs, test, then_, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_, true, true)]);
	  } else {
	    return new If(attrs, test, then_, true, true);
	  }
	};

	exports.case_ = function(attrs, test, map, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Case(test, map, else_)]);
	  } else {
	    return new Case(attrs, test, map);
	  }
	};

	exports.forceCase = function(attrs, test, map, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Case(test, map, else_, true)]);
	  } else {
	    return new Case(attrs, test, map, true);
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

	exports.pick = function(host, field, initialContent) {
	  return new Pick(host, field, initialContent);
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

	defaultItemFunction = function(item) {
	  return item;
	};

	_each = function(attrs, items, options) {
	  var children, getItemComponent, i, item, key, keyChildMap, listComponent, tagName, _i, _len;
	  if (attrs) {
	    if (attrs.tagName) {
	      tagName = attrs.tagName;
	      delete attrs.tagName;
	    } else {
	      tagName = 'div';
	    }
	    listComponent = new Tag(tagName, attrs, []);
	  } else {
	    listComponent = new List([]);
	  }
	  listComponent.items = items;
	  if (typeof options === 'function') {
	    listComponent.itemFunc = options;
	    options = {};
	  } else {
	    options = options || {};
	    listComponent.itemFunc = options.itemFunc || defaultItemFunction;
	  }
	  listComponent.separatorFunc = options.separatorFunc;
	  listComponent.updateSuccChild = options.updateSuccChild;
	  listComponent.updateSuccIndex = options.updateSuccIndex;
	  listComponent.keyChildMap = keyChildMap = {};
	  if (isArray(items)) {
	    listComponent.getItemComponent = getItemComponent = function(item, itemIndex) {
	      var itemComponent, separatorComponent;
	      itemComponent = toComponent(listComponent.itemFunc(item, itemIndex, items, listComponent));
	      if (listComponent.separatorFunc && itemIndex) {
	        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, item, items, listComponent));
	        itemComponent = new List([separatorComponent, itemComponent]);
	      }
	      itemComponent.itemIndex = itemIndex;
	      return itemComponent;
	    };
	  } else {
	    listComponent.getItemComponent = getItemComponent = function(key, itemIndex) {
	      var itemComponent, separatorComponent, value;
	      value = items[key];
	      keyChildMap[key] = itemIndex;
	      itemComponent = toComponent(listComponent.itemFunc(value, key, itemIndex, listComponent));
	      if (listComponent.separatorFunc && itemIndex) {
	        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, value, key, listComponent));
	        itemComponent = new List([separatorComponent, itemComponent]);
	      }
	      itemComponent.$watchingKey = key;
	      itemComponent.itemIndex = itemIndex;
	      return itemComponent;
	    };
	  }
	  children = listComponent.children;
	  if (isArray(items)) {
	    for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
	      item = items[i];
	      children.push(getItemComponent(item, i));
	    }
	  } else {
	    i = 0;
	    for (key in items) {
	      children.push(getItemComponent(key, i));
	      i++;
	    }
	  }
	  return listComponent;
	};

	getEachArgs = function(args) {
	  var attrs, items, key, options;
	  attrs = args[0], items = args[1], options = args[2];
	  if (args.length === 1) {
	    return [null, attrs, {}];
	  } else if (args.length === 3) {
	    return [attrs, items, options];
	  } else {
	    if (typeof items === 'function') {
	      return [
	        null, attrs, {
	          itemFunc: items
	        }
	      ];
	    } else if (isArray(items)) {
	      return [attrs, items, {}];
	    } else if (isArray(attrs)) {
	      return [null, attrs, items];
	    } else if (!items) {
	      return [null, attrs, {}];
	    } else if (!isObject(items)) {
	      throw new Error('wrong parameter');
	    } else {
	      for (key in items) {
	        if (items.hasOwnProperty(key)) {
	          continue;
	        } else if (key.test(/itemFunc|separatorFunc|updateSuccChild|updateSuccIndex/)) {
	          return [null, attrs, items];
	        }
	      }
	      return [attrs, items, {}];
	    }
	  }
	};

	exports.every = every = function() {
	  var args, attrs, items, options, _ref3;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  _ref3 = getEachArgs(args), attrs = _ref3[0], items = _ref3[1], options = _ref3[2];
	  return _each(attrs, items, options);
	};

	exports.each = each = function() {
	  var args, attrs, items, listComponent, options, _ref3;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  _ref3 = getEachArgs(args), attrs = _ref3[0], items = _ref3[1], options = _ref3[2];
	  listComponent = every(attrs, items, options);
	  return watchItems(items, listComponent);
	};

	exports.funcEach = function(attrs, listFunc, options) {
	  var isRenew, listComponent, listItems;
	  if (typeof attrs === 'function') {
	    options = listFunc;
	    listFunc = attrs;
	    attrs = null;
	  }
	  if (!listFunc.invalidate) {
	    isRenew = true;
	    listFunc = renew(listFunc);
	  }
	  listItems = [];
	  listComponent = each(attrs, listItems, options);
	  listFunc.onInvalidate(function() {
	    return listComponent.invalidate();
	  });
	  listComponent.on('willRender', function() {
	    var newList;
	    newList = listFunc();
	    listItems.setItem.apply(listItems, [0].concat(__slice.call(newList)));
	    return listItems.setLength(newList.length);
	  });
	  listComponent.on('didRender', function() {
	    if (isRenew) {
	      return listComponent.holder.invalidateOffspring(listComponent);
	    }
	  });
	  return listComponent;
	};

	exports.mapEach = function(attrs, mapFunc, options) {
	  var isRenew, listComponent, listFunc, map;
	  if (typeof attrs === 'function') {
	    options = mapFunc;
	    mapFunc = attrs;
	    attrs = null;
	  }
	  if (!listFunc.invalidate) {
	    isRenew = true;
	    listFunc = renew(listFunc);
	  }
	  map = {};
	  listComponent = each(attrs, map, options);
	  listFunc.onInvalidate(function() {
	    return listComponent.invalidate();
	  });
	  listComponent.on('willRender', function() {
	    var deleteKeys, key, newMap, _results;
	    newMap = listFunc();
	    deleteKeys = [];
	    for (key in map) {
	      if (newMap.hasOwnProperty(key)) {
	        if (isEachObjectSystemKey()) {
	          continue;
	        } else {
	          map.setItem(key, newMap[key]);
	        }
	      } else {
	        deleteKeys.push(key);
	      }
	    }
	    map.deleteItem.apply(map, keys);
	    _results = [];
	    for (key in newMap) {
	      if (!map.hasOwnProperty(key)) {
	        _results.push(map.setItem(key, newMap[key]));
	      } else {
	        _results.push(void 0);
	      }
	    }
	    return _results;
	  });
	  listComponent.on('didRender', function() {
	    if (isRenew) {
	      return listComponent.holder.invalidateOffspring(listComponent);
	    }
	  });
	  return listComponent;
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Comment, Func, Html, Text, isComponent, mergeThenElseValue, toComponent, _ref;

	_ref = __webpack_require__(11), isComponent = _ref.isComponent, toComponent = _ref.toComponent;

	Func = __webpack_require__(24);

	Text = __webpack_require__(15);

	Html = __webpack_require__(32);

	Comment = __webpack_require__(31);

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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var extend, getBindProp, input, inputTypes, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref,
	  __slice = [].slice;

	extend = __webpack_require__(9);

	tag = __webpack_require__(41).tag;

	getBindProp = __webpack_require__(6).getBindProp;

	tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section" + " svg iframe";

	tagNames = tagNames.split(' ');

	_fn = function(tagName) {
	  return exports[tagName] = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return tag.apply(null, [tagName].concat(__slice.call(args)));
	  };
	};
	for (_i = 0, _len = tagNames.length; _i < _len; _i++) {
	  tagName = tagNames[_i];
	  _fn(tagName);
	}

	exports.tagHtml = function() {
	  var args;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  return tag.apply(null, ['html'].concat(__slice.call(args)));
	};

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


/***/ },
/* 44 */
/***/ function(module, exports) {

	var DomcomError, dcError, slice, stackReg, stackReg2, stacktraceMessage,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	slice = [].slice;

	stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;

	stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

	stacktraceMessage = function(message, stackIndex) {
	  var error, file, itemInfo, line, method, pos, stackItem, stacklist, stacklistLength;
	  if (stackIndex == null) {
	    stackIndex = 1;
	  }
	  if (message) {
	    if (!dcError.prodution) {
	      console.log(message);
	    }
	    message += ':\n';
	  } else {
	    message = "";
	  }
	  error = new Error();
	  if (!dcError.prodution) {
	    console.log(error);
	  }
	  stacklist = error.stack.split('\n').slice(3);
	  stackIndex = 1;
	  stacklistLength = stacklist.length;
	  while (stackIndex < stacklistLength) {
	    stackItem = stacklist[stackIndex];
	    itemInfo = stackReg.exec(stackItem) || stackReg2.exec(stackItem);
	    if (itemInfo && itemInfo.length === 5) {
	      method = itemInfo[1];
	      file = itemInfo[2];
	      line = itemInfo[3];
	      pos = itemInfo[4];
	      message += file + ':' + line + ':' + pos + ':' + method + '\n';
	    }
	    stackIndex++;
	  }
	  return message;
	};

	exports.DomcomError = DomcomError = (function(_super) {
	  __extends(DomcomError, _super);

	  function DomcomError(message, component) {
	    this.message = message;
	    this.component = component;
	  }

	  DomcomError.prototype.toString = function() {
	    if (this.component) {
	      return this.component.toString() + '\n' + this.message;
	    } else {
	      return this.message;
	    }
	  };

	  return DomcomError;

	})(Error);

	exports.error = dcError = function(message, component) {
	  message = stacktraceMessage(message, 2);
	  throw new DomcomError(message, component);
	};

	exports.onerror = function(message, component) {
	  if (message instanceof DomcomError) {
	    console.log(message);
	    throw new Error(message.message);
	  } else if (message instanceof Error) {
	    throw message;
	  } else {
	    if (comopenent) {
	      console.log(component);
	      console.log(message);
	    } else {
	      console.log(message);
	    }
	    throw new Error(message + ':\n' + stacktraceMessage());
	  }
	};


/***/ }
/******/ ]);