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
/*!***************************!*\
  !*** ./src/domcom.coffee ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var dc, extend;

	module.exports = dc = __webpack_require__(/*! ./dc */ 2);

	if (typeof window !== 'undefined') {
	  window.dc = dc;
	}

	dc.DomNode = __webpack_require__(/*! ./DomNode */ 4);

	dc.extend = extend = __webpack_require__(/*! extend */ 3);

	dc.EventMixin = __webpack_require__(/*! ./dc-event */ 8);

	extend(dc, dc.flow = __webpack_require__(/*! lazy-flow */ 6));

	__webpack_require__(/*! lazy-flow/addon */ 9);

	dc.bindings = dc.flow.bindings;

	__webpack_require__(/*! dc-watch-list */ 10);

	extend(dc, __webpack_require__(/*! dc-util */ 1), __webpack_require__(/*! ./dom-util */ 5), __webpack_require__(/*! ./dc-render */ 11), __webpack_require__(/*! ./core */ 12), __webpack_require__(/*! ./dc-error */ 46));

	dc.property = __webpack_require__(/*! ./core/property */ 41);

	dc.builtinDirectives = __webpack_require__(/*! ./directives/index */ 47);

	extend(dc, dc.property, dc.builtinDirectives);


/***/ },
/* 1 */
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
/* 2 */
/*!***********************!*\
  !*** ./src/dc.coffee ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	var DomNode, addEventListener, dc, directiveRegistry, extend, isComponent;

	extend = __webpack_require__(/*! extend */ 3);

	DomNode = __webpack_require__(/*! ./DomNode */ 4);

	addEventListener = __webpack_require__(/*! ./dom-util */ 5).addEventListener;

	isComponent = __webpack_require__(/*! ./core/base/isComponent */ 7);

	module.exports = dc = function(element, all) {
	  if (typeof element === 'string') {
	    if (all) {
	      return dc(document.querySelectorAll(element));
	    } else {
	      return dc(document.querySelector(element));
	    }
	  } else if (element instanceof Node) {
	    if (element.component) {
	      return element.component;
	    } else {
	      return new DomNode(element);
	    }
	  } else if (element instanceof NodeList || element instanceof Array) {
	    return new DomNode(element);
	  } else {
	    throw new Error('error type for dc');
	  }
	};

	dc.toString = function() {
	  return 'domcom';
	};

	dc.directiveRegistry = directiveRegistry = {};

	dc.clearDirectives = function() {
	  return dc.directiveRegistry = directiveRegistry = {};
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

	if (typeof window !== 'undefined') {
	  window.$document = dc.$document = new DomNode(document);
	}

	dc.ready = function() {
	  if (dc.listeners['ready']) {
	    dc.emit('ready');
	  }
	};

	if (typeof window !== 'undefined') {
	  addEventListener(document, 'DOMContentLoaded', dc.ready, false);
	  addEventListener(document, 'DOMContentLoaded', function() {
	    return window.$body = dc.$body = new DomNode(document.body);
	  });
	}

	extend(dc, __webpack_require__(/*! ./dc-event */ 8));


/***/ },
/* 3 */
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
/* 4 */
/*!****************************!*\
  !*** ./src/DomNode.coffee ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	var DomNode, addEventListener, newLine, processProp, removeEventListener, _ref;

	newLine = __webpack_require__(/*! dc-util */ 1).newLine;

	_ref = __webpack_require__(/*! ./dom-util */ 5), addEventListener = _ref.addEventListener, removeEventListener = _ref.removeEventListener;

	processProp = function(props, cache, prop, value) {
	  var p, _i, _len;
	  if (value == null) {
	    if (typeof prop === 'string') {
	      return props[prop];
	    } else {
	      for (value = _i = 0, _len = prop.length; _i < _len; value = ++_i) {
	        p = prop[value];
	        if ((cacheProps[p] == null) || value !== cacheProps[p]) {
	          cacheProps[p] = props[p] = value;
	        }
	      }
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
	    if (!arguments.length) {
	      return node;
	    } else if (node instanceof Node) {
	      return processProp(node, this.cacheProps, prop, value);
	    } else {
	      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
	        n = node[i];
	        processProp(n, this.cacheProps[i], prop, value);
	      }
	    }
	  };

	  DomNode.prototype.css = function(prop, value) {
	    var i, n, node, _i, _len;
	    node = this.node;
	    if (!arguments.length) {
	      return ndoe.style;
	    } else if (node instanceof Node) {
	      return processProp(node.style, this.cacheStyle, prop, value);
	    } else {
	      for (i = _i = 0, _len = node.length; _i < _len; i = ++_i) {
	        n = node[i];
	        processProp(n.style, this.cacheStyle[i], prop, value);
	      }
	    }
	  };

	  DomNode.prototype.bind = function(eventNames, handler) {
	    var n, name, node, _i, _j, _len, _len1, _ref1;
	    node = this.node;
	    _ref1 = eventNames.split(/\s+/);
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      name = _ref1[_i];
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
	    var n, name, node, _i, _j, _len, _len1, _ref1;
	    node = this.node;
	    _ref1 = eventNames.split(/\s+/);
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      name = _ref1[_i];
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
/* 5 */
/*!*****************************!*\
  !*** ./src/dom-util.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var renew;

	if (typeof window !== 'undefined') {
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
	  } else if (tagName === 'input' && component.props.type === 'checkbox') {
	    return 'checked';
	  } else {
	    return 'value';
	  }
	};

	if (typeof window !== 'undefined') {
	  if (document.addEventListener) {
	    exports.addEventListener = function(node, name, handler, useCapture) {
	      node.addEventListener(name, handler, useCapture);
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

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

	exports.domField = function(value, component) {
	  var fn;
	  if (value == null) {
	    return '';
	  } else if (typeof value !== 'function') {
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
	  } else if (value.bindComponent) {
	    return value.bindComponent(component);
	  } else if (!value.invalidate) {
	    return renew(value);
	  } else {
	    return value;
	  }
	};

	exports.domValue = function(value, component) {
	  if (value == null) {
	    return '';
	  } else if (typeof value !== 'function') {
	    return value;
	  } else {
	    value = value.call(component);
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
/* 6 */
/*!*****************************!*\
  !*** ../lazy-flow/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var flow, funcString, lazy, newLine, react, renew, see, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! dc-util */ 1), newLine = _ref.newLine, funcString = _ref.funcString;

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
/* 7 */
/*!******************************************!*\
  !*** ./src/core/base/isComponent.coffee ***!
  \******************************************/
/***/ function(module, exports) {

	module.exports = function(item) {
	  return item && (item.renderDom != null);
	};


/***/ },
/* 8 */
/*!*****************************!*\
  !*** ./src/dc-event.coffee ***!
  \*****************************/
/***/ function(module, exports) {

	var dcEventMixin,
	  __slice = [].slice;

	module.exports = dcEventMixin = {
	  on: function(event, callback) {
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
	      if (!callback) {
	        dc.error('Component.on: callback is undefined for event: ' + event);
	      }
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
	  },
	  off: function(event, callback) {
	    var callbacks, index, listeners, _i, _j, _len, _len1, _ref, _ref1;
	    if (!arguments.length) {
	      this.listeners = {};
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
	        if (callbacks && (index = callbacks.indexOf(callback)) >= 0) {
	          callbacks.splice(index, 1);
	          if (!callbacks.length) {
	            listeners[event] = null;
	          }
	        }
	      }
	    }
	    return this;
	  },
	  once: function(event, callback) {
	    var onceCallback;
	    if (!callback) {
	      dc.error('Component.once: callback is undefined for event: ' + event);
	    }
	    onceCallback = function() {
	      var args;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      this.off(event, onceCallback);
	      return callback.apply(this, args);
	    };
	    return this.on(event, onceCallback);
	  },
	  emit: function() {
	    var args, callback, callbacks, event, method, _i, _len;
	    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    if (!this.destroyed) {
	      if (this.listeners && (callbacks = this.listeners[event])) {
	        callbacks = callbacks.slice();
	        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
	          callback = callbacks[_i];
	          callback.apply(this, args);
	        }
	      } else {
	        if (method = this['on' + event]) {
	          method.apply(this, args);
	        }
	      }
	    }
	    return this;
	  }
	};


/***/ },
/* 9 */
/*!*********************************!*\
  !*** ../lazy-flow/addon.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var binary, bind, duplex, flow, react, see, unary, _ref;

	_ref = __webpack_require__(/*! lazy-flow */ 6), react = _ref.react, see = _ref.see, bind = _ref.bind, duplex = _ref.duplex, flow = _ref.flow, unary = _ref.unary, binary = _ref.binary;

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
/* 10 */
/*!*********************************!*\
  !*** ../dc-watch-list/index.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var ListWatchMixin, ObjectWatchMixin, extend, flow, isArray, isEachObjectSystemKey, react, slice, watchList, watchObject,
	  __slice = [].slice;

	react = (flow = __webpack_require__(/*! lazy-flow */ 6)).react;

	isArray = __webpack_require__(/*! dc-util */ 1).isArray;

	extend = __webpack_require__(/*! extend */ 3);

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
	  listItems.getListChildren = ListWatchMixin.getListChildren;
	  return listItems.replaceAll = ListWatchMixin.replaceAll;
	};

	ListWatchMixin = {};

	ListWatchMixin.getListChildren = function(listComponent, start, stop) {
	  var children, i, itemComponent;
	  children = [];
	  i = start;
	  while (i < stop) {
	    itemComponent = listComponent.getItemComponent(this[i], i);
	    itemComponent.valid = true;
	    children.push(itemComponent);
	    i++;
	  }
	  return children;
	};

	ListWatchMixin.updateComponent = function(listComponent, start, stop) {
	  var children;
	  children = this.getListChildren(listComponent, start, stop);
	  listComponent.setChildren(start, children);
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

	ListWatchMixin.unshift = function() {
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
	  var child, i, inserted, insertedLength, j, listComponent, newLength, oldListLength, result, watchingListComponents, _;
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
	    newLength = this.length;
	    if (newLength === oldListLength) {
	      this.updateComponents(start, start + insertedLength);
	    } else {
	      watchingListComponents = this.watchingListComponents;
	      for (_ in watchingListComponents) {
	        listComponent = watchingListComponents[_];
	        if (!listComponent.updateSuccChild) {
	          if (insertedLength > deleteCount) {
	            i = start;
	            j = 0;
	            while (j < deleteCount) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.replaceChild(i, child);
	              i++;
	              j++;
	            }
	            while (j < insertedLength) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.insertChild(i, child);
	              i++;
	              j++;
	            }
	          } else {
	            i = start;
	            j = 0;
	            while (j < insertedLength) {
	              child = listComponent.getItemComponent(this[i], i);
	              listComponent.replaceChild(i, child);
	              i++;
	              j++;
	            }
	            while (j < deleteCount) {
	              listComponent.removeChild(i);
	              j++;
	            }
	          }
	        } else {
	          this.updateComponent(listComponent, start, newLength);
	        }
	      }
	    }
	    return this;
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

	ListWatchMixin.replaceAll = function(newItems) {
	  this.setItem.apply(this, [0].concat(__slice.call(newItems)));
	  this.setLength(newItems.length);
	  return this;
	};

	flow.watchObject = watchObject = function(objectItems, listComponent, itemFn) {
	  var watchingListComponents;
	  watchingListComponents = objectItems.watchingListComponents || (objectItems.watchingListComponents = {});
	  watchingListComponents[listComponent.dcid] = listComponent;
	  if (objectItems.eachWatching) {
	    return;
	  }
	  objectItems.eachWatching = true;
	  return extend(objectItems, ObjectWatchMixin);
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

	ObjectWatchMixin.replaceAll = function(obj) {
	  var key, keys, _i, _len;
	  keys = Object.keys(this);
	  for (_i = 0, _len = keys.length; _i < _len; _i++) {
	    key = keys[_i];
	    if (!obj.hasOwnProperty(key)) {
	      this.deleteItem(key);
	    }
	  }
	  this.extendItems(obj);
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
/* 11 */
/*!******************************!*\
  !*** ./src/dc-render.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var isArray, isComponent, lastTime, rafRender, renderWhenComponentEvent, vendor, _i, _len, _ref;

	isArray = __webpack_require__(/*! dc-util */ 1).isArray;

	isComponent = __webpack_require__(/*! ./core/base/isComponent */ 7);

	if (typeof window !== 'undefined') {
	  if (!window.requestAnimationFrame) {
	    _ref = ['webkit', 'ms', 'moz', 'o'];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      vendor = _ref[_i];
	      if (window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame']) {
	        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
	        break;
	      }
	    }
	  }
	  if (!window.requestAnimationFrame) {
	    lastTime = 0;
	    window.requestAnimationFrame = function(callback) {
	      var currTime, id, timeToCall;
	      currTime = (new Date).getTime();
	      timeToCall = Math.max(0, 16 - (currTime - lastTime));
	      id = window.setTimeout((function() {
	        callback(currTime + timeToCall);
	      }), timeToCall);
	      lastTime = currTime + timeToCall;
	      return id;
	    };
	  }
	  if (!window.cancelAnimationFrame) {
	    window.cancelAnimationFrame = function(id) {
	      clearTimeout(id);
	    };
	  }
	}

	dc.reset = function() {
	  dc.renderBySystemLoop = false;
	  dc.listeners = {};
	  dc.rootComponentMap = {};
	  return dc.removingChildren = {};
	};

	dc.reset();

	dc.render = function(force) {
	  var component, dcid, rootComponentMap;
	  if (force || dc.alwaysRender || !dc.renderBySystemLoop) {
	    dc.emit('willRender');
	    if (!dc.valid) {
	      dc.valid = true;
	      rootComponentMap = dc.rootComponentMap;
	      dc.rootComponentMap = {};
	      for (dcid in rootComponentMap) {
	        component = rootComponentMap[dcid];
	        component.render(true);
	      }
	      dc.clean();
	    }
	    return dc.emit('didRender');
	  }
	};

	dc.rafRender = rafRender = function() {
	  dc.renderBySystemLoop = true;
	  requestAnimFrame(rafRender);
	  dc.render(true);
	};

	dc.renderWhen = function(cause, events, options) {
	  var callback, clear, comp, components, event, handler, test, _j, _k, _len1, _len2;
	  components = options.target;
	  if (typeof events === 'string') {
	    events = events.split(/\s+/);
	  }
	  if (isComponent(cause)) {
	    cause = [cause];
	  }
	  if (cause instanceof Array) {
	    for (_j = 0, _len1 = cause.length; _j < _len1; _j++) {
	      comp = cause[_j];
	      for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
	        event = events[_k];
	        renderWhenComponentEvent(comp, event, components);
	      }
	    }
	  } else if (cause === window.setInterval) {
	    test = options.test, clear = options.clear;
	    handler = null;
	    callback = function() {
	      var component, _l, _len3;
	      if (!test || test()) {
	        for (_l = 0, _len3 = components.length; _l < _len3; _l++) {
	          component = components[_l];
	          component.render();
	        }
	        dc.clean();
	      }
	      if (clear && clear()) {
	        return clearInterval(handler);
	      }
	    };
	    handler = setInterval(callback, events || 16);
	  } else if (cause === setTimeout) {
	    callback = function() {
	      var component, _l, _len3;
	      for (_l = 0, _len3 = components.length; _l < _len3; _l++) {
	        component = components[_l];
	        component.render();
	      }
	      return dc.clean();
	    };
	    setTimeout(callback, events);
	  }
	};

	renderWhenComponentEvent = function(component, event, components) {
	  var componentMap, _j, _len1;
	  if (event.slice(0, 2) !== 'on') {
	    event = 'on' + event;
	  }
	  componentMap = component.eventUpdateConfig[event] || (component.eventUpdateConfig[event] = {});
	  for (_j = 0, _len1 = components.length; _j < _len1; _j++) {
	    component = components[_j];
	    componentMap[component.dcid] = component;
	  }
	};

	dc.stopRenderWhen = function(component, event, components) {
	  var componentMap, dcid;
	  if (event.slice(0, 2) !== 'on') {
	    event = 'on' + event;
	  }
	  if (components) {
	    if (componentMap = component.eventUpdateConfig[event]) {
	      for (dcid in components) {
	        component = components[dcid];
	        delete componentMap[dcid];
	      }
	    }
	  } else {
	    delete component.eventUpdateConfig[event];
	  }
	};

	dc.invalidate = function() {
	  return dc.valid = false;
	};

	dc.invalidateContent = function(component) {
	  dc.valid = false;
	  dc.rootComponentMap[component.dcid] = component;
	};

	dc.invalidateAttach = function(child) {};

	dc.propagateChildNextNode = function(child, nextNode) {};

	dc.linkNextNode = function(child, oldNode, nextNode) {};

	dc.removingChildren = {};

	dc.clean = function() {
	  var component, _, _ref1;
	  _ref1 = dc.removingChildren;
	  for (_ in _ref1) {
	    component = _ref1[_];
	    component.removeDom();
	  }
	  dc.removingChildren = {};
	};


/***/ },
/* 12 */
/*!*******************************!*\
  !*** ./src/core/index.coffee ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(/*! extend */ 3);

	module.exports = exports = extend({}, __webpack_require__(/*! ./base */ 14), __webpack_require__(/*! ./property */ 41), __webpack_require__(/*! ./instantiate */ 13), __webpack_require__(/*! ./tag */ 44), __webpack_require__(/*! ./each */ 45));


/***/ },
/* 13 */
/*!*************************************!*\
  !*** ./src/core/instantiate.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var Case, Comment, Component, Defer, Func, Html, If, List, Nothing, Pick, Tag, Text, attrsChildren, extend, isArray, isAttrs, isComponent, isEven, isObject, list, renew, tag, toComponent, toTagChildren, _ref, _ref1,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! ./base */ 14), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, Html = _ref.Html, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Pick = _ref.Pick, Nothing = _ref.Nothing, Defer = _ref.Defer;

	isEven = __webpack_require__(/*! dc-util */ 1).isEven;

	extend = __webpack_require__(/*! extend */ 3);

	exports.isAttrs = isAttrs = function(item) {
	  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
	};

	_ref1 = __webpack_require__(/*! dc-util */ 1), isArray = _ref1.isArray, isObject = _ref1.isObject;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

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
	    return new Tag(null, attrs, [new Text(text)]);
	  } else {
	    return new Text(attrs);
	  }
	};

	exports.comment = function(attrs, text) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new Comment(text)]);
	  } else {
	    return new Comment(attrs);
	  }
	};

	exports.cdata = function(attrs, text) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new Cdata(text)]);
	  } else {
	    return new Cdata(attrs);
	  }
	};

	exports.html = function(attrs, text, transform) {
	  return new Html(attrs, text, transform);
	};

	exports.if_ = function(attrs, test, then_, else_, merge, recursive) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new If(test, then_, else_, merge, recursive)]);
	  } else {
	    return new If(attrs, test, then_, merge, recursive);
	  }
	};

	exports.forceIf = function(attrs, test, then_, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new If(test, then_, else_, true, false, true)]);
	  } else {
	    return new If(attrs, test, then_, true, false, true);
	  }
	};

	exports.mergeIf = function(attrs, test, then_, else_, recursive) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new If(test, then_, else_, true, recursive)]);
	  } else {
	    return new If(attrs, test, then_, true, recursive);
	  }
	};

	exports.recursiveIf = function(attrs, test, then_, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new If(test, then_, else_, true, true)]);
	  } else {
	    return new If(attrs, test, then_, true, true);
	  }
	};

	exports.case_ = function(attrs, test, map, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new Case(test, map, else_)]);
	  } else {
	    return new Case(attrs, test, map);
	  }
	};

	exports.forceCase = function(attrs, test, map, else_) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new Case(test, map, else_, true)]);
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
	    return new Tag(null, attrs, [new Cond(condComponents, else_)]);
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
	    return new Tag(null, attrs, [new Func(fn)]);
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
	    return new Tag(null, attrs, [new List(lst)]);
	  } else {
	    lst.unshift(attrs);
	    if (lst.length === 1) {
	      return toComponent(lst[0]);
	    } else {
	      return new List(lst);
	    }
	  }
	};

	exports.defer = function(attrs, promise, fulfill, reject, init) {
	  if (isAttrs(attrs)) {
	    return new Tag(null, attrs, [new Defer(promise, fulfill, reject, init)]);
	  } else {
	    return new Defer(attrs, promise, fulfill, reject);
	  }
	};


/***/ },
/* 14 */
/*!************************************!*\
  !*** ./src/core/base/index.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var route;

	route = __webpack_require__(/*! ./route */ 15);

	module.exports = {
	  isComponent: __webpack_require__(/*! ./isComponent */ 7),
	  toComponent: __webpack_require__(/*! ./toComponent */ 18),
	  toComponentArray: __webpack_require__(/*! ./toComponentArray */ 27),
	  Component: __webpack_require__(/*! ./Component */ 17),
	  BaseComponent: __webpack_require__(/*! ./BaseComponent */ 20),
	  ListMixin: __webpack_require__(/*! ./ListMixin */ 28),
	  List: __webpack_require__(/*! ./List */ 26),
	  Tag: __webpack_require__(/*! ./Tag */ 30),
	  Text: __webpack_require__(/*! ./Text */ 21),
	  Comment: __webpack_require__(/*! ./Comment */ 32),
	  Cdata: __webpack_require__(/*! ./Cdata */ 33),
	  Html: __webpack_require__(/*! ./Html */ 34),
	  Nothing: __webpack_require__(/*! ./Nothing */ 19),
	  TransformComponent: __webpack_require__(/*! ./TransformComponent */ 16),
	  TestComponent: __webpack_require__(/*! ./TestComponent */ 35),
	  If: __webpack_require__(/*! ./If */ 36),
	  Case: __webpack_require__(/*! ./Case */ 38),
	  Func: __webpack_require__(/*! ./Func */ 29),
	  Pick: __webpack_require__(/*! ./Pick */ 39),
	  Defer: __webpack_require__(/*! ./Defer */ 40),
	  Route: route.Route,
	  route: route
	};


/***/ },
/* 15 */
/*!************************************!*\
  !*** ./src/core/base/route.coffee ***!
  \************************************/
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

	TransformComponent = __webpack_require__(/*! ./TransformComponent */ 16);

	isComponent = __webpack_require__(/*! ./isComponent */ 7);

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	_ref = __webpack_require__(/*! dc-util */ 1), isEven = _ref.isEven, matchCurvedString = _ref.matchCurvedString;

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
/* 16 */
/*!*************************************************!*\
  !*** ./src/core/base/TransformComponent.coffee ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, TransformComponent,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(/*! ./Component */ 17);

	module.exports = TransformComponent = (function(_super) {
	  __extends(TransformComponent, _super);

	  TransformComponent.prototype.isTransformComponent = true;

	  function TransformComponent() {
	    TransformComponent.__super__.constructor.apply(this, arguments);
	    this.transformValid = false;
	  }

	  TransformComponent.prototype.invalidate = function() {
	    if (this.valid) {
	      this.valid = false;
	      this.holder && this.holder.invalidateContent(this);
	    }
	    return this;
	  };

	  TransformComponent.prototype.invalidateContent = function(content) {
	    return this.invalidate();
	  };

	  TransformComponent.prototype.invalidateAttach = function(content) {
	    if (this.attachValid) {
	      this.attachValid = false;
	      if (this.holder) {
	        this.holder.invalidateAttach(this);
	      }
	    }
	    return this;
	  };

	  TransformComponent.prototype.invalidateTransform = function() {
	    if (this.transformValid) {
	      this.transformValid = false;
	      this.invalidate();
	    }
	    return this;
	  };

	  TransformComponent.prototype.refreshDom = function(oldBaseComponent) {
	    this.renderDom(oldBaseComponent);
	    return this.attachParent();
	  };

	  TransformComponent.prototype.renderDom = function(oldBaseComponent) {
	    var baseComponent, content;
	    this.emit('willRenderDom');
	    this.valid = true;
	    this.attachValid = true;
	    if (!this.transformValid) {
	      this.transformValid = true;
	      content = this.content;
	      if (content && content.holder === this) {
	        this.content.holder = null;
	      }
	      this.content = this.getContentComponent();
	      this.content.clearRemoving();
	    }
	    content = this.content;
	    content.holder = this;
	    content.parentNode = this.parentNode;
	    content.nextNode = this.nextNode;
	    content.renderDom(oldBaseComponent);
	    baseComponent = content.baseComponent;
	    this.baseComponent = baseComponent;
	    this.node = baseComponent.node;
	    this.firstNode = baseComponent.firstNode;
	    if (!this.node.parentNode) {
	      content.attachValid = false;
	      this.invalidateAttach(content);
	    }
	    this.emit('didRenderDom');
	    return this;
	  };

	  TransformComponent.prototype.markRemovingDom = function() {
	    this.removing = true;
	    this.holder = null;
	    dc.removingChildren[this.dcid] = this;
	    if (this.content) {
	      this.content.markRemoving();
	    }
	    return this;
	  };

	  TransformComponent.prototype.markRemoving = function() {
	    this.removing = true;
	    if (this.content) {
	      this.content.markRemoving();
	    }
	  };

	  TransformComponent.prototype.clearRemoving = function() {
	    this.removing = this.removed = false;
	    if (this.content) {
	      this.content.clearRemoving();
	    }
	  };

	  TransformComponent.prototype.removeDom = function() {
	    if (this.removing) {
	      this.removing = false;
	      this.removed = true;
	      if (this.content) {
	        this.content.removeDom();
	      }
	    }
	    return this;
	  };

	  TransformComponent.prototype.removeNode = function() {
	    this.removing = false;
	    this.removed = true;
	    if (this.content) {
	      this.content.removeNode();
	    }
	  };

	  TransformComponent.prototype.attachParent = function() {
	    var content;
	    if (!this.attachValid) {
	      this.attachValid = true;
	      content = this.content;
	      content.parentNode = this.parentNode;
	      content.nextNode = this.nextNode;
	      content.attachParent();
	    }
	  };

	  TransformComponent.prototype.propagateChildNextNode = function(child, nextNode) {
	    if (this.holder) {
	      this.holder.propagateChildNextNode(this, nextNode);
	    }
	  };

	  TransformComponent.prototype.linkNextNode = function(child, oldNode, nextNode) {
	    if (this.holder) {
	      this.holder.linkNextNode(this, oldNode, nextNode);
	    }
	  };

	  TransformComponent.prototype.resetAttach = function() {
	    this.attachValid = false;
	    return this.content.resetAttach();
	  };

	  return TransformComponent;

	})(Component);


/***/ },
/* 17 */
/*!****************************************!*\
  !*** ./src/core/base/Component.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, dc, dcEventMixin, extend, flow, flowBind, isArray, isComponent, newDcid, normalizeDomElement, _ref;

	extend = __webpack_require__(/*! extend */ 3);

	normalizeDomElement = __webpack_require__(/*! ../../dom-util */ 5).normalizeDomElement;

	_ref = __webpack_require__(/*! dc-util */ 1), newDcid = _ref.newDcid, isArray = _ref.isArray;

	flow = __webpack_require__(/*! lazy-flow */ 6).flow;

	flowBind = flow.bind;

	isComponent = __webpack_require__(/*! ./isComponent */ 7);

	dc = __webpack_require__(/*! ../../dc */ 2);

	module.exports = Component = (function() {
	  function Component() {
	    this.dcid = newDcid();
	    this.listeners = this.listeners || {};
	    this.baseComponent = null;
	    this.parentNode = null;
	    this.nextNode = null;
	    this.node = null;
	    this.holder = null;
	    this.valid = true;
	    this.attachValid = true;
	    this.removing = false;
	    this.removed = false;
	    this.destroyed = false;
	    this.setReactive();
	  }

	  Component.prototype._prepareMount = function(mountNode, beforeNode) {
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
	        return mountNode.pushChild(this);
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
	        return mountNode.insertChildBefore(this, beforeNode);
	      }
	    } else {
	      this.parentNode = normalizeDomElement(mountNode) || this.parentNode || document.body;
	      this.nextNode = beforeNode || this.nextNode;
	      this.setHolder(dc);
	      this.clearRemoving();
	      return dc.rootComponentMap[this.dcid] = this;
	    }
	  };


	  /* if mountNode is given, it should not be the node of any Component
	  only use beforeNode if mountNode is given
	   */

	  Component.prototype.mount = function(mountNode, beforeNode, forceRender) {
	    this.emit('willMount');
	    this._prepareMount(mountNode, beforeNode);
	    this.render(forceRender);
	    return this.emit('didMount');
	  };

	  Component.prototype.unmount = function(forceRender) {
	    this.emit('willUnmount');
	    this.remove();
	    dc.clean();
	    return this.emit('didUnmount');
	  };

	  Component.prototype.remove = function() {
	    var firstNode, holder;
	    holder = this.holder;
	    if (!holder || holder === dc) {
	      delete dc.rootComponentMap[this.dcid];
	      firstNode = this.firstNode;
	      if (firstNode && firstNode.parentNode) {
	        this.markRemovingDom();
	      }
	    } else if (holder && holder.children) {
	      holder.removeChild(this);
	    } else if (holder) {
	      dc.error('Should not remove the content of TransformComponent');
	    }
	    return this;
	  };

	  Component.prototype.render = function(forceRender) {
	    if (!this.destroyed && (forceRender || dc.alwaysRender || !dc.renderBySystemLoop)) {
	      if (this.removing) {
	        this.removeDom();
	      } else if (!this.removed) {
	        this.refreshDom(this.baseComponent);
	      }
	    }
	    return this;
	  };

	  Component.prototype.replace = function(oldComponent, forceRender) {
	    var holder;
	    if (!this.destroyed && this !== oldComponent && !oldComponent.removing && !oldComponent.removed) {
	      holder = oldComponent.holder;
	      if (holder && holder !== dc) {
	        if (holder.isTransformComponent) {
	          dc.error('Should not replace the content of TransformComponent');
	        } else {
	          holder.replaceChild(oldComponent, this);
	        }
	      } else if (holder === dc) {
	        this.parentNode = oldComponent.parentNode;
	        this.nextNode = oldComponent.nextNode;
	        oldComponent.markRemovingDom();
	        this.setHolder(holder);
	        this.invalidate();
	        dc.rootComponentMap[this.dcid] = this;
	        delete dc.rootComponentMap[oldComponent.dcid];
	      }
	    }
	    return this;
	  };


	  /*
	  component.renderWhen components, events, options
	  component.renderWhen setInterval, interval, options
	  component.renderWhen setTimeout, interval, options
	   */

	  Component.prototype.renderWhen = function(cause, events, options) {
	    options = options || {};
	    options.target = [this];
	    dc.renderWhen(cause, events, options);
	    return this;
	  };

	  Component.prototype.destroy = function() {
	    this.emit('willDestroy');
	    this.executeDestroy();
	    return this.emit('didDestroy');
	  };

	  Component.prototype.executeDestroy = function() {
	    this.unmount(true);
	    this.destroyed = true;
	    this.listeners = null;
	    if (this.node) {
	      this.node.component = null;
	      this.node = null;
	    }
	    this.baseComponent = null;
	    return this.parentNode = null;
	  };

	  Component.prototype.getPrevComponent = function() {
	    var children, holder;
	    if (!(holder = this.holder)) {
	      return null;
	    } else if (children = holder.children) {
	      return children[children.indexOf(this) - 1];
	    }
	  };

	  Component.prototype.getNextComponent = function() {
	    var children, holder;
	    if (!(holder = this.holder)) {
	      return null;
	    } else if (children = holder.children) {
	      return children[children.indexOf(this) - 1];
	    }
	  };

	  Component.prototype.setNextNode = function(nextNode) {
	    this.nextNode = nextNode;
	  };

	  Component.prototype.setHolder = function(holder) {
	    if (this.holder && this.holder !== holder) {
	      this.holder.invalidateAttach(this);
	    }
	    this.holder = holder;
	    return this;
	  };

	  Component.prototype.isOffspringOf = function(ancestor) {
	    var holder;
	    holder = this.holder;
	    while (holder) {
	      if (holder === ancestor) {
	        return true;
	      }
	      holder = holder.holder;
	    }
	    return false;
	  };

	  Component.prototype.inFamilyOf = function(ancestor) {
	    return this === ancestor || this.isOffspringOf(ancestor);
	  };

	  Component.prototype.setReactive = function() {
	    var invalidateThis, me, reactField, reactive, srcField, _ref1;
	    if (this.reactMap) {
	      me = this;
	      invalidateThis = function() {
	        return me.invalidate();
	      };
	      _ref1 = this.reactMap;
	      for (srcField in _ref1) {
	        reactField = _ref1[srcField];
	        reactive = flowBind(this, srcField);
	        if (typeof reactField === 'string') {
	          reactive.onInvalidate(function() {
	            var reaction;
	            if (reaction = me[reactField]) {
	              return reaction.invalidate();
	            }
	          });
	        } else {
	          reactive.onInvalidate(invalidateThis);
	        }
	      }
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

	dcEventMixin = __webpack_require__(/*! ../../dc-event */ 8);

	extend(Component.prototype, dcEventMixin);


/***/ },
/* 18 */
/*!******************************************!*\
  !*** ./src/core/base/toComponent.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Nothing, Text, isComponent, react, toComponent;

	isComponent = __webpack_require__(/*! ./isComponent */ 7);

	Nothing = __webpack_require__(/*! ./Nothing */ 19);

	Text = __webpack_require__(/*! ./Text */ 21);

	react = __webpack_require__(/*! lazy-flow */ 6).react;

	module.exports = toComponent = function(item) {
	  var Func, List, component, e;
	  if (isComponent(item)) {
	    return item;
	  } else if (typeof item === 'function') {
	    return new Text(item);
	  } else if (item instanceof Array) {
	    List = __webpack_require__(/*! ./List */ 26);
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
	    Func = __webpack_require__(/*! ./Func */ 29);
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
/* 19 */
/*!**************************************!*\
  !*** ./src/core/base/Nothing.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Nothing, newLine,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	newLine = __webpack_require__(/*! dc-util */ 1).newLine;

	module.exports = Nothing = (function(_super) {
	  __extends(Nothing, _super);

	  function Nothing() {
	    Nothing.__super__.constructor.apply(this, arguments);
	    this.firstNode = null;
	    this.family = {};
	    this.baseComponent = this;
	  }

	  Nothing.prototype.invalidate = function() {
	    return this;
	  };

	  Nothing.prototype.renderDom = function(oldBaseComponent) {
	    if (oldBaseComponent) {
	      oldBaseComponent.markRemovingDom();
	    }
	    this.valid = true;
	    this.node = [];
	    return this;
	  };

	  Nothing.prototype.createDom = function() {
	    return this.node = [];
	  };

	  Nothing.prototype.attachParent = function() {
	    return this.node;
	  };

	  Nothing.prototype.attachChildren = function() {
	    return this.node;
	  };

	  Nothing.prototype.markRemovingDom = function() {
	    return this;
	  };

	  Nothing.prototype.removeDom = function() {
	    return this;
	  };

	  Nothing.prototype.removeNode = function() {};

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
/* 20 */
/*!********************************************!*\
  !*** ./src/core/base/BaseComponent.coffee ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Component,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(/*! ./Component */ 17);

	module.exports = BaseComponent = (function(_super) {
	  __extends(BaseComponent, _super);

	  function BaseComponent() {
	    BaseComponent.__super__.constructor.call(this);
	    this.isBaseComponent = true;
	    this.removing = false;
	    this.baseComponent = this;
	  }

	  BaseComponent.prototype.refreshDom = function(oldBaseComponent) {
	    this.renderDom();
	    this.attachParent();
	    return this;
	  };

	  BaseComponent.prototype.renderDom = function(oldBaseComponent) {
	    this.emit('willRenderDom');
	    if (oldBaseComponent && oldBaseComponent !== this) {
	      oldBaseComponent.markRemovingDom();
	    }
	    this.renderBaseComponent(oldBaseComponent);
	    this.emit('didRenderDom');
	    return this;
	  };

	  BaseComponent.prototype.renderBaseComponent = function(oldBaseComponent) {
	    if (oldBaseComponent && oldBaseComponent !== this) {
	      this.attachValid = false;
	      if (this.holder) {
	        this.holder.invalidateAttach(this);
	      }
	    }
	    if (!this.node) {
	      this.createDom();
	      if (this.holder) {
	        this.holder.invalidateAttach(this);
	      }
	    } else {
	      if (!this.valid) {
	        this.updateDom();
	      }
	    }
	  };

	  BaseComponent.prototype.invalidate = function() {
	    if (this.valid) {
	      this.valid = false;
	      return this.holder && this.holder.invalidateContent(this);
	    } else {
	      return this;
	    }
	  };

	  BaseComponent.prototype.resetAttach = function() {
	    return this.attachValid = false;
	  };

	  BaseComponent.prototype.attachChildren = function() {};

	  BaseComponent.prototype.markRemovingDom = function() {
	    this.removing = true;
	    this.holder = null;
	    dc.removingChildren[this.dcid] = this;
	    return this;
	  };

	  BaseComponent.prototype.markRemoving = function() {
	    this.removing = true;
	  };

	  BaseComponent.prototype.clearRemoving = function() {
	    return this.removing = this.removed = false;
	  };

	  BaseComponent.prototype.removeDom = function() {
	    var child, _i, _len, _ref;
	    if (this.removing) {
	      this.emit('willDetach');
	      if (this.isList) {
	        this.removing = false;
	        this.removed = true;
	        this.node.parentNode = null;
	        this.childParentNode = null;
	        _ref = this.children;
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          child = _ref[_i];
	          child.removeDom();
	        }
	      } else {
	        this.removeNode();
	      }
	      this.emit('didDetach');
	    }
	    return this;
	  };

	  BaseComponent.prototype.removeNode = function() {
	    var node;
	    this.removing = false;
	    this.removed = true;
	    if (node = this.node) {
	      node.parentNode && node.parentNode.removeChild(node);
	    }
	  };

	  BaseComponent.prototype.attachParent = function() {
	    var nextNode, node, parentNode;
	    node = this.node;
	    parentNode = this.parentNode;
	    nextNode = this.nextNode;
	    this.removing = false;
	    if (parentNode && (parentNode !== node.parentNode || nextNode !== node.nextSibling)) {
	      this.emit('willAttach');
	      parentNode.insertBefore(node, nextNode);
	      this.emit('didAttach');
	    }
	    return node;
	  };

	  return BaseComponent;

	})(Component);


/***/ },
/* 21 */
/*!***********************************!*\
  !*** ./src/core/base/Text.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Text, domField, domValue, dynamic, exports, funcString, hasTextContent, newLine, setText, value, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine, value = _ref.value, dynamic = _ref.dynamic;

	_ref1 = __webpack_require__(/*! ../../dom-util */ 5), domField = _ref1.domField, domValue = _ref1.domValue;

	setText = __webpack_require__(/*! ../property/attrs */ 22).setText;

	if ('textContent' in document.documentElement) {
	  hasTextContent = true;
	} else {
	  hasTextContent = false;
	}

	exports = module.exports = Text = (function(_super) {
	  __extends(Text, _super);

	  Text.prototype.isText = true;

	  function Text(text) {
	    var get, me, set;
	    Text.__super__.constructor.call(this);
	    this.setText(text);
	    if (Object.defineProperty) {
	      me = this;
	      get = function() {
	        return me._text;
	      };
	      set = function(text) {
	        me.setText(text);
	        return text;
	      };
	      Object.defineProperty(this, 'text', {
	        get: get,
	        set: set
	      });
	    }
	    this.family = {};
	    this.family[this.dcid] = true;
	    this;
	  }

	  Text.prototype.setText = setText;

	  Text.prototype.createDom = function() {
	    var node, text;
	    this.valid = true;
	    text = domValue(this.text, this);
	    node = document.createTextNode(text);
	    node.component = this;
	    this.node = node;
	    this.firstNode = node;
	    return node;
	  };

	  Text.prototype.updateDom = function() {
	    var node, text;
	    node = this.node;
	    this.valid = true;
	    text = domValue(this.text, this);
	    if (hasTextContent) {
	      if (text !== node.textContent) {
	        node.textContent = text;
	      }
	    } else {
	      if (text !== node.innerText) {
	        node.innerText = text;
	      }
	    }
	    return node;
	  };

	  Text.prototype.clone = function() {
	    var result;
	    result = new this.constructor(this.text);
	    return result.copyEventListeners(this);
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
/* 22 */
/*!****************************************!*\
  !*** ./src/core/property/attrs.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var attrPropNameMap, classFn, domField, extend, extendEventValue, isComponent, styleFrom;

	extend = __webpack_require__(/*! extend */ 3);

	isComponent = __webpack_require__(/*! ../base/isComponent */ 7).isComponent;

	extendEventValue = __webpack_require__(/*! ./events */ 24).extendEventValue;

	classFn = __webpack_require__(/*! ./classFn */ 23);

	styleFrom = __webpack_require__(/*! ./style */ 25).styleFrom;

	domField = __webpack_require__(/*! ../../dom-util */ 5).domField;

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

	attrPropNameMap = {
	  'for': 'htmlFor'
	};

	exports.attrToPropName = function(name) {
	  var i, len, newName, pieces;
	  if (newName = attrPropNameMap[name]) {
	    return newName;
	  } else {
	    pieces = name.split('-');
	    if (pieces.length === 1) {
	      return name;
	    } else {
	      i = 1;
	      len = pieces.length;
	      while (i < len) {
	        pieces[i] = pieces[i][0].toUpperCase() + pieces[i].slice(1);
	        i++;
	      }
	      return pieces.join('');
	    }
	  }
	};

	exports.setText = function(text) {
	  var me;
	  text = domField(text, this);
	  if (this._text === text) {
	    return this;
	  }
	  this._text = text;
	  me = this;
	  if (typeof text === 'function') {
	    text.onInvalidate(function() {
	      return me.invalidate();
	    });
	  }
	  this.invalidate();
	  return this;
	};


/***/ },
/* 23 */
/*!******************************************!*\
  !*** ./src/core/property/classFn.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var classFn, domField, exports, isArray, react,
	  __slice = [].slice;

	react = __webpack_require__(/*! lazy-flow */ 6).react;

	domField = __webpack_require__(/*! ../../dom-util */ 5).domField;

	isArray = __webpack_require__(/*! dc-util */ 1).isArray;

	module.exports = exports = classFn = function() {
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
	          value = value.call(this);
	        }
	        if (value) {
	          lst.push(klass);
	        }
	      }
	      return lst.join(' ');
	    } else {
	      extendClassMap([].slice(arguments));
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
	  method.clone = function() {
	    var newClassName;
	    newClassName = classFn();
	    return newClassName.extend(method);
	  };
	  return method;
	};

	exports.classFn = classFn;


/***/ },
/* 24 */
/*!*****************************************!*\
  !*** ./src/core/property/events.coffee ***!
  \*****************************************/
/***/ function(module, exports) {

	var addEventListenerMap, eventName, extendEventValue, _i, _len, _ref;

	exports.domEventHandler = function(event) {
	  var comp, component, componentMap, domEventCallbacks, eventType, fn, result, _, _i, _len;
	  if (component = this.component) {
	    eventType = 'on' + event.type;
	    domEventCallbacks = component.domEventCallbackMap[eventType];
	    for (_i = 0, _len = domEventCallbacks.length; _i < _len; _i++) {
	      fn = domEventCallbacks[_i];
	      result = fn.call(component, event, this);
	    }
	    if (componentMap = component.eventUpdateConfig[eventType]) {
	      for (_ in componentMap) {
	        comp = componentMap[_];
	        comp.render();
	      }
	      dc.clean();
	    }
	    if (event) {
	      if (!event.executeDefault && event.preventDefault) {
	        event.preventDefault();
	      }
	      if (!event.continuePropagation && event.stopPropagation) {
	        event.stopPropagation();
	      }
	    }
	  }
	  if (event && (event.dcEventResult != null)) {
	    return event.dcEventResult;
	  } else {
	    return result;
	  }
	};

	exports.addEventListenerMap = addEventListenerMap = {};

	_ref = 'compositionstart compositionupdate compositionend'.split(/\s/);
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	  eventName = _ref[_i];
	  addEventListenerMap['on' + eventName] = true;
	}

	exports.domEventHandlerFromArray = function(callbackArray) {
	  return function(event) {
	    var fn, _j, _len1;
	    for (_j = 0, _len1 = callbackArray.length; _j < _len1; _j++) {
	      fn = callbackArray[_j];
	      fn && fn.call(this.component, event, this);
	    }
	  };
	};

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

	exports.addHandlerToCallbackArray = function(handler, callbacks, before) {
	  var callback, index, _j, _len1;
	  if (typeof handler === 'function') {
	    handler = [handler];
	  }
	  if (before) {
	    callback = handler.pop();
	    while (callback) {
	      if (!callback) {
	        dc.error('addHandlerToCallbackArray: callback is undefined');
	      }
	      index = callbacks.indexOf(callback);
	      if (index <= 0) {
	        callbacks.unshift(callback);
	      }
	      callback = handler.pop();
	    }
	  } else {
	    for (_j = 0, _len1 = handler.length; _j < _len1; _j++) {
	      callback = handler[_j];
	      if (!callback) {
	        dc.error('addHandlerToCallbackArray: callback is undefined');
	      }
	      index = callbacks.indexOf(callback);
	      if (index <= 0) {
	        callbacks.push(callback);
	      }
	    }
	  }
	};


/***/ },
/* 25 */
/*!****************************************!*\
  !*** ./src/core/property/style.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var cloneObject, styleFrom;

	cloneObject = __webpack_require__(/*! dc-util */ 1).cloneObject;

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
/* 26 */
/*!***********************************!*\
  !*** ./src/core/base/List.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, ListMixin, ListMixinAttachChildren, binaryInsert, exports, mixin, newLine, toComponentArray,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	newLine = __webpack_require__(/*! dc-util */ 1).newLine;

	toComponentArray = __webpack_require__(/*! ./toComponentArray */ 27);

	mixin = __webpack_require__(/*! dc-util */ 1).mixin;

	ListMixin = __webpack_require__(/*! ./ListMixin */ 28);

	binaryInsert = __webpack_require__(/*! dc-util */ 1).binaryInsert;

	module.exports = exports = List = (function(_super) {
	  __extends(List, _super);

	  function List(children) {
	    List.__super__.constructor.call(this);
	    this.children = toComponentArray(children);
	    this.initListMixin();
	    this.isList = true;
	    return;
	  }

	  List.prototype.refreshDom = function(oldBaseComponent) {
	    this.renderDom();
	    this.attachChildren();
	    return this;
	  };

	  List.prototype.createDom = function() {
	    this.valid = true;
	    this.node = this.childNodes;
	    this.createChildrenDom();
	    this.firstNode = this.childrenFirstNode;
	    return this.node;
	  };

	  List.prototype.updateDom = function() {
	    this.valid = true;
	    this.updateChildrenDom();
	    this.firstNode = this.childrenFirstNode;
	    return this.node;
	  };

	  List.prototype.markRemovingDom = function() {
	    var child, _i, _len, _ref;
	    this.removing = true;
	    this.holder = null;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.markRemoving();
	    }
	    dc.removingChildren[this.dcid] = this;
	    return this;
	  };

	  List.prototype.markRemoving = function() {
	    var child, _i, _len, _ref;
	    this.removing = true;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.markRemoving();
	    }
	  };

	  List.prototype.clearRemoving = function() {
	    var child, _i, _len, _ref;
	    this.removing = this.removed = false;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.clearRemoving();
	    }
	  };

	  List.prototype.removeNode = function() {
	    var child, _i, _len, _ref;
	    this.removing = false;
	    this.removed = true;
	    this.node.parentNode = null;
	    this.childParentNode = null;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.baseComponent.removeNode();
	    }
	  };

	  List.prototype.invalidateAttach = function(child) {
	    var index;
	    index = this.children.indexOf(child);
	    binaryInsert(index, this.attachingIndexes);
	    if (this.attachValid) {
	      this.attachValid = false;
	      if (this.holder) {
	        this.holder.invalidateAttach(this);
	      }
	    }
	    return this;
	  };

	  List.prototype.resetAttach = function() {
	    var child, _i, _len, _ref;
	    this.attachValid = false;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.resetAttach();
	    }
	  };

	  List.prototype.attachParent = function() {
	    var nextNode, node, parentNode;
	    node = this.node;
	    parentNode = this.parentNode;
	    nextNode = this.nextNode;
	    this.removing = false;
	    if (parentNode && (parentNode !== node.parentNode || nextNode !== node.nextSibling)) {
	      this.emit('willAttach');
	      ListMixinAttachChildren.call(this);
	      return this.emit('didAttach');
	    }
	  };

	  List.prototype.setNextNode = function(nextNode) {
	    var child, children, index;
	    this.nextNode = nextNode;
	    this.childrenNextNode = nextNode;
	    children = this.children;
	    index = children.length - 1;
	    while (child = children[index]) {
	      child.setNextNode(nextNode);
	      if (!child.firstNode) {
	        index--;
	      } else {
	        break;
	      }
	    }
	  };

	  List.prototype.clone = function(options) {
	    var result;
	    result = new List(this.cloneChildren(options));
	    result.constructor = this.constructor;
	    return result.copyEventListeners(this);
	  };

	  List.prototype.toString = function(indent, addNewLine) {
	    var child, s, _i, _len, _ref;
	    if (indent == null) {
	      indent = 0;
	    }
	    if (!this.children.length) {
	      return newLine("<List/>", indent, addNewLine);
	    } else {
	      s = newLine("<List>", indent, addNewLine);
	      _ref = this.children;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        child = _ref[_i];
	        s += child.toString(indent + 2, true);
	      }
	      return s += newLine('</List>', indent, true);
	    }
	  };

	  return List;

	})(BaseComponent);

	mixin(List.prototype, ListMixin);

	ListMixinAttachChildren = ListMixin.attachChildren;


/***/ },
/* 27 */
/*!***********************************************!*\
  !*** ./src/core/base/toComponentArray.coffee ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var toComponent, toComponentArray;

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	module.exports = toComponentArray = function(item) {
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
/* 28 */
/*!****************************************!*\
  !*** ./src/core/base/ListMixin.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Nothing, addIndexes, binaryInsert, binarySearch, extendChildFamily, insertIndex, isArray, isComponent, removeIndex, setNextNodes, substractSet, toComponent, _ref, _ref1,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! dc-util */ 1), isArray = _ref.isArray, substractSet = _ref.substractSet;

	isComponent = __webpack_require__(/*! ./isComponent */ 7);

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	Nothing = __webpack_require__(/*! ./Nothing */ 19);

	_ref1 = __webpack_require__(/*! dc-util */ 1), binarySearch = _ref1.binarySearch, binaryInsert = _ref1.binaryInsert, substractSet = _ref1.substractSet;

	extendChildFamily = __webpack_require__(/*! ../../dom-util */ 5).extendChildFamily;

	insertIndex = function(index, indexes) {
	  var i;
	  i = binarySearch(index, indexes);
	  indexes.splice(i, 0, index);
	  addIndexes(indexes, 1, i + 1);
	};

	removeIndex = function(index, indexes) {
	  var i;
	  i = binarySearch(index, indexes);
	  if (indexes[i] === index) {
	    indexes.splice(i, 1);
	  }
	  addIndexes(indexes, -1, i);
	};

	addIndexes = function(indexes, value, start) {
	  var i, length;
	  length = indexes.length;
	  i = start;
	  while (i < length) {
	    indexes[i] += value;
	    if (indexes[i] < 0) {
	      throw 'negative index in ListMixin component';
	    }
	    i++;
	  }
	};

	setNextNodes = function(children, nextNode, last, first) {
	  var child, i;
	  i = last;
	  while (i >= first) {
	    child = children[i];
	    if (child.nextNode !== nextNode) {
	      child.nextNode = nextNode;
	      if (!child.firstNode) {
	        i--;
	        nextNode = child.firstNode;
	      } else {
	        break;
	      }
	    } else {
	      break;
	    }
	  }
	};

	module.exports = {
	  initListMixin: function() {
	    var child, family, i, _i, _len, _ref2;
	    this.updatingIndexes = [];
	    this.attachingIndexes = [];
	    this.childNodes = [];
	    this.family = family = {};
	    family[this.dcid] = true;
	    this.children = this.children || [];
	    _ref2 = this.children;
	    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
	      child = _ref2[i];
	      child.setHolder(this);
	      child.clearRemoving();
	      extendChildFamily(family, child);
	    }
	  },
	  cloneChildrenFrom: function(component, options) {
	    var child, children, i, _i, _len, _ref2;
	    children = [];
	    _ref2 = component.children;
	    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
	      child = _ref2[i];
	      children.push(this.cloneChild(child, i, options, component));
	    }
	    return this.setChildren(0, children);
	  },
	  cloneChild: function(child, index, options, srcComponent) {
	    return child.clone(options);
	  },
	  createChildrenDom: function() {
	    var child, firstNode, firstNodeIndex, index, node, _i, _len, _ref2;
	    node = this.childNodes;
	    firstNode = null;
	    this.updatingIndexes = [];
	    _ref2 = this.children;
	    for (index = _i = 0, _len = _ref2.length; _i < _len; index = ++_i) {
	      child = _ref2[index];
	      child.setHolder(this);
	      child.renderDom(child.baseComponent);
	      node.push(child.node);
	      if (!firstNode && child.firstNode) {
	        firstNode = child.firstNode;
	        firstNodeIndex = index;
	      }
	    }
	    this.childrenFirstNode = firstNode;
	    this.firstNodeIndex = firstNodeIndex;
	  },
	  updateChildrenDom: function() {
	    var child, children, index, node, updatingIndexes, _i, _len;
	    updatingIndexes = this.updatingIndexes;
	    this.updatingIndexes = [];
	    node = this.childNodes;
	    children = this.children;
	    for (_i = 0, _len = updatingIndexes.length; _i < _len; _i++) {
	      index = updatingIndexes[_i];
	      child = children[index];
	      child.setHolder(this);
	      child.renderDom(child.baseComponent);
	      index = children.indexOf(child);
	      node[index] = child.node;
	      this.updateChildrenFirstNode(child, index);
	    }
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
	  pushChild: function() {
	    var children, i, length, thisChildren;
	    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    thisChildren = this.children;
	    length = children.length;
	    i = 0;
	    while (i < length) {
	      this.insertChild(thisChildren.length, children[i]);
	      i++;
	    }
	    return this;
	  },
	  insertChild: function(refChild, child) {
	    var children, index, length;
	    children = this.children;
	    length = children.length;
	    if (refChild == null) {
	      index = length;
	    } else if (isComponent(refChild)) {
	      index = children.indexOf(refChild);
	      if (index < 0) {
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
	    child = toComponent(child);
	    return this._insertChild(index, child);
	  },
	  _insertChild: function(index, child) {
	    var children;
	    children = this.children;
	    children.splice(index, 0, child);
	    child.setHolder(this);
	    child.clearRemoving();
	    child.parentNode = this.childParentNode;
	    if (index === children.length - 1) {
	      child.setNextNode(this.childrenNextNode);
	    } else {
	      child.setNextNode(children[index + 1].firstNode || children[index + 1].nextNode);
	    }
	    if (this.node) {
	      this.childNodes.splice(index, 0, child.node);
	      if (!child.node || !child.valid) {
	        this.valid = false;
	        insertIndex(index, this.updatingIndexes);
	        if (this.holder) {
	          this.holder.invalidateContent(this);
	        }
	      }
	      if (this.holder) {
	        this.holder.invalidateAttach(this);
	      }
	      this.attachValid = false;
	      insertIndex(index, this.attachingIndexes);
	      if (child.firstNode && (!this.childrenFirstNode || index <= this.firstNodeIndex)) {
	        this.childrenFirstNode = child.firstNode;
	        this.firstNodeIndex = index;
	      }
	    }
	    return this;
	  },
	  unshiftChild: function() {
	    var children, i;
	    children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    i = children.length - 1;
	    while (i >= 0) {
	      this.insertChild(0, children[i]);
	      i--;
	    }
	    return this;
	  },
	  shiftChild: function() {
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
	  removeChild: function(child) {
	    var childFirstNode, children, index;
	    if (child == null) {
	      dc.error('child to be removed is undefined');
	    }
	    children = this.children;
	    if (isComponent(child)) {
	      index = children.indexOf(child);
	      if (index < 0) {
	        dc.error('child to be removed is not in the children');
	      }
	    } else if (child >= children.length || child < 0) {
	      dc.error('child(' + child + ') to be removed is out of range');
	    } else {
	      index = child;
	      child = children[index];
	    }
	    removeIndex(index, this.updatingIndexes);
	    child = children[index];
	    if (this.node) {
	      this.childNodes.splice(index, 1);
	      if (childFirstNode = child.firstNode) {
	        if (this.firstNodeIndex === index) {
	          this.setFirstNodeWithFollowing(index);
	        }
	        this.linkNextNode(index, childFirstNode, child.nextNode);
	      }
	      child.markRemovingDom();
	      removeIndex(index, this.attachingIndexes);
	    }
	    substractSet(this.family, child.family);
	    children.splice(index, 1);
	    if (child.holder === this) {
	      child.holder = null;
	    }
	    return child;
	  },
	  removeRange: function(start, stop) {
	    var children, index, last;
	    children = this.children;
	    last = children.length - 1;
	    index = start;
	    if (index < 0) {
	      index = 0;
	    }
	    if (stop > last) {
	      stop = last;
	    }
	    while (index <= stop) {
	      this.removeChild(index);
	      index++;
	    }
	    return this;
	  },
	  setFirstNodeWithFollowing: function(index) {
	    var children, firstNode, length;
	    children = this.children;
	    length = children.length;
	    index++;
	    while (index < length) {
	      if (firstNode = children[index].firstNode) {
	        this.childrenFirstNode = firstNode;
	        this.firstNodeIndex = index;
	        return;
	      }
	      index++;
	    }
	    this.childrenFirstNode = null;
	  },
	  replaceChild: function(oldChild, newChild) {
	    var children, index;
	    children = this.children;
	    if (isComponent(oldChild)) {
	      index = children.indexOf(oldChild);
	      if (index < 0) {
	        dc.error('oldChild to be replaced is not in the children');
	      }
	    } else {
	      if (oldChild >= children.length || oldChild < 0) {
	        dc.error('oldChild(' + oldChild + ') to be replaced is out of range');
	      }
	      index = oldChild;
	      oldChild = children[index];
	    }
	    this.emit('onReplaceChild', index, oldChild, newChild);
	    newChild = toComponent(newChild);
	    return this._replaceChild(index, oldChild, newChild);
	  },
	  _replaceChild: function(index, oldChild, newChild) {
	    var children;
	    children = this.children;
	    if (oldChild === newChild) {
	      return this;
	    }
	    children[index] = newChild;
	    if (oldChild.holder === this) {
	      oldChild.holder = null;
	    }
	    oldChild.markRemovingDom();
	    newChild.setHolder(this);
	    newChild.clearRemoving();
	    newChild.parentNode = oldChild.parentNode;
	    newChild.nextNode = oldChild.nextNode;
	    substractSet(this.family, oldChild.family);
	    extendChildFamily(this.family, newChild);
	    if (this.node) {
	      this.childNodes[index] = newChild.node;
	      if (!newChild.node || !newChild.valid) {
	        this.invalidateContent(newChild);
	      }
	      this.invalidateAttach(newChild);
	      dc.removingChildren[oldChild.dcid] = oldChild;
	      this.updateChildrenFirstNode(newChild, index);
	    }
	    return this;
	  },
	  updateChildrenFirstNode: function(newChild, index) {
	    if (this.childrenFirstNode) {
	      if (newChild.firstNode) {
	        if (index <= this.firstNodeIndex) {
	          this.childrenFirstNode = newChild.firstNode;
	          this.firstNodeIndex = index;
	        }
	      } else if (index === this.firstNodeIndex) {
	        this.setFirstNodeWithFollowing(index);
	      }
	    } else {
	      if (newChild.firstNode) {
	        this.childrenFirstNode = newChild.firstNode;
	        this.firstNodeIndex = index;
	      }
	    }
	  },
	  setChildren: function(startIndex, newChildren) {
	    var child, children, i, n, oldChildrenLength, _i, _len;
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
	    var children, last;
	    children = this.children;
	    if (newLength >= children.length) {
	      return this;
	    } else {
	      last = children.length - 1;
	      while (last >= newLength) {
	        this.removeChild(last);
	        last--;
	      }
	      return this;
	    }
	  },
	  invalidateContent: function(child) {
	    var index;
	    index = this.children.indexOf(child);
	    binaryInsert(index, this.updatingIndexes);
	    if (this.valid) {
	      this.valid = false;
	      this.holder && this.holder.invalidateContent(this);
	    }
	    return this;
	  },
	  invalidateChildren: function() {
	    var child, _i, _len, _ref2;
	    this.invalidate();
	    _ref2 = this.children;
	    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	      child = _ref2[_i];
	      child.valid = false;
	    }
	    return this;
	  },
	  attachChildren: function() {
	    var childParentNode;
	    childParentNode = this.childParentNode;
	    if (!childParentNode || !this.attachValid || !this.childNodes.parentNode) {
	      this.attachValid = true;
	      if (this.isList) {
	        this.childParentNode = this.parentNode;
	        this.childrenNextNode = this.nextNode;
	      } else if (!childParentNode) {
	        this.childParentNode = this.node;
	        this.childrenNextNode = null;
	      }
	      if (this.childParentNode !== this.childNodes.parentNode) {
	        this.attachAllChildren();
	      } else {
	        this.attachInvalidChildren();
	      }
	    }
	  },
	  attachAllChildren: function() {
	    var child, children, i, length, nextNode, parentNode;
	    parentNode = this.childParentNode;
	    children = this.children;
	    if (length = children.length) {
	      nextNode = this.childrenNextNode;
	      i = length - 1;
	      while (child = children[i]) {
	        child.setHolder(this);
	        child.parentNode = parentNode;
	        child.setNextNode(nextNode);
	        child.attachParent();
	        nextNode = child.firstNode || nextNode;
	        i--;
	      }
	      child = children[0];
	      this.childNodes.parentNode = parentNode;
	    }
	  },
	  attachInvalidChildren: function() {
	    var attachingIndexes, child, children, i, listIndex, nextNode, parentNode, prevIndex;
	    attachingIndexes = this.attachingIndexes;
	    if (attachingIndexes.length) {
	      this.attachingIndexes = [];
	      if (parentNode = this.childParentNode) {
	        nextNode = this.childrenNextNode;
	        children = this.children;
	        i = attachingIndexes.length - 1;
	        prevIndex = children.length - 1;
	        while (i >= 0) {
	          listIndex = attachingIndexes[i];
	          setNextNodes(children, nextNode, prevIndex, listIndex);
	          child = children[listIndex];
	          child.setHolder(this);
	          child.parentNode = parentNode;
	          child.attachParent();
	          nextNode = child.firstNode || child.nextNode;
	          prevIndex = listIndex - 1;
	          i--;
	        }
	        setNextNodes(children, nextNode, prevIndex, 0);
	        this.childNodes.parentNode = parentNode;
	      }
	    }
	  },
	  propagateChildNextNode: function(child, nextNode) {
	    var children, index;
	    children = this.children;
	    if (isComponent(child)) {
	      index = children.indexOf(child) - 1;
	    } else {
	      index = child - 1;
	    }
	    while (child = children[index]) {
	      child.setNextNode(nextNode);
	      if (child.firstNode) {
	        return;
	      }
	      index--;
	    }
	    if (!this.isTag && this.holder) {
	      this.holder.propagateChildNextNode(this, nextNode);
	    }
	  },
	  linkNextNode: function(child, oldNode, nextNode) {
	    var children, index;
	    children = this.children;
	    if (isComponent(child)) {
	      index = children.indexOf(child) - 1;
	    } else {
	      index = child - 1;
	    }
	    while (index >= 0) {
	      child = children[index];
	      if (child.nextNode === oldNode) {
	        child.setNextNode(nextNode);
	      } else {
	        return;
	      }
	      index--;
	    }
	    if (!this.isTag && this.holder) {
	      this.holder.linkNextNode(this, oldNode, nextNode);
	    }
	  }
	};


/***/ },
/* 29 */
/*!***********************************!*\
  !*** ./src/core/base/Func.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var Func, TransformComponent, funcString, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	TransformComponent = __webpack_require__(/*! ./TransformComponent */ 16);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

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
	    return (new Func(this.func)).copyEventListeners(this);
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
/* 30 */
/*!**********************************!*\
  !*** ./src/core/base/Tag.coffee ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, ListMixin, Tag, addEventListenerMap, addHandlerToCallbackArray, attrToPropName, binaryInsert, cacheElement, classFn, cloneObject, createElement, dc, directiveRegistry, domEventHandler, domField, domValue, extend, flow, funcString, mixin, newLine, react, refreshComponents, styleFrom, toComponentArray, _ref, _ref1, _ref2, _ref3, _ref4,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __slice = [].slice;

	extend = __webpack_require__(/*! extend */ 3);

	refreshComponents = (dc = __webpack_require__(/*! ../../dc */ 2)).refreshComponents;

	_ref = __webpack_require__(/*! ../../dom-util */ 5), domField = _ref.domField, domValue = _ref.domValue;

	directiveRegistry = __webpack_require__(/*! ../../dc */ 2).directiveRegistry;

	classFn = __webpack_require__(/*! ../property/classFn */ 23);

	styleFrom = __webpack_require__(/*! ../property/style */ 25).styleFrom;

	attrToPropName = __webpack_require__(/*! ../property/attrs */ 22).attrToPropName;

	_ref1 = __webpack_require__(/*! ../property/events */ 24), domEventHandler = _ref1.domEventHandler, addEventListenerMap = _ref1.addEventListenerMap, addHandlerToCallbackArray = _ref1.addHandlerToCallbackArray;

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	_ref2 = __webpack_require__(/*! dc-util */ 1), funcString = _ref2.funcString, newLine = _ref2.newLine, cloneObject = _ref2.cloneObject;

	_ref3 = __webpack_require__(/*! lazy-flow */ 6), flow = _ref3.flow, react = _ref3.react;

	toComponentArray = __webpack_require__(/*! ./toComponentArray */ 27);

	binaryInsert = __webpack_require__(/*! dc-util */ 1).binaryInsert;

	_ref4 = __webpack_require__(/*! dc-util/element-pool */ 31), createElement = _ref4.createElement, cacheElement = _ref4.cacheElement;

	module.exports = Tag = (function(_super) {
	  __extends(Tag, _super);

	  Tag.prototype.FakeTag = function() {
	    return Tag;
	  };

	  function Tag(tagName, attrs, children) {
	    if (attrs == null) {
	      attrs = {};
	    }
	    if (!(this instanceof Tag)) {
	      throw 'should use new SubclassComponent(...) with the subclass of Tag';
	    }
	    Tag.__super__.constructor.call(this);
	    this.isTag = true;
	    tagName = tagName || attrs.tagName || 'div';
	    delete attrs.tagName;
	    this.tagName = tagName.toLowerCase();
	    this.namespace = attrs.namespace;
	    this.poolLabel = this.generatePoolLabel();
	    this.children = toComponentArray(children);
	    this.initListMixin();
	    this.initProperties();
	    this.extendAttrs(attrs);
	    return;
	  }

	  Tag.prototype.initProperties = function() {
	    var className, me;
	    this.hasActiveProperties = false;
	    this.cacheClassName = "";
	    this.className = className = classFn();
	    me = this;
	    this.className.onInvalidate(function() {
	      if (className.valid) {
	        me.hasActiveProperties = true;
	        return me.invalidate();
	      }
	    });
	    this.hasActiveProps = false;
	    this.cacheProps = {};
	    this.props = {};
	    this.boundProps = {};
	    this['invalidateProps'] = {};
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
	    if (!this.domEventCallbackMap) {
	      this.domEventCallbackMap = {};
	    }
	    this.eventUpdateConfig = {};
	  };

	  Tag.prototype.extendAttrs = function(attrs) {
	    var className, generator, handler, key, nodeAttrs, props, style, styles, v, v0, value, _i, _j, _len, _len1, _ref5;
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
	        this.hasActiveProperties = true;
	        className.extend(value);
	      } else if (key.slice(0, 2) === 'on') {
	        if (!value) {
	          continue;
	        } else if (typeof value === 'function') {
	          this.bindOne(key, value);
	        } else {
	          v0 = value[0];
	          if (v0 === 'before' || v0 === 'after') {
	            _ref5 = value.slice(1);
	            for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
	              v = _ref5[_i];
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
	      } else if (key.slice(0, 3) === 'xxx') {
	        continue;
	      } else {
	        this.setProp(key, value, props, 'Props');
	      }
	    }
	    return this;
	  };

	  Tag.prototype.restoreCacheProperties = function() {
	    var key, nodeAttrs, props, style, value, _ref5, _ref6, _ref7;
	    style = this.style, props = this.props, nodeAttrs = this.nodeAttrs;
	    this.hasActiveProperties = true;
	    if (this.className) {
	      this.hasActiveProperties = true;
	      this.cacheClassName = '';
	      this.className.valid = false;
	    }
	    _ref5 = this.cachePropes;
	    for (key in _ref5) {
	      value = _ref5[key];
	      if (props[key] == null) {
	        this.hasActiveProps = true;
	        props[key] = value;
	      }
	    }
	    _ref6 = this.cacheStyle;
	    for (key in _ref6) {
	      value = _ref6[key];
	      if (style[key] == null) {
	        this.hasActiveStyle = true;
	        style[key] = value;
	      }
	    }
	    _ref7 = this.nodeAttrs;
	    for (key in _ref7) {
	      value = _ref7[key];
	      if (nodeAttrs[key] == null) {
	        this.hasActiveNodeAttrs = true;
	        nodeAttrs[key] = value;
	      }
	    }
	    this.hasActiveDomEvents = true;
	    return this;
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

	  Tag.prototype.attr = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._prop(args, this.nodeAttrs, 'NodeAttrs');
	  };

	  Tag.prototype._prop = function(args, props, type) {
	    var key, prop, v;
	    if (args.length === 0) {
	      return props;
	    }
	    if (args.length === 1) {
	      prop = args[0];
	      if (typeof prop === 'string') {
	        if (props.hasOwnProperty(prop)) {
	          return domValue(props[prop], this);
	        } else {
	          return this['cache' + type][prop];
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
	    value = domField(value, this);
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

	  Tag.prototype.propBind = function(prop) {
	    return this._propBind(prop, this.props, 'Props');
	  };

	  Tag.prototype.cssBind = function(prop) {
	    return this._propBind(prop, this.style, 'Style');
	  };

	  Tag.prototype.attrBind = function(prop) {
	    return this._propBind(prop, this.nodeAttrs, 'NodeAttrs');
	  };

	  Tag.prototype._propBind = function(prop, props, type) {
	    var bound, boundProps;
	    boundProps = this['bound' + type];
	    if (bound = boundProps[prop]) {
	      return bound;
	    } else {
	      return boundProps[prop] = react(function() {
	        return this._prop([prop], props, type);
	      });
	    }
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
	    var eventName, isBefore, _i, _len, _ref5;
	    if (!this.domEventCallbackMap) {
	      this.domEventCallbackMap = {};
	    }
	    if (arguments.length === 1) {
	      for (eventName in eventNames) {
	        handler = eventNames[eventName];
	        this.bind(eventName, handler);
	      }
	    } else {
	      _ref5 = eventNames.split(/\s*:\s*/), eventNames = _ref5[0], isBefore = _ref5[1];
	      eventNames = eventNames.split(/\s+/);
	      for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	        eventName = eventNames[_i];
	        this.bindOne(eventName, handler, before || isBefore);
	      }
	    }
	    return this;
	  };

	  Tag.prototype.bindOne = function(eventName, handler, before) {
	    var domEventCallbackMap, domEventCallbacks;
	    if (!handler) {
	      dc.error('Tag.bind: handler is undefined for event: ' + eventName);
	    }
	    if (eventName.slice(0, 2) !== 'on') {
	      eventName = 'on' + eventName;
	    }
	    domEventCallbackMap = this.domEventCallbackMap || (this.domEventCallbackMap = {});
	    domEventCallbacks = domEventCallbackMap[eventName] || (domEventCallbackMap[eventName] = []);
	    if (this.node) {
	      if (addEventListenerMap[eventName]) {
	        node.addEventListener(eventName.slice(2), domEventHandler);
	      } else {
	        this.node[eventName] = domEventHandler;
	      }
	    } else {
	      this.hasActiveDomEvents = true;
	      this.hasActiveProperties = true;
	    }
	    addHandlerToCallbackArray(handler, domEventCallbacks, before);
	    return this;
	  };

	  Tag.prototype.unbind = function(eventNames, handler) {
	    var domEventCallbackMap, domEventCallbacks, eventName, index, node, _i, _len;
	    eventNames = eventNames.split('\s+');
	    domEventCallbackMap = this.domEventCallbackMap;
	    for (_i = 0, _len = eventNames.length; _i < _len; _i++) {
	      eventName = eventNames[_i];
	      if (eventName.slice(0, 2) !== 'on') {
	        eventName = 'on' + eventName;
	      }
	      domEventCallbacks = domEventCallbackMap[eventName];
	      if (!domEventCallbacks) {
	        continue;
	      }
	      index = domEventCallbacks.indexOf(handler);
	      if (index >= 0) {
	        domEventCallbacks.splice(index, 1);
	        if (!domEventCallbacks.length) {
	          domEventCallbackMap[eventName] = null;
	          if (node = this.node) {
	            node[prop] = null;
	            node.removeEventListener(domEventHandler);
	          }
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
	    var items, _ref5;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref5 = this.className).removeClass.apply(_ref5, items);
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
	    return this;
	  };

	  Tag.prototype.showHide = function(status, test, display) {
	    var fn, me, method, oldDisplay, style;
	    style = this.style;
	    test = domField(test, this);
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

	  Tag.prototype.refreshDom = function(oldBaseComponent) {
	    this.renderDom(oldBaseComponent);
	    this.attachParent();
	  };

	  Tag.prototype.createDom = function() {
	    var node;
	    this.valid = true;
	    this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
	    node.component = this;
	    this.updateProperties();
	    this.createChildrenDom();
	    this.attachChildren();
	    return node;
	  };

	  Tag.prototype.updateDom = function() {
	    var child, namespace, node, _i, _len, _ref5;
	    this.valid = true;
	    namespace = this.namespace || "http://www.w3.org/1999/xhtml";
	    if (this.tagName !== this.node.tagName.toLowerCase() || namespace !== this.node.namespaceURI) {
	      node = this.node;
	      node.parentNode && node.parentNode.removeChild(node);
	      this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
	      node.component = this;
	      this.childParentNode = null;
	      this.restoreCacheProperties();
	      this.updateProperties();
	      this.createChildrenDom();
	      this.holder.invalidateAttach(this);
	      _ref5 = this.children;
	      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
	        child = _ref5[_i];
	        child.resetAttach();
	      }
	      this.attachChildren();
	      this.holder.propagateChildNextNode(this, node);
	      return node;
	    } else {
	      this.updateProperties();
	      this.updateChildrenDom();
	      this.attachChildren();
	      return this.node;
	    }
	  };

	  Tag.prototype.invalidateAttach = function(child) {
	    var index;
	    index = this.children.indexOf(child);
	    binaryInsert(index, this.attachingIndexes);
	    this.attachValid = false;
	    if (this.valid) {
	      this.valid = false;
	      this.holder && this.holder.invalidateContent(this);
	    }
	    return this;
	  };

	  Tag.prototype.updateProperties = function() {
	    var cacheNodeAttrs, cacheProps, cacheStyle, callbackList, className, classValue, elementStyle, eventName, node, nodeAttrs, prop, props, style, value, _ref5;
	    if (!this.hasActiveProperties) {
	      return;
	    }
	    this.hasActiveProperties = false;
	    node = this.node, className = this.className;
	    if (!className.valid) {
	      classValue = className.call(this);
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
	        value = domValue(value, this);
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
	        value = domValue(value, this);
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
	        value = domValue(value, this);
	        cacheStyle[prop] = elementStyle[prop] = value;
	      }
	    }
	    if (this.hasActiveDomEvents) {
	      _ref5 = this.domEventCallbackMap;
	      for (eventName in _ref5) {
	        callbackList = _ref5[eventName];
	        if (callbackList && callbackList.length) {
	          if (addEventListenerMap[eventName]) {
	            node.addEventListener(eventName.slice(2), domEventHandler);
	          } else {
	            node[eventName] = domEventHandler;
	          }
	        }
	      }
	    }
	    this.hasActiveDomEvents = false;
	  };

	  Tag.prototype.setPoolLabel = function(poolLabel) {
	    this.poolLabel = poolLabel;
	    return this;
	  };

	  Tag.prototype.generatePoolLabel = function() {
	    return '';
	  };

	  Tag.prototype.destroy = function() {
	    var node;
	    if (this.poolLabel && (node = this.node)) {
	      cacheElement(node, this.poolLabel);
	    }
	    Tag.__super__.destroy.call(this);
	    if (this.poolLabel && node) {
	      node.innerHTML = '';
	    }
	    return this;
	  };

	  Tag.prototype.clone = function(options) {
	    var FakeTag, attrs, domEventCallbacks, eventName, result, _ref5;
	    attrs = {
	      className: this.className.clone(),
	      style: extend({}, this.cacheStyle, this.style)
	    };
	    extend(attrs, this.cacheProps, this.props, this.cacheNodeAttrs, this.nodeAttrs);
	    _ref5 = this.domEventCallbackMap;
	    for (eventName in _ref5) {
	      domEventCallbacks = _ref5[eventName];
	      attrs[eventName] = domEventCallbacks.slice(0);
	    }
	    FakeTag = this.FakeTag();
	    result = new FakeTag(this.tagName, attrs, []);
	    result.__proto__ = this.__proto__;
	    result.constructor = this.constructor;
	    result.cloneChildrenFrom(this, options);
	    result.copyEventListeners(this);
	    return result.setupCloneComponent(this, options);
	  };

	  Tag.prototype.setupCloneComponent = function(srcTag, options) {
	    return this.setReactive();
	  };

	  Tag.prototype.toString = function(indent, addNewLine) {
	    var child, children, key, s, v, value, _i, _len, _ref5, _ref6, _ref7;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine("<" + this.tagName, indent, addNewLine);
	    _ref5 = this.props;
	    for (key in _ref5) {
	      value = _ref5[key];
	      s += ' ' + key + '=' + funcString(value);
	    }
	    if (this.hasActiveStyle) {
	      s += ' style={';
	      _ref6 = this.style;
	      for (key in _ref6) {
	        value = _ref6[key];
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
	      _ref7 = this.children;
	      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
	        child = _ref7[_i];
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

	mixin = __webpack_require__(/*! dc-util */ 1).mixin;

	ListMixin = __webpack_require__(/*! ./ListMixin */ 28);

	mixin(Tag.prototype, ListMixin);


/***/ },
/* 31 */
/*!**************************************!*\
  !*** ../dc-util/element-pool.coffee ***!
  \**************************************/
/***/ function(module, exports) {

	var elementPool, nodeCount, nodeCountMax, poolLabelLimit;

	elementPool = {};

	nodeCount = 0;

	nodeCountMax = 500;

	poolLabelLimit = {};

	exports.createElement = function(namespace, tagName, poolLabel) {
	  var label, node, nodes;
	  if (namespace == null) {
	    namespace = '';
	  }
	  if (tagName == null) {
	    tagName = 'div';
	  }
	  if (poolLabel) {
	    label = tagName + ':' + poolLabel;
	    if (nodes = elementPool[label]) {
	      node = nodes.pop();
	      nodeCount--;
	      return node;
	    }
	  }
	  if (namespace) {
	    return document.createElementNS(namespace || '', tagName);
	  } else {
	    return document.createElement(tagName);
	  }
	};

	exports.cacheElement = function(element, poolLabel) {
	  var label, labelMax, nodes;
	  if (nodeCount < nodeCountMax) {
	    label = element.tagName.toLowerCase() + ':' + poolLabel;
	    labelMax = poolLabelLimit[label] || 10;
	    nodes = elementPool[label] || (elementPool[label] = []);
	    if (nodes.length < labelMax) {
	      nodes.push(element);
	      return nodeCount++;
	    }
	  }
	};


/***/ },
/* 32 */
/*!**************************************!*\
  !*** ./src/core/base/Comment.coffee ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Comment, Text, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	Text = __webpack_require__(/*! ./Text */ 21);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(/*! ../../dom-util */ 5).domValue;

	module.exports = Comment = (function(_super) {
	  __extends(Comment, _super);

	  function Comment(text) {
	    Comment.__super__.constructor.call(this, text);
	  }

	  Comment.prototype.createDom = function() {
	    var node, text;
	    this.valid = true;
	    text = domValue(this.text, this);
	    node = document.createComment(text);
	    this.node = this.firstNode = node;
	    this.cacheText = text;
	    return this.node;
	  };

	  Comment.prototype.updateDom = function() {
	    var node, parentNode, text;
	    this.valid = true;
	    text = domValue(this.text, this);
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
/* 33 */
/*!************************************!*\
  !*** ./src/core/base/Cdata.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Cdata, Text, domValue, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(/*! ./BaseComponent */ 20);

	Text = __webpack_require__(/*! ./Text */ 21);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine;

	domValue = __webpack_require__(/*! ../../dom-util */ 5).domValue;

	module.exports = Cdata = (function(_super) {
	  __extends(Cdata, _super);

	  function Cdata(text) {
	    Cdata.__super__.constructor.call(this, text);
	  }


	  /*
	    this operation is not supported in html document
	   */

	  Cdata.prototype.createDom = function() {
	    this.node = document.createCDATASection(domValue(this.text, this));
	    return this.node;
	  };

	  Cdata.prototype.updateDom = function() {
	    this.text && (this.node.data = domValue(this.text, this));
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
/* 34 */
/*!***********************************!*\
  !*** ./src/core/base/Html.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var Html, HtmlMixin, ListMixin, Tag, createElement, domField, domValue, extend, funcString, method, mixin, newLine, setText, _fn, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Tag = __webpack_require__(/*! ./Tag */ 30);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine, mixin = _ref.mixin;

	_ref1 = __webpack_require__(/*! ../../dom-util */ 5), domValue = _ref1.domValue, domField = _ref1.domField;

	setText = __webpack_require__(/*! ../property/attrs */ 22).setText;

	createElement = __webpack_require__(/*! dc-util/element-pool */ 31).createElement;

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
	  setText: setText,
	  initHtmlComponent: function(text, transform) {
	    var get, me, set;
	    this.transform = transform;
	    this.setText(text);
	    if (Object.defineProperty) {
	      me = this;
	      get = function() {
	        return me._text;
	      };
	      set = function(text) {
	        me.setText(text);
	        return text;
	      };
	      return Object.defineProperty(this, 'text', {
	        get: get,
	        set: set
	      });
	    }
	  },
	  initListMixin: function() {},
	  attachChildren: function() {},
	  createDom: function() {
	    var node, text;
	    this.valid = true;
	    this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
	    node.component = this;
	    this.updateProperties();
	    text = domValue(this._text, this);
	    if (this.transform) {
	      text = this.transform(text);
	    }
	    this.cacheText = node.innerHTML = text;
	    return this;
	  },
	  updateDom: function() {
	    var namespace, node, text;
	    this.valid = true;
	    text = domValue(this._text, this);
	    if (this.transform) {
	      text = this.transform(text);
	    }
	    node = this.node;
	    namespace = this.namespace || "http://www.w3.org/1999/xhtml";
	    if (this.tagName !== this.node.tagName.toLowerCase() || namespace !== this.node.namespaceURI) {
	      node = this.node;
	      node.parentNode && node.parentNode.removeChild(node);
	      this.node = this.firstNode = node = createElement(this.namespace, this.tagName, this.poolLabel);
	      node.component = this;
	      node.innerHTML = this.cacheText = text;
	      this.holder.invalidateAttach(this);
	      this.restoreCacheProperties();
	    } else if (text !== this.cacheText) {
	      if (node.childNodes.length >= 2) {
	        if (node.parentNode) {
	          this.removeNode();
	        }
	        this.node = this.firstNode = node = node.cloneNode(false);
	        node.component = this;
	      }
	      node.innerHTML = text;
	      this.cacheText = text;
	    }
	    this.updateProperties();
	    return this;
	  }
	};

	ListMixin = __webpack_require__(/*! ./ListMixin */ 28);

	_fn = function(method) {
	  return Html.prototype[method] = function() {
	    return dc.error("Html component has no children components, do not call ListMixin method(" + method + ") on it");
	  };
	};
	for (method in ListMixin) {
	  _fn(method);
	}

	extend = __webpack_require__(/*! extend */ 3);

	extend(Html.prototype, HtmlMixin);


/***/ },
/* 35 */
/*!********************************************!*\
  !*** ./src/core/base/TestComponent.coffee ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var ObjectDefineProperty, TestComponent, TransformComponent, funcString, intersect, newLine, renew, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	TransformComponent = __webpack_require__(/*! ./TransformComponent */ 16);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

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
/* 36 */
/*!*********************************!*\
  !*** ./src/core/base/If.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var If, ObjectDefineProperty, TestComponent, funcString, intersect, mergeIf, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	TestComponent = __webpack_require__(/*! ./TestComponent */ 35);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

	mergeIf = __webpack_require__(/*! ../mergeIf */ 37);

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
/* 37 */
/*!*********************************!*\
  !*** ./src/core/mergeIf.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var List, Nothing, Tag, domEventHandlerFromArray, emptyEventCallback, exports, extend, flow, flowIf, mergeIf, mergeIfChild, mergeIfChildren, mergeIfClassFn, mergeIfEvents, mergeIfProps;

	extend = __webpack_require__(/*! extend */ 3);

	Tag = __webpack_require__(/*! ./base/Tag */ 30);

	List = __webpack_require__(/*! ./base/List */ 26);

	Nothing = __webpack_require__(/*! ./base/Nothing */ 19);

	domEventHandlerFromArray = __webpack_require__(/*! ./property/events */ 24).domEventHandlerFromArray;

	flow = __webpack_require__(/*! lazy-flow/addon */ 9);

	flowIf = flow.if_;

	exports = module.exports = mergeIf = function(test, then_, else_, recursive) {
	  var If, children, className, component, elseTransform, events, props, style, thenTransform, transform;
	  If = __webpack_require__(/*! ./base/If */ 36);
	  if (then_ === else_) {
	    return then_;
	  } else if (then_.constructor === Tag && else_.constructor === Tag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
	    children = mergeIfChildren(test, then_, else_, recursive);
	    component = new Tag(then_.tagName, {}, children);
	    className = mergeIfClassFn(test, then_.className, else_.className);
	    props = mergeIfProps(test, then_.props, else_.props);
	    style = mergeIfProps(test, then_.style, else_.style);
	    events = mergeIfEvents(test, then_.domEventCallbackMap, else_.domEventCallbackMap);
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
	  } else if (then_ instanceof Nothing && else_ instanceof Nothing) {
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
	    If = __webpack_require__(/*! ./base/If */ 36);
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

	mergeIfEvents = function(test, thenEventCallbackMap, elseEventCallbackMap) {
	  var elseCallbackList, elseHandler, eventName, thenCallbackList, thenHandler, unified;
	  unified = extend({}, thenEventCallbackMap, elseEventCallbackMap);
	  for (eventName in unified) {
	    if (thenCallbackList = thenEventCallbackMap[eventName]) {
	      thenHandler = domEventHandlerFromArray(thenCallbackList.slice(0));
	    } else {
	      thenHandler = emptyEventCallback;
	    }
	    if (elseCallbackList = elseEventCallbackMap[eventName]) {
	      elseHandler = domEventHandlerFromArray(elseCallbackList.slice(0));
	    } else {
	      elseHandler = emptyEventCallback;
	    }
	    unified[eventName] = function(event) {
	      if (test()) {
	        return thenHandler.call(this, event);
	      } else {
	        return elseHandler.call(this, event);
	      }
	    };
	  }
	  return unified;
	};


/***/ },
/* 38 */
/*!***********************************!*\
  !*** ./src/core/base/Case.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var Case, TestComponent, foreach, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	TestComponent = __webpack_require__(/*! ./TestComponent */ 35);

	_ref = __webpack_require__(/*! dc-util */ 1), foreach = _ref.foreach, funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

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
	    return (new Case(this.test, cloneMap, this.else_.clone())).copyEventListeners(this);
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
/*!***********************************!*\
  !*** ./src/core/base/Pick.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var Pick, TransformComponent, extend, newLine, toComponent,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	TransformComponent = __webpack_require__(/*! ./TransformComponent */ 16);

	newLine = __webpack_require__(/*! dc-util */ 1).newLine;

	extend = __webpack_require__(/*! extend */ 3);

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
/*!************************************!*\
  !*** ./src/core/base/Defer.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var Defer, FULFILL, INIT, REJECT, TransformComponent, extend, funcString, intersect, newLine, renew, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(/*! ./toComponent */ 18);

	TransformComponent = __webpack_require__(/*! ./TransformComponent */ 16);

	extend = __webpack_require__(/*! extend */ 3);

	_ref = __webpack_require__(/*! dc-util */ 1), funcString = _ref.funcString, newLine = _ref.newLine, intersect = _ref.intersect;

	renew = __webpack_require__(/*! lazy-flow */ 6).renew;

	INIT = 0;

	FULFILL = 1;

	REJECT = 2;

	module.exports = Defer = (function(_super) {
	  __extends(Defer, _super);

	  function Defer(promise, fulfill, reject, init) {
	    var family, treject;
	    this.promise = promise;
	    Defer.__super__.constructor.apply(this, arguments);
	    this.fulfill = fulfill || function(result) {
	      return result;
	    };
	    treject = reject || function(error) {
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
/*!****************************************!*\
  !*** ./src/core/property/index.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(/*! extend */ 3);

	module.exports = exports = extend({}, __webpack_require__(/*! ./attrs */ 22), __webpack_require__(/*! ./classFn */ 23), __webpack_require__(/*! ./style */ 25), __webpack_require__(/*! ./css-arith */ 42), __webpack_require__(/*! ./events */ 24), __webpack_require__(/*! ./delegate-event */ 43));

	exports.classFn = __webpack_require__(/*! ./classFn */ 23);


/***/ },
/* 42 */
/*!********************************************!*\
  !*** ./src/core/property/css-arith.coffee ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var Tag, reNonUnit, unitAdd, unitDiv, unitMul, unitSub;

	Tag = __webpack_require__(/*! ../base/Tag */ 30);

	reNonUnit = /[\d\s\.-]/g;

	exports.unitAdd = unitAdd = function(x, y) {
	  var num;
	  num = parseFloat(x);
	  if (isNaN(num)) {
	    console.log('wrong type in unitAdd(prop, value)');
	  }
	  return num + parseFloat(y) + x.replace(reNonUnit, '');
	};

	exports.unitSub = unitSub = function(x, y) {
	  var num;
	  num = parseFloat(x);
	  if (isNaN(num)) {
	    console.log('wrong type in unitSub(prop, value)');
	  }
	  return num - parseFloat(y) + x.replace(reNonUnit, '');
	};

	exports.unitMul = unitMul = function(x, y) {
	  var num;
	  num = parseFloat(x);
	  if (isNaN(num)) {
	    console.log('wrong type in unitMul(prop, value)');
	  }
	  return num * parseFloat(y) + x.replace(reNonUnit, '');
	};

	exports.unitDiv = unitDiv = function(x, y) {
	  var num;
	  num = parseFloat(x);
	  if (isNaN(num)) {
	    console.log('wrong type in unitDiv(prop, value)');
	  }
	  return num / parseFloat(y) + x.replace(reNonUnit, '');
	};

	Tag.prototype.cssAdd = function(prop, value) {
	  var v;
	  v = unitAdd(this.css(prop), value);
	  return this.css(prop, v);
	};

	Tag.prototype.cssSub = function(prop, value) {
	  return this.css(prop, unitSub(this.css(prop), value));
	};

	Tag.prototype.cssMul = function(prop, value) {
	  return this.css(prop, unitMul(this.css(prop), value));
	};

	Tag.prototype.cssDiv = function(prop, value) {
	  return this.css(prop, unitDiv(this.css(prop), value));
	};


/***/ },
/* 43 */
/*!*************************************************!*\
  !*** ./src/core/property/delegate-event.coffee ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Tag, delegateToComponentHandler, delegateToHolderHandler, delegateToMethodHandler;

	Tag = __webpack_require__(/*! ../base/Tag */ 30);

	delegateToMethodHandler = function(prefix) {
	  if (prefix == null) {
	    prefix = 'do_';
	  }
	  return function(event) {
	    var targetComponent, targetNode;
	    targetNode = event.target;
	    targetComponent = targetNode.component;
	    return targetComponent[prefix + event.type](event);
	  };
	};

	delegateToHolderHandler = function(prefix) {
	  return function(event) {
	    var handler, method, targetComponent, targetNode;
	    targetNode = event.target;
	    targetComponent = targetNode.component;
	    method = prefix + event.type;
	    while (targetComponent) {
	      handler = targetComponent[method];
	      if (handler) {
	        handler.call(targetComponent, event);
	        if (event.continueDelegating) {
	          targetComponent = targetComponent.holder;
	        } else {
	          break;
	        }
	      } else {
	        targetComponent = targetComponent.holder;
	      }
	    }
	  };
	};

	delegateToComponentHandler = function(component, prefix) {
	  return function(event) {
	    var handler;
	    if (handler = component[prefix + event.type]) {
	      handler.call(component, event);
	    }
	  };
	};

	Tag.prototype.delegate = function(events, delegationHandler) {
	  if (typeof delegationHandler !== 'function') {
	    delegationHandler = delegateToMethodHandler(delegationHandler);
	  }
	  return this.bind(events, delegationHandler);
	};

	Tag.prototype.delegateToHolder = function(events, prefix) {
	  var delegationHandler;
	  if (prefix == null) {
	    prefix = 'do_';
	  }
	  delegationHandler = delegateToHolderHandler(prefix);
	  return this.bind(events, delegationHandler);
	};

	Tag.prototype.delegateToComponent = function(events, component, prefix) {
	  var delegationHandler;
	  if (prefix == null) {
	    prefix = 'do_';
	  }
	  delegationHandler = delegateToComponentHandler(component, prefix);
	  return this.bind(events, delegationHandler);
	};


/***/ },
/* 44 */
/*!*****************************!*\
  !*** ./src/core/tag.coffee ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var extend, getBindProp, input, inputTypes, isAttrs, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1,
	  __slice = [].slice;

	extend = __webpack_require__(/*! extend */ 3);

	_ref = __webpack_require__(/*! ./instantiate */ 13), tag = _ref.tag, isAttrs = _ref.isAttrs;

	getBindProp = __webpack_require__(/*! ../dom-util */ 5).getBindProp;

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
	      component.bind('onchange', (function(event, node) {
	        return value.call(this, node.value);
	      }), 'before');
	    }
	  }
	  return component;
	};

	_ref1 = 'text checkbox radio date email tel number'.split(' ');
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
	for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	  type = _ref1[_j];
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
	        component.bind('onchange', (function(event, node) {
	          return value.call(this, node.value);
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
	        component.bind('onchange', (function(event, node) {
	          return attrs.call(this, node.value);
	        }), 'before');
	      }
	    } else {
	      component = tag('textarea');
	    }
	  }
	  return component;
	};


/***/ },
/* 45 */
/*!******************************!*\
  !*** ./src/core/each.coffee ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var List, Tag, defaultItemFunction, each, every, getEachArgs, isArray, isEachObjectSystemKey, isObject, toComponent, watchItems, _each, _ref, _ref1, _ref2,
	  __slice = [].slice;

	_ref = __webpack_require__(/*! ./base */ 14), List = _ref.List, Tag = _ref.Tag, toComponent = _ref.toComponent;

	_ref1 = __webpack_require__(/*! dc-util */ 1), isArray = _ref1.isArray, isObject = _ref1.isObject;

	_ref2 = __webpack_require__(/*! dc-watch-list */ 10), watchItems = _ref2.watchItems, isEachObjectSystemKey = _ref2.isEachObjectSystemKey;

	defaultItemFunction = function(item) {
	  return item;
	};

	_each = function(attrs, items, options) {
	  var EachClass, children, getItemComponent, i, item, key, keyChildMap, listComponent, _i, _len;
	  if (attrs) {
	    EachClass = attrs.EachClass || Tag;
	    delete attrs.EachClass;
	    listComponent = new EachClass(null, attrs, []);
	  } else {
	    EachClass = items.EachClass || List;
	    listComponent = new EachClass([]);
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
	      itemComponent = toComponent(listComponent.itemFunc(value, key, itemIndex, items, listComponent));
	      if (listComponent.separatorFunc && itemIndex) {
	        separatorComponent = toComponent(listComponent.separatorFunc(itemIndex, value, key, items, listComponent));
	        itemComponent = new List([separatorComponent, itemComponent]);
	      }
	      itemComponent.$watchingKey = key;
	      itemComponent.itemIndex = itemIndex;
	      return itemComponent;
	    };
	  }
	  children = [];
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
	  return listComponent.setChildren(0, children);
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

	exports.funcEach = function(attrs, itemsFunc, options) {
	  var EachClass, component, items, updateItemsCallback;
	  if (typeof attrs === 'function') {
	    options = itemsFunc;
	    itemsFunc = attrs;
	    attrs = null;
	    EachClass = itemsFunc.EachClass;
	  }
	  items = itemsFunc();
	  if (isArray(items)) {
	    items = items.slice(0);
	  } else {
	    items = extend({}, items);
	  }
	  if (EachClass) {
	    items.EachClass = EachClass;
	  }
	  component = each(attrs, items, options);
	  updateItemsCallback = function() {
	    var newItems;
	    newItems = itemsFunc();
	    return items.replaceAll(newItems);
	  };
	  if (itemsFunc.onInvalidate) {
	    itemsFunc.onInvalidate(updateItemsCallback);
	  } else {
	    component.on('willRenderDom', function() {
	      if (component.node) {
	        return updateItemsCallback();
	      }
	    });
	    component.on('didRenderDom', function() {
	      return component.invalidate();
	    });
	  }
	  return component;
	};


/***/ },
/* 46 */
/*!*****************************!*\
  !*** ./src/dc-error.coffee ***!
  \*****************************/
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
	    if (component) {
	      console.log(component);
	      console.log(message);
	    } else {
	      console.log(message);
	    }
	    throw new Error(message + ':\n' + stacktraceMessage());
	  }
	};


/***/ },
/* 47 */
/*!*************************************!*\
  !*** ./src/directives/index.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var $hide, $show, _ref;

	exports.$model = __webpack_require__(/*! ./model */ 48);

	exports.$bind = __webpack_require__(/*! ./bind */ 49);

	_ref = __webpack_require__(/*! ./show-hide */ 50), $show = _ref.$show, $hide = _ref.$hide;

	exports.$show = $show;

	exports.$hide = $hide;

	exports.$options = __webpack_require__(/*! ./options */ 51);


/***/ },
/* 48 */
/*!*************************************!*\
  !*** ./src/directives/model.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var getBindProp;

	getBindProp = __webpack_require__(/*! ../dom-util */ 5).getBindProp;

	module.exports = function(binding, eventName) {
	  return function(comp) {
	    var bindProp, props;
	    props = comp.props;
	    bindProp = getBindProp(comp);
	    comp.setProp(bindProp, binding, props, 'Props');
	    comp.bind(eventName || 'onchange', (function(event, node) {
	      return binding(node[bindProp]);
	    }), 'before');
	    return comp;
	  };
	};


/***/ },
/* 49 */
/*!************************************!*\
  !*** ./src/directives/bind.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var getBindProp;

	getBindProp = __webpack_require__(/*! ../dom-util */ 5).getBindProp;

	module.exports = function(binding) {
	  return function(comp) {
	    comp.setProp(getBindProp(comp), binding, comp.props, 'Props');
	    return comp;
	  };
	};


/***/ },
/* 50 */
/*!*****************************************!*\
  !*** ./src/directives/show-hide.coffee ***!
  \*****************************************/
/***/ function(module, exports) {

	
	/* @param test - paramenter expression for directive
	 */
	var showHide;

	showHide = function(showing) {
	  return function(test, display) {
	    return function(comp) {
	      comp.showHide(showing, test, display);
	      return comp;
	    };
	  };
	};

	exports.$show = showHide(true);

	exports.$hide = showHide(false);


/***/ },
/* 51 */
/*!***************************************!*\
  !*** ./src/directives/options.coffee ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var Tag, option, txt;

	txt = __webpack_require__(/*! ../core/instantiate */ 13).txt;

	option = __webpack_require__(/*! ../core/tag */ 44).option;

	Tag = __webpack_require__(/*! ../core/base/Tag */ 30);

	module.exports = function(items, attrs) {
	  return function(comp) {
	    var item, options, _i, _len;
	    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
	      throw new Error('options should be only used in select tag');
	    }
	    options = [];
	    if (items) {
	      for (_i = 0, _len = items.length; _i < _len; _i++) {
	        item = items[_i];
	        options.push(option(attrs, [txt(item)]));
	      }
	    }
	    return comp.setChildren(0, options);
	  };
	};


/***/ }
/******/ ]);