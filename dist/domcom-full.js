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

	__webpack_require__(1);

	__webpack_require__(30);

	module.exports = dc;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var dc, extend;

	window.dc = module.exports = dc = __webpack_require__(2);

	dc.extend = extend = __webpack_require__(6);

	extend(dc, __webpack_require__(5), __webpack_require__(13), __webpack_require__(4), __webpack_require__(29), __webpack_require__(21));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/** @api dc(element) - dc component constructor
	 *
	 * @param element
	 */
	var Component, DomNode, componentCache, dc, globalDcId, querySelector, readyFnList, render, renderLoop, requestAnimationFrame;

	DomNode = __webpack_require__(3);

	Component = __webpack_require__(5).Component;

	requestAnimationFrame = __webpack_require__(13).requestAnimationFrame;

	componentCache = {};

	readyFnList = [];

	globalDcId = 1;

	module.exports = dc = function(element, options) {
	  if (options == null) {
	    options = {};
	  }
	  if (typeof element === 'string') {
	    if (options.noCache) {
	      return querySelector(element, options.all);
	    } else {
	      return componentCache[element] || (componentCache[element] = querySelector(element, options.all));
	    }
	  } else if (element instanceof Node) {
	    if (options.noCache) {
	      return new DomNode(element);
	    } else {
	      if (element.dcId) {
	        return componentCache[element.dcId];
	      } else {
	        element.dcId = globalDcId++;
	        return componentCache[element.dcId] = new DomNode(element);
	      }
	    }
	  } else if (element instanceof DomNode) {
	    return element;
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

	dc.ready = function(fn) {
	  return readyFnList.push(fn);
	};

	dc.onReady = function() {
	  var fn, _i, _len;
	  for (_i = 0, _len = readyFnList.length; _i < _len; _i++) {
	    fn = readyFnList[_i];
	    fn();
	  }
	};

	dc.render = render = function() {
	  var comp, _i, _len, _results;
	  _results = [];
	  for (_i = 0, _len = rootComponents.length; _i < _len; _i++) {
	    comp = rootComponents[_i];
	    _results.push(comp.update());
	  }
	  return _results;
	};

	dc.renderLoop = renderLoop = function() {
	  requestAnimFrame(renderLoop);
	  render();
	};

	document.dcId = globalDcId;

	window.$document = componentCache[globalDcId] = new DomNode(document);

	globalDcId++;

	document.body.dcId = globalDcId;

	window.$body = componentCache[globalDcId] = new DomNode(document.body);

	globalDcId++;

	document.addEventListener('DOMContentLoaded', dc.onReady, false);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var DomNode, newLine, processProp;

	newLine = __webpack_require__(4).newLine;

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
	      this.cacheProps = Object.create(null);
	      this.cacheStyle = Object.create(null);
	    } else {
	      this.cacheProps = (function() {
	        var _i, _len, _ref, _results;
	        _ref = this.node;
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          n = _ref[_i];
	          _results.push(Object.create(null));
	        }
	        return _results;
	      }).call(this);
	      this.cacheStyle = (function() {
	        var _i, _len, _ref, _results;
	        _ref = this.node;
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          n = _ref[_i];
	          _results.push(Object.create(null));
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
	        node.addEventListener(name, handler);
	      } else {
	        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
	          n = node[_j];
	          n.addEventListener(name, handler);
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
	        node.removeEventListener(name, handler);
	      } else {
	        for (_j = 0, _len1 = node.length; _j < _len1; _j++) {
	          n = node[_j];
	          n.removeEventListener(name, handler);
	        }
	      }
	    }
	  };

	  DomNode.prototype.toString = function(indent, noNewLine) {
	    if (indent == null) {
	      indent = 0;
	    }
	    return newLine(indent, noNewLine) + '<DomNode>' + newLine(this.node.toString(), indent + 2) + newLine('</DomNode>', indent);
	  };

	  return DomNode;

	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	var dupStr,
	  __slice = [].slice;

	exports.isArray = function(exp) {
	  return Object.prototype.toString.call(exp) === '[object Array]';
	};

	exports.cloneObject = function(obj) {
	  var key, result;
	  result = Object.create(null);
	  for (key in obj) {
	    result[key] = obj[key];
	  }
	  return result;
	};

	exports.pairListDict = function() {
	  var i, len, list, result;
	  list = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (list.length === 1) {
	    list = list[0];
	  }
	  len = list.length;
	  i = 0;
	  result = Object.create(null);
	  while (i < len) {
	    result[list[i]] = list[i + 1];
	    i += 2;
	  }
	  return result;
	};

	exports.bound = function(model, key) {
	  return function() {
	    return model[key];
	  };
	};

	exports.duplex = function(model, key) {
	  var fn;
	  fn = function(value) {
	    if (!arguments.length) {
	      return model[key];
	    } else {
	      return model[key] = value;
	    }
	  };
	  fn.setable = true;
	  return fn;
	};

	exports.listToDict = function() {
	  var item, list, result, _i, _len;
	  list = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  if (list.length === 1) {
	    list = list[0];
	  }
	  result = Object.create(null);
	  for (_i = 0, _len = list.length; _i < _len; _i++) {
	    item = list[_i];
	    result[item] = true;
	  }
	  return result;
	};

	exports.dupStr = dupStr = function(str, n) {
	  var i, s;
	  s = '';
	  i = 0;
	  while (i++ < n) {
	    s += str;
	  }
	  return s;
	};

	exports.newLine = function(str, indent, noNewLine) {
	  if (typeof str === 'number') {
	    if (indent) {
	      return '';
	    } else {
	      return '\n' + dupStr(' ', str);
	    }
	  } else {
	    if (typeof indent === 'number') {
	      if (noNewLine) {
	        return str;
	      } else {
	        return '\n' + dupStr(' ', indent) + str;
	      }
	    } else {
	      if (indent) {
	        return str;
	      } else {
	        return '\n' + dupStr(' ', indent) + str;
	      }
	    }
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var exports, extend;

	extend = __webpack_require__(6);

	module.exports = exports = extend({}, __webpack_require__(7), __webpack_require__(27), __webpack_require__(28), __webpack_require__(20));


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
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
	    target = arguments[1] || Object.create(null);
	    i = 2;
	  } else if (typeof target !== 'object' && typeof target !== 'function' || target === null) {
	    target = Object.create(null);
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
	            clone = src && isPlainObject(src) ? src : Object.create(null);
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  isComponent: __webpack_require__(8),
	  toComponent: __webpack_require__(9),
	  Component: __webpack_require__(18),
	  BaseComponent: __webpack_require__(11),
	  Nothing: __webpack_require__(10),
	  List: __webpack_require__(17),
	  Tag: __webpack_require__(19),
	  Text: __webpack_require__(14),
	  Comment: __webpack_require__(22),
	  Html: __webpack_require__(23),
	  TransformComponent: __webpack_require__(16),
	  If: __webpack_require__(24),
	  Case: __webpack_require__(25),
	  Func: __webpack_require__(15),
	  Repeat: __webpack_require__(26)
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(x) {
	  return x && x.getBaseComponent;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Component, Text, isComponent, toComponent;

	Component = __webpack_require__(12);

	isComponent = __webpack_require__(8);

	Text = __webpack_require__(14);

	module.exports = toComponent = function(x) {
	  var Func, List, Nothing, e;
	  Nothing = __webpack_require__(10);
	  if (arguments.length !== 1) {
	    throw new Error('toComponent: wrong arguments length');
	  }
	  if (isComponent(x)) {
	    return x;
	  } else if (typeof x === 'function') {
	    Func = __webpack_require__(15);
	    return new Func(x);
	  } else if (x instanceof Array) {
	    if (x.length === 0) {
	      new Nothing();
	    }
	    if (x.length === 1) {
	      return toComponent(x[0]);
	    } else {
	      List = __webpack_require__(17);
	      return new List((function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = x.length; _i < _len; _i++) {
	          e = x[_i];
	          _results.push(toComponent(e));
	        }
	        return _results;
	      })());
	    }
	  } else if (x == null) {
	    return new Nothing();
	  } else {
	    return new Text(x);
	  }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Nothing,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(11);

	module.exports = Nothing = (function(_super) {
	  __extends(Nothing, _super);

	  function Nothing() {}

	  Nothing.prototype.firstDomNode = function() {};

	  Nothing.prototype.createDom = function() {};

	  Nothing.prototype.updateDom = function() {};

	  Nothing.prototype.clone = function() {
	    return new Nothing();
	  };

	  Nothing.prototype.toString = function(indent, noNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return '<nothing/>';
	  };

	  return Nothing;

	})(BaseComponent);


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Component, insertNode, removeNode, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(12);

	_ref = __webpack_require__(13), insertNode = _ref.insertNode, removeNode = _ref.removeNode;

	module.exports = BaseComponent = (function(_super) {
	  __extends(BaseComponent, _super);

	  function BaseComponent(options) {
	    BaseComponent.__super__.constructor.call(this, options);
	  }

	  BaseComponent.prototype.getBaseComponent = function() {
	    this.mountCallbackComponentList = this.mountCallbackList ? [this] : [];
	    this.unmountCallbackComponentList = this.unmountCallbackList ? [this] : [];
	    return this.oldBaseComponent = this;
	  };

	  BaseComponent.prototype.attachNode = function(parentNode) {
	    var container, node, self;
	    node = this.node;
	    insertNode(parentNode, node, this.nextDomNode());
	    self = this;
	    container = this.container;
	    while (container) {
	      if (self.listIndex == null) {
	        container.node = node;
	      }
	      self = container;
	      container = container.container;
	    }
	  };

	  BaseComponent.prototype.remove = function(parentNode) {
	    if (this.node) {
	      removeNode(parentNode, this.node);
	    }
	    this.executeUnmountCallback();
	    return this;
	  };

	  BaseComponent.prototype.executeMountCallback = function() {
	    var cb, component, _i, _j, _len, _len1, _ref1, _ref2;
	    _ref1 = this.mountCallbackComponentList;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      component = _ref1[_i];
	      _ref2 = component.mountCallbackList;
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        cb = _ref2[_j];
	        cb();
	      }
	    }
	  };

	  BaseComponent.prototype.executeUnmountCallback = function() {
	    var cb, component, _i, _j, _len, _len1, _ref1, _ref2;
	    _ref1 = this.unmountCallbackComponentList;
	    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	      component = _ref1[_i];
	      _ref2 = component.unmountCallbackList;
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        cb = _ref2[_j];
	        cb();
	      }
	    }
	  };

	  BaseComponent.prototype.isBaseComponent = true;

	  return BaseComponent;

	})(Component);


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Component, componentId, extend, mountList, normalizeDomElement,
	  __slice = [].slice;

	extend = __webpack_require__(6);

	normalizeDomElement = __webpack_require__(13).normalizeDomElement;

	componentId = 1;

	mountList = [];

	module.exports = Component = (function() {
	  function Component() {
	    this.listeners = {};
	    this.baseComponent = null;
	    this.parentNode = null;
	    this.node = null;
	    this.options = null;
	    this.id = componentId++;
	  }

	  Component.prototype.setOptions = function(options) {
	    this.options = options;
	    return this;
	  };

	  Component.prototype.beforeMount = function() {
	    var cbs, fns;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.mountCallbackList = cbs = this.mountCallbackList || [];
	    cbs.push.apply(cbs, fns);
	    return this;
	  };

	  Component.prototype.unbindBeforeMount = function() {
	    var cbs, fn, fns, _i, _len;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    cbs = this.mountCallbackList;
	    for (_i = 0, _len = cbs.length; _i < _len; _i++) {
	      fn = cbs[_i];
	      if (cbs.indexOf(fn) === -1) {
	        continue;
	      } else {
	        cbs.splice(index, 1);
	      }
	    }
	    if (!cbs.length) {
	      this.mountCallbackList = null;
	      if (this.baseComponent instanceof LifeTimeEvent) {
	        this.baseComponent = null;
	      }
	    }
	    return this;
	  };

	  Component.prototype.afterUnmount = function() {
	    var cbs, fns;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.unmountCallbackList = cbs = this.unmountCallbackList || [];
	    cbs.push.apply(cbs, fns);
	    return this;
	  };

	  Component.prototype.unbindAfterUnmount = function() {
	    var cbs, fn, fns, _i, _len;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    cbs = this.unmountCallbackList;
	    for (_i = 0, _len = cbs.length; _i < _len; _i++) {
	      fn = cbs[_i];
	      if (cbs.indexOf(fn) === -1) {
	        continue;
	      } else {
	        cbs.splice(index, 1);
	      }
	    }
	    if (!cbs.length) {
	      this.unmountCallbackList = null;
	      if (this.baseComponent instanceof LifeTimeEvent) {
	        this.baseComponent = null;
	      }
	    }
	    return this;
	  };

	  Component.prototype.setParentNode = function(node) {
	    return this.parentNode = node;
	  };

	  Component.prototype.nextDomNode = function() {
	    var container, index, len, node, siblings;
	    container = this.container;
	    if (!container) {
	      return this._nextNode;
	    }
	    index = this.listIndex;
	    if (index == null) {
	      return container.nextDomNode();
	    }
	    siblings = container.children;
	    len = siblings.length;
	    while (index < len - 1) {
	      if (node = siblings[index + 1].firstDomNode()) {
	        return node;
	      }
	      index++;
	    }
	    if (container.tagName) {

	    } else {
	      return container.nextDomNode();
	    }
	  };

	  Component.prototype.mount = function(mountNode, beforeNode) {
	    this.mountNode = normalizeDomElement(mountNode);
	    if (this.parentNode && this.parentNode !== this.mountNode) {
	      this.unmount();
	    }
	    this.setParentNode(this.mountNode);
	    this._nextNode = beforeNode;
	    this.render(true);
	    return this;
	  };

	  Component.prototype.render = function(mounting) {
	    var baseComponent, oldBaseComponent;
	    this.baseComponent = baseComponent = this.getBaseComponent();
	    oldBaseComponent = this.oldBaseComponent;
	    if (oldBaseComponent && baseComponent !== oldBaseComponent) {
	      oldBaseComponent.remove(this.parentNode);
	      baseComponent.executeMountCallback();
	      if (!baseComponent.node) {
	        baseComponent.createDom();
	      } else if (!baseComponent.isNoop) {
	        baseComponent.updateDom(mounting);
	      }
	      return baseComponent.attachNode(this.parentNode);
	    } else if (!baseComponent.node) {
	      baseComponent.executeMountCallback();
	      baseComponent.createDom();
	      return baseComponent.attachNode(this.parentNode);
	    } else {
	      if (mounting) {
	        baseComponent.executeMountCallback();
	      }
	      if (!baseComponent.isNoop) {
	        baseComponent.updateDom(mounting);
	      }
	      if (mounting) {
	        return baseComponent.attachNode(this.parentNode);
	      }
	    }
	  };

	  Component.prototype.create = function() {
	    return this.render();
	  };

	  Component.prototype.update = function() {
	    return this.render();
	  };

	  Component.prototype.unmount = function() {
	    this.baseComponent.remove(this.parentNode);
	    return this;
	  };

	  Component.prototype.hasLifeTimeEvent = function() {
	    return false;
	  };

	  Component.prototype.copyLifeCallback = function(srcComponent) {
	    this.beforeMountCallbackList = srcComponent.beforeMountCallbackList;
	    this.afterUnmountCallbackList = srcComponent.afterUnmountCallbackList;
	    return this;
	  };

	  return Component;

	})();


/***/ },
/* 13 */
/***/ function(module, exports) {

	var createHtmlFragment, createUpdateHtml, insertNode, removeNode, _raf;

	_raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

	exports.requestAnimationFrame = exports.raf = _raf || function(callback) {
	  window.setInterval(callback, 1000 / 60);
	};

	exports.normalizeDomElement = function(domElement) {
	  if (typeof domElement === 'string') {
	    domElement = document.querySelector(domElement);
	  }
	  return domElement || document.getElementsByTagName('body')[0];
	};

	exports.insertNode = insertNode = function(parent, child, beforeNode) {
	  var item, _i, _len;
	  if (!parent) {
	    return;
	  }
	  if (parent instanceof Array) {
	    parent.push(child);
	  } else if (child instanceof Array) {
	    child.parentNode = parent;
	    for (_i = 0, _len = child.length; _i < _len; _i++) {
	      item = child[_i];
	      insertNode(parent, item, beforeNode);
	    }
	  } else {
	    if (child instanceof Node) {
	      if (beforeNode && beforeNode.parentNode === parent) {
	        parent.insertBefore(child, beforeNode);
	      } else {
	        parent.appendChild(child);
	      }
	    }
	  }
	};

	exports.removeNode = removeNode = function(parent, child) {
	  var node, _i, _len;
	  if (child instanceof Array) {
	    for (_i = 0, _len = child.length; _i < _len; _i++) {
	      node = child[_i];
	      removeNode(parent, node);
	    }
	  } else {
	    if (child && child.parentNode === parent) {
	      parent.removeChild(child);
	    }
	  }
	};

	createHtmlFragment = function(html) {
	  var node;
	  node = document.createDocumentFragment();
	  node.innerHtml = html;
	  return node;
	};

	createUpdateHtml = function() {
	  var html, node, parentNode, renderParent, value;
	  node = document.createDocumentFragment();
	  html = this.html;
	  if (typeof html === 'function') {
	    value = html();
	    if (value == null) {
	      value = '';
	    }
	    node.innerHtml = domFnValue(value);
	    this.fistChild = node.firstChild;
	    this.lastChild = node.lastChild;
	    parentNode = this.parentNode;
	    if (parentNode) {
	      parentNode.appendChild(node);
	    } else {
	      parentNode = node;
	    }
	    renderParent = this.renderParent();
	    renderParent.push((this.renderTask = {
	      type: UPDATE_HTML,
	      cache: value,
	      html: html,
	      parentNode: parentNode,
	      fistChild: this.firstChild,
	      lastChild: this.lastChild
	    }));
	  } else {
	    if (html == null) {
	      html = '';
	    }
	    node.innerHtml = domFnValue(this.html);
	    this.fistChild = node.firstChild;
	    this.lastChild = node.lastChild;
	    parentNode = this.parentNode;
	    if (parentNode) {
	      parentNode.appendChild(node);
	    } else {
	      parentNode = node;
	    }
	  }
	  return node;
	};

	exports.getBindProp = function(component) {
	  var tagName;
	  tagName = component.tagName;
	  if (!tagName) {
	    throw new Error('trying to bind wrong Component');
	  }
	  if (tagName === 'textarea' || tagName === 'select') {
	    return 'value';
	  } else if (component.attrs.type === 'checkbox') {
	    return 'checked';
	  } else {
	    return 'value';
	  }
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, Text, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	BaseComponent = __webpack_require__(11);

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Text = (function(_super) {
	  __extends(Text, _super);

	  function Text(text, options) {
	    if (text == null) {
	      text = '';
	    }
	    this.text = text;
	    Text.__super__.constructor.call(this, options);
	  }

	  Text.prototype.firstDomNode = function() {
	    return this.node;
	  };

	  Text.prototype.processText = function() {
	    var text;
	    text = this.text;
	    if (typeof text === 'function') {
	      text = text();
	    } else {
	      this.text = null;
	      this.isNoop = !this.mountCallbackComponentList.length;
	    }
	    return text;
	  };

	  Text.prototype.createDom = function() {
	    this.node = document.createTextNode(this.processText());
	    return this;
	  };

	  Text.prototype.updateDom = function() {
	    (this.text != null) && (this.node.textContent = this.processText());
	    return this;
	  };

	  Text.prototype.clone = function(options) {
	    return (new this.constructor(this.text, options)).copyLifeCallback(this);
	  };

	  Text.prototype.toString = function(indent, noNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine(funcString(this.text), indent, noNewLine);
	  };

	  return Text;

	})(BaseComponent);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Func, TransformComponent, funcString, newLine, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(9);

	TransformComponent = __webpack_require__(16);

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Func = (function(_super) {
	  __extends(Func, _super);

	  function Func(func, options) {
	    Func.__super__.constructor.call(this, options);
	    this.getContentComponent = function() {
	      return toComponent(func());
	    };
	    this.clone = function(options) {
	      return (new Func((function() {
	        return toComponent(func()).clone();
	      }), options || this.options)).copyLifeCallback(this);
	    };
	    this.toString = function(indent, noNewLine) {
	      if (indent == null) {
	        indent = 2;
	      }
	      return newLine("<Func " + (funcString(func)) + "/>", indent, noNewLine);
	    };
	    this;
	  }

	  return Func;

	})(TransformComponent);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Component, TransformComponent, insertNode,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	Component = __webpack_require__(12);

	insertNode = __webpack_require__(13).insertNode;

	module.exports = TransformComponent = (function(_super) {
	  __extends(TransformComponent, _super);

	  function TransformComponent(options) {
	    TransformComponent.__super__.constructor.call(this, options);
	    this.options = options || {};
	    return;
	  }

	  TransformComponent.prototype.firstDomNode = function() {
	    return this.baseComponent && this.baseComponent.firstDomNode();
	  };

	  TransformComponent.prototype.getBaseComponent = function() {
	    var baseComponent, content;
	    this.oldBaseComponent = this.baseComponent;
	    content = this.getContentComponent();
	    content.container = this;
	    content.listIndex = null;
	    baseComponent = content.getBaseComponent();
	    if (this.mountCallbackList) {
	      baseComponent.mountCallbackComponentList.unshift(this);
	    }
	    if (this.unmountCallbackList) {
	      baseComponent.unmountCallbackComponentList.push(this);
	    }
	    return baseComponent;
	  };

	  return TransformComponent;

	})(Component);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, Text, checkContainer, exports, newLine, toComponent,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(9);

	BaseComponent = __webpack_require__(11);

	Text = __webpack_require__(14);

	checkContainer = __webpack_require__(4).checkContainer;

	newLine = __webpack_require__(4).newLine;

	module.exports = exports = List = (function(_super) {
	  __extends(List, _super);

	  function List(children, options) {
	    var child, i, _i, _len;
	    this.children = children;
	    options = options || {};
	    if (children.length === 0) {
	      children.push(new Text(''));
	    }
	    for (i = _i = 0, _len = children.length; _i < _len; i = ++_i) {
	      child = children[i];
	      child = toComponent(child);
	      children[i] = child;
	      child.container = this;
	      child.listIndex = i;
	    }
	    this.isList = true;
	    List.__super__.constructor.call(this, options);
	    return;
	  }

	  List.prototype.clone = function(options) {
	    var child;
	    return (new List((function() {
	      var _i, _len, _ref, _results;
	      _ref = this.children;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        child = _ref[_i];
	        _results.push(child.clone());
	      }
	      return _results;
	    }).call(this), options || this.options)).copyLifeCallback(this);
	  };

	  List.prototype.firstDomNode = function() {
	    return this.children[0].firstDomNode();
	  };

	  List.prototype.setParentNode = function(node) {
	    var child, _i, _len, _ref;
	    this.parentNode = node;
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      child.setParentNode(node);
	    }
	  };

	  List.prototype.createDom = function() {
	    var child, compList, i, node, _i, _j, _len, _len1, _ref, _ref1;
	    this.node = node = [];
	    _ref = this.children;
	    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
	      child = _ref[i];
	      child.render(true);
	      node[i] = child.node;
	      if (compList = child.baseComponent.unmountCallbackComponentList) {
	        this.unmountCallbackComponentList = compList.concat(this.unmountCallbackComponentList);
	      }
	    }
	    if (!this.mountCallbackComponentList.length) {
	      _ref1 = this.children;
	      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	        child = _ref1[_j];
	        if (!child.isNoop) {
	          return;
	        }
	      }
	      this.isNoop = true;
	    }
	  };

	  List.prototype.updateDom = function(mounting) {
	    var child, i, node, _i, _len, _ref;
	    node = this.node;
	    _ref = this.children;
	    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
	      child = _ref[i];
	      child.render(mounting);
	      node[i] = child.node;
	    }
	  };

	  List.prototype.toString = function(indent, noNewLine) {
	    var child, s, _i, _len, _ref;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine("<List>", indent, noNewLine);
	    _ref = this.children;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      child = _ref[_i];
	      s += child.toString(indent + 2);
	    }
	    return s += newLine('</List>', indent);
	  };

	  return List;

	})(BaseComponent);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Component, componentId, extend, mountList, normalizeDomElement,
	  __slice = [].slice;

	extend = __webpack_require__(6);

	normalizeDomElement = __webpack_require__(13).normalizeDomElement;

	componentId = 1;

	mountList = [];

	module.exports = Component = (function() {
	  function Component() {
	    this.listeners = {};
	    this.baseComponent = null;
	    this.parentNode = null;
	    this.node = null;
	    this.options = null;
	    this.id = componentId++;
	  }

	  Component.prototype.setOptions = function(options) {
	    this.options = options;
	    return this;
	  };

	  Component.prototype.beforeMount = function() {
	    var cbs, fns;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.mountCallbackList = cbs = this.mountCallbackList || [];
	    cbs.push.apply(cbs, fns);
	    return this;
	  };

	  Component.prototype.unbindBeforeMount = function() {
	    var cbs, fn, fns, _i, _len;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    cbs = this.mountCallbackList;
	    for (_i = 0, _len = cbs.length; _i < _len; _i++) {
	      fn = cbs[_i];
	      if (cbs.indexOf(fn) === -1) {
	        continue;
	      } else {
	        cbs.splice(index, 1);
	      }
	    }
	    if (!cbs.length) {
	      this.mountCallbackList = null;
	      if (this.baseComponent instanceof LifeTimeEvent) {
	        this.baseComponent = null;
	      }
	    }
	    return this;
	  };

	  Component.prototype.afterUnmount = function() {
	    var cbs, fns;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.unmountCallbackList = cbs = this.unmountCallbackList || [];
	    cbs.push.apply(cbs, fns);
	    return this;
	  };

	  Component.prototype.unbindAfterUnmount = function() {
	    var cbs, fn, fns, _i, _len;
	    fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    cbs = this.unmountCallbackList;
	    for (_i = 0, _len = cbs.length; _i < _len; _i++) {
	      fn = cbs[_i];
	      if (cbs.indexOf(fn) === -1) {
	        continue;
	      } else {
	        cbs.splice(index, 1);
	      }
	    }
	    if (!cbs.length) {
	      this.unmountCallbackList = null;
	      if (this.baseComponent instanceof LifeTimeEvent) {
	        this.baseComponent = null;
	      }
	    }
	    return this;
	  };

	  Component.prototype.setParentNode = function(node) {
	    return this.parentNode = node;
	  };

	  Component.prototype.nextDomNode = function() {
	    var container, index, len, node, siblings;
	    container = this.container;
	    if (!container) {
	      return this._nextNode;
	    }
	    index = this.listIndex;
	    if (index == null) {
	      return container.nextDomNode();
	    }
	    siblings = container.children;
	    len = siblings.length;
	    while (index < len - 1) {
	      if (node = siblings[index + 1].firstDomNode()) {
	        return node;
	      }
	      index++;
	    }
	    if (container.tagName) {

	    } else {
	      return container.nextDomNode();
	    }
	  };

	  Component.prototype.mount = function(mountNode, beforeNode) {
	    this.mountNode = normalizeDomElement(mountNode);
	    if (this.parentNode && this.parentNode !== this.mountNode) {
	      this.unmount();
	    }
	    this.setParentNode(this.mountNode);
	    this._nextNode = beforeNode;
	    this.render(true);
	    return this;
	  };

	  Component.prototype.render = function(mounting) {
	    var baseComponent, oldBaseComponent;
	    this.baseComponent = baseComponent = this.getBaseComponent();
	    oldBaseComponent = this.oldBaseComponent;
	    if (oldBaseComponent && baseComponent !== oldBaseComponent) {
	      oldBaseComponent.remove(this.parentNode);
	      baseComponent.executeMountCallback();
	      if (!baseComponent.node) {
	        baseComponent.createDom();
	      } else if (!baseComponent.isNoop) {
	        baseComponent.updateDom(mounting);
	      }
	      return baseComponent.attachNode(this.parentNode);
	    } else if (!baseComponent.node) {
	      baseComponent.executeMountCallback();
	      baseComponent.createDom();
	      return baseComponent.attachNode(this.parentNode);
	    } else {
	      if (mounting) {
	        baseComponent.executeMountCallback();
	      }
	      if (!baseComponent.isNoop) {
	        baseComponent.updateDom(mounting);
	      }
	      if (mounting) {
	        return baseComponent.attachNode(this.parentNode);
	      }
	    }
	  };

	  Component.prototype.create = function() {
	    return this.render();
	  };

	  Component.prototype.update = function() {
	    return this.render();
	  };

	  Component.prototype.unmount = function() {
	    this.baseComponent.remove(this.parentNode);
	    return this;
	  };

	  Component.prototype.hasLifeTimeEvent = function() {
	    return false;
	  };

	  Component.prototype.copyLifeCallback = function(srcComponent) {
	    this.beforeMountCallbackList = srcComponent.beforeMountCallbackList;
	    this.afterUnmountCallbackList = srcComponent.afterUnmountCallbackList;
	    return this;
	  };

	  return Component;

	})();


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var BaseComponent, List, Nothing, Tag, attrToPropName, classFn, cloneObject, eventHandlerFromArray, extend, funcString, insertNode, newLine, styleFrom, toComponent, _directiveRegistry, _ref, _ref1,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  __slice = [].slice;

	extend = __webpack_require__(6);

	insertNode = __webpack_require__(13).insertNode;

	_ref = __webpack_require__(20), classFn = _ref.classFn, styleFrom = _ref.styleFrom, eventHandlerFromArray = _ref.eventHandlerFromArray, attrToPropName = _ref.attrToPropName;

	BaseComponent = __webpack_require__(11);

	List = __webpack_require__(17);

	_ref1 = __webpack_require__(4), funcString = _ref1.funcString, newLine = _ref1.newLine, cloneObject = _ref1.cloneObject;

	_directiveRegistry = __webpack_require__(21)._directiveRegistry;

	Nothing = __webpack_require__(10);

	toComponent = __webpack_require__(9);

	module.exports = Tag = (function(_super) {
	  __extends(Tag, _super);

	  function Tag(tagName, attrs, children, options) {
	    if (attrs == null) {
	      attrs = {};
	    }
	    Tag.__super__.constructor.call(this, options);
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
	    this.isTag = true;
	    if (children instanceof Array) {
	      if (children.length === 1) {
	        this.children = toComponent(children[0]);
	      } else if (children.length === 0) {
	        this.children = new Nothing();
	      } else {
	        this.children = new List(children, {});
	      }
	    } else {
	      this.children = toComponent(children);
	    }
	    this.processAttrs();
	    return;
	  }

	  Tag.prototype.processAttrs = function() {
	    var attrStyle, attrs, directive, directives, events, generator, handler, key, props, specials, style, value, _i, _len;
	    this.activePropertiesCount = 0;
	    attrs = this.attrs;
	    this.cacheClassName = "";
	    this.className = classFn(attrs.className, attrs["class"]);
	    this.hasActiveProps = false;
	    this.cacheProps = Object.create(null);
	    this.props = props = Object.create(null);
	    this.hasActiveStyle = false;
	    this.cacheStyle = Object.create(null);
	    this.style = style = Object.create(null);
	    attrStyle = styleFrom(attrs.style);
	    for (key in attrStyle) {
	      this.hasActiveStyle = true;
	      style[attrToPropName(key)] = attrStyle[key];
	    }
	    this.hasActiveEvents = false;
	    this.cacheEvents = Object.create(null);
	    this.events = events = Object.create(null);
	    this.hasActiveSpecials = false;
	    this.cacheSpecials = Object.create(null);
	    this.specials = specials = Object.create(null);
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
	        this.activePropertiesCount++;
	      } else if (key[0] === '$') {
	        generator = _directiveRegistry[key.slice(1)];
	        if (value instanceof Array) {
	          handler = generator.apply(null, value);
	        } else {
	          handler = generator.apply(null, [value]);
	        }
	        directives.push(handler);
	      } else if (key[0] === '_') {
	        this.hasActiveSpecials = true;
	        specials[key.slice(1)] = value;
	      } else {
	        this.hasActiveProps = true;
	        props[attrToPropName(key)] = value;
	        this.activePropertiesCount++;
	      }
	    }
	    for (_i = 0, _len = directives.length; _i < _len; _i++) {
	      directive = directives[_i];
	      directive(this);
	    }
	  };

	  Tag.prototype.firstDomNode = function() {
	    return this.node;
	  };

	  Tag.prototype.getBaseComponent = function() {
	    this.oldBaseComponent = this;
	    this.mountCallbackComponentList = this.mountCallbackList ? [this] : [];
	    this.unmountCallbackComponentList = this.unmountCallbackList ? [this] : [];
	    return this;
	  };

	  Tag.prototype.enableContainerComponent = function() {
	    var container, _results;
	    container = this;
	    _results = [];
	    while (container) {
	      if (container.isBaseComponent) {
	        if (container.isNoop) {
	          container.isNoop = false;
	        } else {
	          break;
	        }
	      }
	      _results.push(container = container.container);
	    }
	    return _results;
	  };

	  Tag.prototype.addActivity = function(props, prop, type) {
	    this['hasActive' + type] = true;
	    if (props[prop] == null) {
	      this.activePropertiesCount++;
	    }
	    this.enableContainerComponent();
	  };

	  Tag.prototype.prop = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._updateProp(args, this.props, this.cacheProps, 'Props');
	  };

	  Tag.prototype.css = function() {
	    var args;
	    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return this._updateProp(args, this.style, this.cacheStyle, 'Style');
	  };

	  Tag.prototype._updateProp = function(args, props, cache, type) {
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
	        this.setProp(key, v, props, cache, type);
	      }
	    } else if (args.length === 2) {
	      this.setProp(args[0], args[1], props, cache, type);
	    }
	    return this;
	  };

	  Tag.prototype.setProp = function(prop, value, props, cache, type) {
	    if (props[prop] == null) {
	      if (typeof value === 'function') {
	        props[prop] = value;
	        this.activePropertiesCount++;
	        this['hasActive' + type] = true;
	        this.enableContainerComponent();
	      } else {
	        if (value == null) {
	          value = '';
	        }
	        if (value !== cache[prop]) {
	          props[prop] = value;
	          this.activePropertiesCount++;
	          this['hasActive' + type] = true;
	          this.enableContainerComponent();
	        }
	      }
	    } else {
	      props[prop] = value;
	    }
	  };

	  Tag.prototype.bind = function(eventNames, handler, before) {
	    var name, names, _i, _len;
	    names = eventNames.split('\s+');
	    for (_i = 0, _len = names.length; _i < _len; _i++) {
	      name = names[_i];
	      this._addEventProp(name, handler, before);
	    }
	  };

	  Tag.prototype._addEventProp = function(prop, handler, before) {
	    var events;
	    if (prop.slice(0, 2) !== 'on') {
	      prop = 'on' + prop;
	    }
	    events = this.events;
	    if (typeof handler === 'function') {
	      handler = [handler];
	    }
	    if (!events[prop]) {
	      this.addActivity(events, prop, 'Events');
	      events[prop] = handler;
	    } else {
	      if (before) {
	        events[prop] = handler.concat(events[prop]);
	      } else {
	        events[prop] = events[prop].concat(handler);
	      }
	    }
	    return this;
	  };

	  Tag.prototype.unbind = function(eventNames, handler) {
	    var name, names, _i, _len;
	    names = eventNames.split('\s+');
	    for (_i = 0, _len = names.length; _i < _len; _i++) {
	      name = names[_i];
	      this._removeEventHandlers(name, handler);
	    }
	  };

	  Tag.prototype._removeEventHandlers = function(eventName, handler) {
	    var eventHandlers, events, index;
	    if (!this.hasActiveEvents) {
	      return this;
	    }
	    if (eventName.slice(0, 2) !== 'on') {
	      eventName = 'on' + eventName;
	    }
	    events = this.events;
	    eventHandlers = events[eventName];
	    if (!eventHandlers) {
	      return this;
	    }
	    index = eventHandlers.indexOf(handler);
	    if (index >= 0) {
	      eventHandlers.splice(index, 1);
	    }
	    if (!eventHandlers.length) {
	      delete events[eventName];
	    }
	    return this;
	  };

	  Tag.prototype.addClass = function() {
	    var items;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    this.className.extend(items);
	    if (this.className.needUpdate) {
	      this.activePropertiesCount++;
	      this.enableContainerComponent();
	    }
	    return this;
	  };

	  Tag.prototype.removeClass = function() {
	    var items, _ref2;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    (_ref2 = this.className).removeClass.apply(_ref2, items);
	    if (this.className.needUpdate) {
	      this.activePropertiesCount++;
	      this.enableContainerComponent();
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
	      this.setProp('display', 'block', this.style, this.cacheStyle, 'Style');
	    } else if (display === 'visible') {
	      this.setProp('visibility', 'visible', this.style, this.cacheStyle, 'Style');
	    } else {
	      this.setProp('display', display, this.style, this.cacheStyle, 'Style');
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
	      this.setProp('display', 'none', this.style, this.cacheStyle, 'Style');
	    } else if (display === 'hidden') {
	      this.setProp('visibility', 'hidden', this.style, this.cacheStyle, 'Style');
	    } else {
	      this.setProp('display', display, this.style, this.cacheStyle, 'Style');
	    }
	    this.update();
	    return this;
	  };

	  Tag.prototype.showHide = function(status, test, display) {
	    var oldDisplay, style;
	    style = this.style;
	    oldDisplay = style.display;
	    if (!oldDisplay) {
	      this.addActivity(style, 'display', 'Style');
	    }
	    style.display = function() {
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
	    };
	    this.style = style;
	    return this;
	  };

	  Tag.prototype.showOn = function(test, display) {
	    return this.showHide(true, test, display);
	  };

	  Tag.prototype.hideOn = function(test, display) {
	    return this.showHide(false, test, display);
	  };

	  Tag.prototype.top = function() {
	    var elm, rect;
	    elm = this.node;
	    if (!elm) {
	      return 0;
	    }
	    rect = elm.getBoundingClientRect();
	    return rect.top;
	  };

	  Tag.prototype.bottom = function() {
	    var elm, rect;
	    elm = this.node;
	    if (!elm) {
	      return 0;
	    }
	    rect = elm.getBoundingClientRect();
	    return rect.bottom;
	  };

	  Tag.prototype.height = function() {
	    var elm, rect;
	    elm = this.node;
	    if (!elm) {
	      return 0;
	    }
	    rect = elm.getBoundingClientRect();
	    return rect.height;
	  };

	  Tag.prototype.width = function() {
	    var elm, rect;
	    elm = this.node;
	    if (!elm) {
	      return 0;
	    }
	    rect = elm.getBoundingClientRect();
	    return rect.width;
	  };

	  Tag.prototype.getSpecialProp = function(prop) {};

	  Tag.prototype.createDom = function() {
	    var children, compList, node;
	    children = this.children;
	    this.node = node = this.namespace ? document.createElementNS(this.namespace, this.tagName) : document.createElement(this.tagName);
	    children.setParentNode(node);
	    this.updateProperties();
	    children.render(true);
	    if (compList = children.baseComponent.unmountCallbackComponentList) {
	      this.unmountCallbackComponentList = compList.concat(this.unmountCallbackComponentList);
	    }
	    this.isNoop = !this.activePropertiesCount && !this.mountCallbackComponentList.length && children.isNoop;
	    return this;
	  };

	  Tag.prototype.updateDom = function(mounting) {
	    var children;
	    this.updateProperties();
	    children = this.children;
	    children.render();
	    this.isNoop = !this.activePropertiesCount && !this.mountCallbackComponentList.length && children.isNoop;
	    return this;
	  };

	  Tag.prototype.updateProperties = function() {
	    var active, activePropertiesCount, cacheEvents, cacheProps, cacheSpecials, cacheStyle, className, classValue, elementStyle, events, node, prop, props, specials, style, value;
	    activePropertiesCount = this.activePropertiesCount;
	    if (!activePropertiesCount) {
	      return;
	    }
	    node = this.node, className = this.className;
	    if (className.needUpdate) {
	      classValue = className();
	      if (!classValue) {
	        classValue = '';
	      }
	      if (classValue !== this.cacheClassName) {
	        this.cacheClassName = node.className = classValue;
	      }
	      if (!className.needUpdate) {
	        activePropertiesCount--;
	      }
	    }
	    if (this.hasActiveProps) {
	      props = this.props, cacheProps = this.cacheProps;
	      active = false;
	      for (prop in props) {
	        value = props[prop];
	        if (typeof value === 'function') {
	          value = value();
	          active = true;
	        } else {
	          delete props[prop];
	          this.activePropertiesCount--;
	        }
	        if (value == null) {
	          value = '';
	        }
	        cacheProps[prop] = node[prop] = value;
	      }
	      this.hasActiveProps = active;
	    }
	    if (this.hasActiveStyle) {
	      style = this.style, cacheStyle = this.cacheStyle;
	      active = false;
	      elementStyle = node.style;
	      for (prop in style) {
	        value = style[prop];
	        if (typeof value === 'function') {
	          value = value();
	          active = true;
	        } else {
	          delete style[prop];
	          this.activePropertiesCount--;
	        }
	        if (value == null) {
	          value = '';
	        }
	        cacheStyle[prop] = elementStyle[prop] = value;
	      }
	      this.hasActiveStyle = active;
	    }
	    if (this.hasActiveEvents) {
	      events = this.events, cacheEvents = this.cacheEvents;
	      for (prop in events) {
	        value = events[prop];
	        cacheEvents[prop] = events[prop];
	        delete events[prop];
	        node[prop] = eventHandlerFromArray(value, node, this);
	        this.activePropertiesCount--;
	      }
	    }
	    this.hasActiveEvents = false;
	    if (this.hasActiveSpecials) {
	      specials = this.specials, cacheSpecials = this.cacheSpecials;
	      active = false;
	      for (prop in specials) {
	        value = specials[prop];
	        if (typeof value === 'function') {
	          value = value();
	          active = true;
	        } else {
	          delete props[prop];
	          this.activePropertiesCount--;
	        }
	        if (value == null) {
	          value = '';
	        }
	        spercialPropSet[prop](this, prop, value);
	      }
	      this.hasActiveSpecials = active;
	    }
	    this.activePropertiesCount = activePropertiesCount;
	  };

	  Tag.prototype.clone = function(options) {
	    var result;
	    if (options == null) {
	      options = this.options;
	    }
	    result = new Tag(this.tagName, this.attrs, this.children.clone(), options || this.options);
	    return result.copyLifeCallback(this);
	  };

	  Tag.prototype.toString = function(indent, noNewLine) {
	    var key, s, v, value, _ref2, _ref3;
	    if (indent == null) {
	      indent = 0;
	    }
	    s = newLine("<" + this.tagName, indent, noNewLine);
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
	    s += this.children.toString(indent + 2);
	    return s += newLine("</" + this.tagName + ">", indent + 2, 'noNewLine');
	  };

	  return Tag;

	})(BaseComponent);


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var attrPropNameMap, classFn, cloneObject, extend, extendEventValue, isArray, styleFrom, _ref, _specialProperties,
	  __slice = [].slice;

	_ref = __webpack_require__(4), isArray = _ref.isArray, cloneObject = _ref.cloneObject;

	extend = __webpack_require__(6);

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
	  if (options.replaceDirectives) {
	    attrs.directives = obj.directives;
	  } else if (obj.directives) {
	    if (!attrs.directives) {
	      attrs.directives = obj.directives;
	    } else {
	      if (!(attrs.directives instanceof Array)) {
	        attrs.directives = [attrs.directives];
	      }
	      if (!(value instanceof Array)) {
	        attrs.directives.push(value);
	      } else {
	        attrs.directives.push.apply(attrs.directives, value);
	      }
	    }
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

	exports.overAttrs = function(attrs, obj) {
	  var key, value;
	  if (!obj) {
	    attrs = extend(Object.create(null), attrs);
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
	    }
	    return obj;
	  }
	};

	exports.classFn = classFn = function() {
	  var classMap, extendClassMap, fn, items, processClassValue;
	  items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  classMap = Object.create(null);
	  fn = function() {
	    var klass, lst, needUpdate, value;
	    if (!arguments.length) {
	      lst = [];
	      needUpdate = false;
	      for (klass in classMap) {
	        value = classMap[klass];
	        if (typeof value === 'function') {
	          value = value();
	          needUpdate = true;
	        }
	        if (value) {
	          lst.push(klass);
	        }
	      }
	      fn.needUpdate = needUpdate;
	      return lst.join(' ');
	    } else {
	      extendClassMap(arguments.slice());
	    }
	  };
	  processClassValue = function(name, value) {
	    if (!value && classMap[name]) {
	      fn.needUpdate = true;
	      return delete classMap[name];
	    } else {
	      if (classMap[name] !== value) {
	        fn.needUpdate = true;
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
	  fn.needUpdate = false;
	  extendClassMap(items);
	  fn.classMap = classMap;
	  fn.removeClass = function() {
	    var item, items, _i, _len, _results;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    _results = [];
	    for (_i = 0, _len = items.length; _i < _len; _i++) {
	      item = items[_i];
	      _results.push(processClassValue(item, false));
	    }
	    return _results;
	  };
	  fn.extend = function() {
	    var items;
	    items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	    return extendClassMap(items);
	  };
	  return fn;
	};

	exports.styleFrom = styleFrom = function(value) {
	  var item, key, result, v, _i, _j, _len, _len1, _ref1, _ref2;
	  if (typeof value === 'string') {
	    result = Object.create(null);
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
	    result = Object.create(null);
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
	    return Object.create(null);
	  } else {
	    return cloneObject(value);
	  }
	};

	exports.updateProp = function(prop, value, cache, element) {
	  var dynamic, isFunc;
	  if (typeof value === 'function') {
	    value = value();
	    isFunc = true;
	  } else {
	    dynamic = false;
	  }
	  if (value == null) {
	    value = '';
	  }
	  if (cache[prop] !== value) {
	    element[prop] = value;
	  }
	  return isFunc;
	};

	exports.eventHandlerFromArray = function(callbackList, node, component) {
	  return function(event) {
	    var fn, _i, _len;
	    for (_i = 0, _len = callbackList.length; _i < _len; _i++) {
	      fn = callbackList[_i];
	      fn && fn.call(node, event, component);
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

	exports._specialProperties = _specialProperties = {};

	exports.registerSpecial = function(key, handler) {
	  return _specialProperties[key] = handler;
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
/* 21 */
/***/ function(module, exports) {

	var _directiveRegistry;

	exports._directiveRegistry = _directiveRegistry = Object.create(null);

	exports.registerDirective = function(directiveName, directiveHandler) {
	  return _directiveRegistry[directiveName] = directiveHandler;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Comment, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Comment = (function(_super) {
	  __extends(Comment, _super);

	  function Comment() {
	    return Comment.__super__.constructor.apply(this, arguments);
	  }

	  Comment.prototype.createDom = function() {
	    this.node = document.createComment(this.processText());
	    return this;
	  };

	  Comment.prototype.updateDom = function() {
	    this.text && (this.node.data = this.processText());
	    return this;
	  };

	  Comment.prototype.toString = function(indent, noNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Comment " + (funcString(this.text)) + "/>", indent, noNewLine);
	  };

	  return Comment;

	})(Text);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Html, funcString, newLine, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Html = (function(_super) {
	  __extends(Html, _super);

	  function Html() {
	    return Html.__super__.constructor.apply(this, arguments);
	  }

	  Html.prototype.createDom = function() {
	    this.node = document.createDocumenutFragment(this.processText());
	    return this;
	  };

	  Html.prototype.updateDom = function() {
	    if (!this.text) {
	      return this;
	    }
	    this.node = document.createDocumenutFragment(this.processText());
	    return this;
	  };

	  Html.prototype.toString = function(indent, noNewLine) {
	    if (indent == null) {
	      indent = 2;
	    }
	    return newLine("<Html " + (funcString(this.text)) + "/>", indent, noNewLine);
	  };

	  return Html;

	})(Text);


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var If, TransformComponent, funcString, maybeIf, mergeThenElseValue, newLine, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(9);

	TransformComponent = __webpack_require__(16);

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	mergeThenElseValue = function(test, thenValue, elseValue) {
	  if (typeof thenValue === 'function') {
	    if (typeof elseValue === 'function') {
	      return function() {
	        if (test()) {
	          return thenValue();
	        } else {
	          return elseValue();
	        }
	      };
	    } else {
	      return function() {
	        if (test()) {
	          return thenValue();
	        } else {
	          return elseValue;
	        }
	      };
	    }
	  } else {
	    if (typeof elseValue === 'function') {
	      return function() {
	        if (test()) {
	          return thenValue;
	        } else {
	          return elseValue();
	        }
	      };
	    } else {
	      return function() {
	        if (test()) {
	          return thenValue;
	        } else {
	          return elseValue;
	        }
	      };
	    }
	  }
	};

	maybeIf = function(test, then_, else_, options) {
	  var attrs, elseAttrs, key, thenAttrs;
	  if (then_ === else_) {
	    return then_;
	  }
	  if (typeof test === 'function') {
	    if (then_.isTag && else_.isTag && then_.tagName === else_.tagName && then_.namespace === else_.namespace) {
	      attrs = Object.create(null);
	      thenAttrs = then_.attrs;
	      elseAttrs = else_.attrs;
	      for (key in bothKeys(thenAttrs, elseAttrs)) {
	        attrs[key] = mergeThenElseValue(test, thenAttrs[key], elseAttrs[key]);
	      }
	      attrs.namespace = then_.namespace;
	      return new Tag(then_.tagName, attrs, children);
	    } else if (then_.type === 'Text' && else_.type === 'Text') {
	      return new Text(mergeThenElseValue(test, then_.text, else_.text));
	    } else if (then_.type === 'Comment' && else_.type === 'Comment') {
	      return new Comment(mergeThenElseValue(test, then_.text, else_.text));
	    } else if (then_.type === 'Html' && else_.type === 'Html') {
	      return new Html(mergeThenElseValue(test, then_.text, else_.text));
	    }
	  } else if (test) {
	    return then_;
	  } else {
	    return else_;
	  }
	};

	module.exports = If = (function(_super) {
	  __extends(If, _super);

	  function If(test, then_, else_, options) {
	    then_ = toComponent(then_);
	    else_ = toComponent(else_);
	    if (typeof test !== 'function') {
	      if (test) {
	        return then_;
	      } else {
	        return else_;
	      }
	    }
	    If.__super__.constructor.call(this, options);
	    this.getContentComponent = function() {
	      if (test()) {
	        return then_;
	      } else {
	        return else_;
	      }
	    };
	    this.clone = function(options) {
	      return (new If(test, then_.clone(), else_clone(), options || this.options)).copyLifeCallback(this);
	    };
	    this.toString = function(indent, noNewLine) {
	      if (indent == null) {
	        indent = 0;
	      }
	      if (noNewLine == null) {
	        noNewLine = '';
	      }
	      return newLine(indent, noNewLine) + '<if ' + funcString(test) + '>' + then_.toString(indent + 2) + else_.toString(indent + 2) + newLine('</if>', indent);
	    };
	    this;
	  }

	  return If;

	})(TransformComponent);


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var Case, TransformComponent, funcString, newLine, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	toComponent = __webpack_require__(9);

	TransformComponent = __webpack_require__(16);

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Case = (function(_super) {
	  __extends(Case, _super);

	  function Case(test, map, else_, options) {
	    var key, value;
	    if (options == null) {
	      options = {};
	    }
	    Case.__super__.constructor.call(this, options);
	    if (typeof test !== 'function') {
	      if (map.hasOwnPoperty(test)) {
	        return toComponent(map[key]);
	      } else {
	        return toComponent(else_);
	      }
	    }
	    if (options.convertToIf) {
	      for (key in map) {
	        value = map[key];
	        else_ = new If((function() {
	          return test() === key;
	        }), value, else_);
	      }
	      return else_;
	    }
	    for (key in map) {
	      value = map[key];
	      map[key] = toComponent(value);
	    }
	    else_ = toComponent(else_);
	    this.getContentComponent = function() {
	      return map[test()] || else_;
	    };
	    this.clone = function(options) {
	      var cloneMap;
	      cloneMap = Object.create(null);
	      for (key in map) {
	        value = map[key];
	        cloneMap[key] = value.clone();
	      }
	      return (new Case(test, cloneMap, else_clone(), options || this.options)).copyLifeCallback(this);
	    };
	    this.toString = function(indent, noNewLine) {
	      var comp, s;
	      if (indent == null) {
	        indent = 0;
	      }
	      s = newLine(indent, noNewLine) + '<Case ' + funcString(test) + '>';
	      for (key in map) {
	        comp = map[key];
	        s += newLine(key + ': ' + comp.toString(indent + 2, true), indent + 2);
	      }
	      return s += else_.toString(indent + 2) + newLine('</Case>', indent);
	    };
	    this;
	  }

	  return Case;

	})(TransformComponent);


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var List, Repeat, TransformComponent, funcString, isArray, newLine, toComponent, _ref,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	isArray = __webpack_require__(4).isArray;

	toComponent = __webpack_require__(9);

	TransformComponent = __webpack_require__(16);

	List = __webpack_require__(17);

	_ref = __webpack_require__(4), funcString = _ref.funcString, newLine = _ref.newLine;

	module.exports = Repeat = (function(_super) {
	  __extends(Repeat, _super);

	  function Repeat(list, itemFn, options) {
	    var cacheComponents, items, keyFunction, sortFunction;
	    if (options == null) {
	      options = {};
	    }
	    Repeat.__super__.constructor.call(this, options);
	    if (typeof list !== 'function' && !isArray(list)) {
	      throw new Error('children for List should be array like or a function');
	    }
	    if (typeof list !== 'function') {
	      items = list;
	      if (!items || typeof items !== 'object') {
	        throw new Error('Repeat Component need an array or object');
	      }
	    }
	    sortFunction = options.sortFunction;
	    keyFunction = options.keyFunction;
	    cacheComponents = Object.create(null);
	    this.getContentComponent = (function(_this) {
	      return function() {
	        var child, children, i, index, item, itemList, key, value, _i, _j, _len, _len1, _ref1;
	        if (typeof list === 'function') {
	          items = list();
	          if (!items || typeof items !== 'object') {
	            throw new Error('Repeat Component need an array or object');
	          }
	        }
	        children = [];
	        if (isArray(items)) {
	          if (sortFunction) {
	            items.sort(sortFunction);
	          }
	          for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
	            item = items[i];
	            if (keyFunction) {
	              child = cacheComponents[keyFunction(item, i)] || toComponent(itemFn(item, i, items, _this));
	            } else {
	              child = toComponent(itemFn(item, i, items, _this));
	            }
	            children.push(child);
	          }
	        } else {
	          itemList = (function() {
	            var _results;
	            _results = [];
	            for (key in items) {
	              value = items[key];
	              _results.push([key, value]);
	            }
	            return _results;
	          })();
	          if (sortFunction) {
	            itemList.sort(sortFunction);
	          }
	          for (index = _j = 0, _len1 = itemList.length; _j < _len1; index = ++_j) {
	            _ref1 = itemList[index], key = _ref1[0], value = _ref1[1];
	            if (keyFunction) {
	              child = _this.cacheComponents[keyFunction(value, key, index)] || toComponent(itemFn(value, key, index, itemList, _this));
	            }
	            child = toComponent(itemFn(value, key, itemList, _this));
	            children.push(child);
	          }
	        }
	        return new List(children);
	      };
	    })(this);
	    this.clone = function(options) {
	      return (new Repeat(list, (function(item, index, list, comp) {
	        return itemFn(item, index, list, comp).clone();
	      }), options || this.options)).copyLifeCallback(this);
	    };
	    this.toString = function(indent, noNewLine) {
	      if (indent == null) {
	        indent = 0;
	      }
	      return newLine("<Repeat " + (funcString(list)) + " " + (funcString(itemFn)) + "/>", indent, noNewLine);
	    };
	    this;
	  }

	  return Repeat;

	})(TransformComponent);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var Case, Comment, Component, Func, If, List, Nothing, Repeat, Tag, Text, attrsChildren, isAttrs, isComponent, list, tag, toComponent, toTagChildren, _ref,
	  __slice = [].slice;

	_ref = __webpack_require__(7), Component = _ref.Component, toComponent = _ref.toComponent, isComponent = _ref.isComponent, Nothing = _ref.Nothing, Tag = _ref.Tag, Text = _ref.Text, Comment = _ref.Comment, If = _ref.If, Case = _ref.Case, Func = _ref.Func, List = _ref.List, Repeat = _ref.Repeat;

	isAttrs = function(item) {
	  return typeof item === 'object' && item !== null && !isComponent(item) && !(item instanceof Array);
	};

	attrsChildren = function(args) {
	  var attrs;
	  attrs = args[0];
	  if (!args.length) {
	    return [Object.create(null), []];
	  } else if (attrs==null) {
	    return [Object.create(null), args.slice(1)];
	  } else if (attrs instanceof Array) {
	    return [Object.create(null), args];
	  } else if (typeof attrs === 'function') {
	    return [Object.create(null), args];
	  } else if (typeof attrs === 'object') {
	    if (isComponent(attrs)) {
	      return [Object.create(null), args];
	    } else {
	      return [attrs, args.slice(1)];
	    }
	  } else {
	    return [Object.create(null), args];
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
	  var args, attrs, children, tagName, _ref1;
	  tagName = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	  _ref1 = attrsChildren(args), attrs = _ref1[0], children = _ref1[1];
	  return new Tag(tagName, attrs, toTagChildren(children));
	};

	exports.nstag = function() {
	  var args, attrs, children, namespace, tagName, _ref1;
	  tagName = arguments[0], namespace = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
	  _ref1 = attrsChildren(args), attrs = _ref1[0], children = _ref1[1];
	  return new Tag(tagName, attrs, toTagChildren(children), namespace);
	};

	exports.nothing = function(attrs, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, new Nothing(), options);
	  } else {
	    return new Nothing();
	  }
	};

	exports.clone = function(attrs, src, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [toComponent(src).clone(options)]);
	  } else {
	    return toComponent(attrs).clone(src);
	  }
	};

	exports.if_ = function(attrs, test, then_, else_, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new If(test, then_, else_, options)]);
	  } else {
	    return new If(attrs, test, then_, else_);
	  }
	};

	exports.case_ = function(attrs, test, map, else_, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Case(test, map, else_, options)]);
	  } else {
	    return new Case(attrs, test, map, else_);
	  }
	};

	exports.func = function(attrs, fn, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Func(fn, options)]);
	  } else {
	    return new Func(attrs, fn);
	  }
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

	exports.repeat = function(attrs, list, itemFn, options) {
	  if (isAttrs(attrs)) {
	    return new Tag('div', attrs, [new Repeat(list, itemFn, options)]);
	  } else {
	    return new Repeat(attrs, list, itemFn);
	  }
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var extend, extendEventValue, getBindProp, input, inputTypes, tag, tagName, tagNames, type, _fn, _fn1, _i, _j, _len, _len1, _ref,
	  __slice = [].slice;

	extend = __webpack_require__(6);

	tag = __webpack_require__(27).tag;

	extendEventValue = __webpack_require__(20).extendEventValue;

	getBindProp = __webpack_require__(13).getBindProp;

	tagNames = "a abbr acronym address area b base bdo big blockquote body br button caption cite code col colgroup dd del dfn div dl" + " dt em fieldset form h1 h2 h3 h4 h5 h6 head html hr i img input ins kbd label legend li link map meta noscript object" + " ol optgroup option p param pre q samp script select small span strong style sub sup" + " table tbody td textarea tfoot th thead title tr tt ul var header footer section";

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

	inputTypes = 'text textarea checkbox radio date email number'.split(' ');

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
	    if (value.setable) {
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
	    attrs = attrs || Object.create(null);
	    return input(type, attrs, value);
	  };
	};
	for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
	  type = _ref[_j];
	  _fn1(type);
	}


/***/ },
/* 29 */
/***/ function(module, exports) {

	exports.renderMode = {
	  UNDEFINED: void 0,
	  REPLACE: 1,
	  PATCH_DYNAMIC: 2,
	  PATCH_ALL: 3
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var extend;

	extend = dc.extend;

	extend(dc, __webpack_require__(31), __webpack_require__(38), __webpack_require__(45));

	module.exports = dc;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var hide, show, _ref;

	exports.model = __webpack_require__(33);

	exports.bind = __webpack_require__(34);

	_ref = __webpack_require__(35), show = _ref.show, hide = _ref.hide;

	exports.show = show;

	exports.hide = hide;

	exports.blink = __webpack_require__(32);

	exports.splitter = __webpack_require__(36);

	exports.options = __webpack_require__(37);


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var blink, registerDirective;

	registerDirective = __webpack_require__(21).registerDirective;

	module.exports = blink = function(interval) {
	  return function(comp) {
	    var timer, visible;
	    if (interval == null) {
	      interval = 500;
	    }
	    timer = null;
	    comp.beforeMount(function(baseComponent) {
	      return function() {
	        return timer = setInterval((function() {
	          var visible;
	          return visible = !visible;
	        }), interval);
	      };
	    });
	    comp.afterUnmount(function(baseComponent) {
	      return function() {
	        return clearInterval(timer);
	      };
	    });
	    visible = true;
	    this.style.visibility = function() {
	      if (visible) {
	        return 'visible';
	      } else {
	        return 'hidden';
	      }
	    };
	    return comp;
	  };
	};

	registerDirective('blink', blink);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var extendEventValue, getBindProp, model, registerDirective;

	extendEventValue = dc.extendEventValue, getBindProp = dc.getBindProp;

	registerDirective = __webpack_require__(21).registerDirective;

	module.exports = model = function(binding, eventName) {
	  return function(comp) {
	    var bindProp, props;
	    props = comp.props;
	    bindProp = getBindProp(comp);
	    comp.addActivity(props, bindProp, 'Props');
	    props[bindProp] = binding;
	    comp.bind(eventName || 'onchange', (function() {
	      return binding(this[bindProp]);
	    }), 'before');
	    return comp;
	  };
	};

	registerDirective('model', model);


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var bind, getBindProp, registerDirective;

	registerDirective = __webpack_require__(21).registerDirective;

	getBindProp = dc.getBindProp;

	module.exports = bind = function(binding) {
	  return function(comp) {
	    comp.props[getBindProp(comp)] = binding;
	    return comp;
	  };
	};

	registerDirective('bind', bind);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var hide, registerDirective, show, showHide;

	registerDirective = __webpack_require__(21).registerDirective;


	/* @param test - paramenter expression for directive
	 */

	showHide = function(showing) {
	  return function(test, display) {
	    return function(comp) {
	      return comp.showHide(showing, test, display);
	    };
	  };
	};

	exports.show = show = showHide(true);

	registerDirective('show', show);

	exports.hide = hide = showHide(false);

	registerDirective('hide', hide);


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var Component, classFn, div, pairListDict, registerDirective, span, splitter;

	pairListDict = dc.pairListDict, classFn = dc.classFn, Component = dc.Component, div = dc.div, span = dc.span;

	registerDirective = __webpack_require__(21).registerDirective;

	module.exports = splitter = function(direction) {
	  return function(comp) {
	    var arrawAAttr, arrawBAttr, arrowA, arrowAHovering, arrowB, arrowBHovering, attrs, barsize, buttonClass, children, clientX, cursor, drag, getSize, left, minAWidth, minBWidth, paneA, paneB, percent, pos, right, size, splitBar, splitBarAttr, splitBarAttrCss, splitbarClass, width;
	    attrs = comp.attrs;
	    direction = direction || 'vertical';
	    if (direction === 'vertical') {
	      left = "top";
	      right = "bottom";
	      width = "height";
	      clientX = "clientY";
	      splitbarClass = "splitbarH";
	      buttonClass = "splitbuttonH";
	      cursor = "s-resize";
	    } else {
	      left = "left";
	      right = "right";
	      width = "width";
	      clientX = "clientX";
	      splitbarClass = "splitbarV";
	      buttonClass = "splitbuttonV";
	      cursor = "e-resize";
	    }
	    pos = 200;
	    percent = 0.5;
	    size = null;
	    drag = false;
	    getSize = function() {
	      return size || 600;
	    };
	    children = comp.children.children;
	    paneA = children[0];
	    paneB = children[1];
	    minAWidth = attrs.minAWidth || 0;
	    minBWidth = attrs.minBWidth || 0;
	    splitBarAttr = {
	      "class": splitbarClass,
	      unselectable: "on",
	      style: splitBarAttrCss = {
	        "cursor": cursor,
	        "user-select": "none",
	        "-webkit-user-select": "none",
	        "-khtml-user-select": "none",
	        "-moz-user-select": "none"
	      }
	    };
	    splitBarAttrCss[left] = function() {
	      return pos + 'px';
	    };
	    splitBarAttrCss[width] = barsize = 6;
	    arrowAHovering = false;
	    arrawAAttr = {
	      "class": classFn(buttonClass, {
	        'inactive': function() {
	          return arrowAHovering;
	        }
	      }),
	      unselectable: "on",
	      style: {
	        cursor: 'pointer'
	      },
	      onmouseover: function() {
	        arrowAHovering = true;
	        return comp.update();
	      },
	      onmouseleave: function() {
	        arrowAHovering = false;
	        return comp.update();
	      },
	      onclick: function(e) {
	        pos = minAWidth;
	        return comp.update();
	      },
	      $show: function() {
	        return pos > minAWidth;
	      }
	    };
	    arrowBHovering = false;
	    arrawBAttr = {
	      "class": classFn(buttonClass + ' invert', {
	        'inactive': function() {
	          return arrowBHovering;
	        }
	      }),
	      unselectable: "on",
	      style: {
	        cursor: 'pointer'
	      },
	      onmouseover: function() {
	        arrowBHovering = true;
	        return comp.update();
	      },
	      onmouseleave: function() {
	        arrowBHovering = false;
	        return comp.update();
	      },
	      onclick: function(e) {
	        pos = getSize() - minBWidth;
	        return comp.update();
	      },
	      $show: function() {
	        return getSize() - pos > minBWidth;
	      }
	    };
	    arrowA = div(arrawAAttr);
	    arrowB = div(arrawBAttr);
	    children[2] = paneB;
	    children[1] = splitBar = div(splitBarAttr, span(), arrowA, arrowB);
	    splitBar.bind('mousedown', function(ev) {
	      return drag = true;
	    });
	    dc(document).bind('mouseup', function() {
	      return drag = false;
	    });
	    comp.bind('mousemove', function(ev) {
	      var bounds, pencent, w;
	      event.continuePropagation = true;
	      event.executeDefault = true;
	      if (!drag) {
	        return;
	      }
	      event.continuePropagation = false;
	      event.executeDefault = false;
	      bounds = comp.node.getBoundingClientRect();
	      size = w = bounds[right] - bounds[left];
	      pos = Math.max(ev[clientX] - bounds[left], 0);
	      pencent = pos / w;
	      return comp.update();
	    });
	    paneA.css(pairListDict('position', 'absolute', width, (function() {
	      return pos + 'px';
	    })));
	    paneB.css(pairListDict('position', 'absolute', left, (function() {
	      return (pos + barsize) + 'px';
	    }), width, (function() {
	      return getSize() - (pos + barsize) + 'px';
	    })));
	    comp.css(pairListDict('position', 'absolute'));
	    comp.bind('resize', function(ev) {
	      var bounds, w;
	      ev.preventDefault();
	      ev.stopPropagation();
	      bounds = comp.node.getBoundingClientRect();
	      w = bounds[right] - bounds[left];
	      pos = percent * w;
	      if (pos < minAWidth) {
	        pos = minAWidth;
	      } else if (w - pos < minBWidth) {
	        pos = w - minBWidth;
	      }
	      return comp.update();
	    });
	    return comp;
	  };
	};

	registerDirective('splitter', splitter);


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var List, Tag, option, options, registerDirective, repeat, txt;

	Tag = dc.Tag, List = dc.List, repeat = dc.repeat, txt = dc.txt, option = dc.option;

	registerDirective = __webpack_require__(21).registerDirective;

	module.exports = options = function(items, attrs) {
	  return function(comp) {
	    if (!(comp instanceof Tag) || comp.tagName !== 'select') {
	      throw new Error('options should be only used in select tag');
	    }
	    comp.children = new List([
	      repeat(items, function(item) {
	        return option(attrs, [txt(item)]);
	      })
	    ]);
	    return comp;
	  };
	};

	registerDirective('options', options);


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var extend;

	extend = dc.extend;

	extend(exports, __webpack_require__(40));

	exports.arrow = __webpack_require__(41);

	exports.dialog = __webpack_require__(42);

	extend(exports, __webpack_require__(39));

	exports.comboEdit = __webpack_require__(43);

	extend(exports, __webpack_require__(44));


/***/ },
/* 39 */
/***/ function(module, exports) {

	var combobox, div, extendAttrs, input, list, span;

	list = dc.list, input = dc.input, span = dc.span, div = dc.div, extendAttrs = dc.extendAttrs;

	exports.combobox = combobox = function(attrs, modelValue, valueList, direction) {
	  var comp, disp, item, opts, showingItems;
	  showingItems = false;
	  disp = direction === 'v' || direction === 'vertical' ? 'block' : 'inline-block';
	  comp = null;
	  opts = (function() {
	    var _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = valueList.length; _i < _len; _i++) {
	      item = valueList[_i];
	      _results.push((function(item) {
	        return span({
	          style: {
	            display: disp,
	            border: "1px solid blue",
	            "min-width": "40px"
	          },
	          onclick: (function() {
	            modelValue(item);
	            return comp.update();
	          })
	        }, item);
	      })(item));
	    }
	    return _results;
	  })();
	  attrs = extendAttrs(attrs, {
	    onmouseleave: (function() {
	      showingItems = false;
	      return comp.update();
	    })
	  });
	  return comp = div(attrs, input({
	    $model: modelValue,
	    onmouseenter: (function() {
	      showingItems = true;
	      return comp.update();
	    })
	  }), div({
	    style: {
	      display: function() {
	        if (showingItems) {
	          return 'block';
	        } else {
	          return 'none';
	        }
	      }
	    }
	  }, opts));
	};

	exports.vcombo = function(attrs, modelValue, valueList) {
	  return combobox(attrs, modelValue, valueList, 'vertical');
	};

	exports.hcombo = function(attrs, modelValue, valueList) {
	  return combobox(attrs, modelValue, valueList, 'horizontal');
	};


/***/ },
/* 40 */
/***/ function(module, exports) {

	
	/** @module accordion
	 * @directive accordion
	 */
	var Component, a, accordion, accordionGroup, div, exports, extend, extendAttrs, h4, img, repeat, span;

	extend = dc.extend, div = dc.div, h4 = dc.h4, a = dc.a, span = dc.span, img = dc.img, Component = dc.Component, repeat = dc.repeat, extendAttrs = dc.extendAttrs;

	module.exports = exports = accordion = function(attrs, accordionGroupList, options) {
	  var accordionOptions, comp;
	  attrs = extendAttrs({
	    "class": "panel-group"
	  }, attrs || Object.create(null));
	  accordionOptions = options || Object.create(null);
	  return comp = div(attrs, repeat(accordionGroupList, function(group, index) {
	    var content, groupAttrs, groupOptions, heading;
	    groupAttrs = group[0], heading = group[1], content = group[2], groupOptions = group[3];
	    groupOptions = groupOptions || Object.create(null);
	    groupOptions.toggleOpen = function() {
	      var group2, i, _i, _len;
	      groupOptions.opened = !groupOptions.opened;
	      if (accordionOptions.closeOthers && groupOptions.opened) {
	        for (i = _i = 0, _len = accordionGroupList.length; _i < _len; i = ++_i) {
	          group2 = accordionGroupList[i];
	          if (i !== index) {
	            group2[3].opened = false;
	          }
	        }
	      }
	      return comp.update();
	    };
	    return accordionGroup(groupAttrs, heading, content, groupOptions);
	  }));
	};

	exports.accordionGroup = accordionGroup = function(attrs, heading, content, options) {
	  return div({
	    "class": "panel panel-default"
	  }, div({
	    "class": "panel-heading",
	    onclick: options.toggleOpen
	  }, h4({
	    "class": "panel-title"
	  }, div({
	    "class": "accordion-toggle"
	  }, span({
	    "class": {
	      'text-muted': function() {
	        return options.disabled;
	      }
	    }
	  }, heading)))), div({
	    "class": {
	      "panel-collapse": function() {
	        return !options.opened;
	      }
	    },
	    style: {
	      display: function() {
	        if (options.opened) {
	          return 'block';
	        } else {
	          return 'none';
	        }
	      }
	    }
	  }, div({
	    "class": "panel-body"
	  }, content)));
	};

	exports.accordion = accordion;


/***/ },
/* 41 */
/***/ function(module, exports) {

	var arrowStyle, div, extendAttrs, reverseSide;

	div = dc.div, extendAttrs = dc.extendAttrs;

	reverseSide = {
	  left: 'right',
	  right: 'left',
	  top: 'bottom',
	  bottom: 'top'
	};

	arrowStyle = function(direction, size, color) {
	  var props, sideStyle;
	  props = {
	    width: 0,
	    height: 0
	  };
	  sideStyle = size + "px solid transparent";
	  if (direction === 'left' || direction === 'right') {
	    props["border-top"] = props["border-bottom"] = sideStyle;
	  } else {
	    props["border-left"] = props["border-right"] = sideStyle;
	  }
	  props["border-" + reverseSide[direction]] = size + "px solid " + color;
	  return props;
	};

	module.exports = function(attrs, direction, size, color) {
	  attrs = extendAttrs(attrs, {
	    style: arrowStyle(direction, size, color)
	  });
	  return div(attrs);
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	var Component, div, globalID, list;

	Component = dc.Component, list = dc.list, div = dc.div;

	globalID = 0;

	module.exports = function(options, template) {
	  var closeCallback, dlg, openCallback;
	  if (options.showClose) {
	    template = list(div({
	      "class": "dcdialog-close",
	      style: {
	        position: 'absolute',
	        "z-index": 10001,
	        top: 0,
	        right: '80px'
	      },
	      onclick: (function() {
	        return dlg.close();
	      })
	    }), template);
	  }
	  if (options.overlay) {
	    template = list(div({
	      "class": "dcdialog-overlay",
	      style: {
	        "z-index": 10000
	      }
	    }), div({
	      "class": "dcdialog-content",
	      style: {
	        position: 'absolute',
	        "z-index": 10001
	      }
	    }, template));
	  } else {
	    template = div({
	      "class": "dcdialog-content",
	      style: {
	        "z-index": 10001
	      }
	    }, template);
	  }
	  dlg = div({
	    id: 'dcdialog' + (++globalID),
	    "class": "dcdialog",
	    style: {
	      position: 'absolute',
	      top: '0px',
	      left: '0px',
	      "z-index": 9999
	    }
	  }, template);
	  openCallback = options.openCallback;
	  dlg.open = function() {
	    openCallback && openCallback();
	    return dlg.mount();
	  };
	  closeCallback = options.closeCallback;
	  dlg.close = function() {
	    dlg.unmount();
	    return closeCallback && closeCallback();
	  };
	  if (options.escClose) {
	    dlg.on('beforeMount', function() {
	      var escHandler;
	      escHandler = function(event) {
	        var esc;
	        esc = 27;
	        if (event.which === esc || event.keyCode === esc) {
	          return dlg.close();
	        }
	      };
	      return document.body.addEventListener('keydown', escHandler);
	    });
	    dlg.on('afterUnmount', function() {
	      return document.body.removeEventListener('keydown', escHandler);
	    });
	  }
	  return dlg;
	};


/***/ },
/* 43 */
/***/ function(module, exports) {

	var extendAttrs, input, list, select;

	list = dc.list, input = dc.input, select = dc.select, extendAttrs = dc.extendAttrs;

	module.exports = function(attrs, modelValue, valueList) {
	  var inputAttrs, sel;
	  if (modelValue) {
	    attrs = extendAttrs(attrs, {
	      directives: [model(modelValue), options(valueList)]
	    });
	  } else {
	    attrs = extendAttrs({
	      directives: options(valueList)
	    });
	  }
	  sel = select(attrs);
	  inputAttrs = {
	    style: {
	      position: 'absolute',
	      top: function() {
	        return sel.top();
	      },
	      left: function() {
	        return sel.left();
	      },
	      height: function() {
	        return (sel.height() - 10) + 'px';
	      },
	      width: function() {
	        return (sel.width() - 10) + 'px';
	      }
	    },
	    value: function() {
	      return modelValue.value;
	    },
	    onchange: function() {
	      return modelValue.set(this.value);
	    }
	  };
	  return list(sel, input(inputAttrs));
	};


/***/ },
/* 44 */
/***/ function(module, exports) {

	var AutoWidthEdit, Tag, div, overAttrs, text,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	div = dc.div, text = dc.text, overAttrs = dc.overAttrs, Tag = dc.Tag;

	exports.AutoWidthEdit = AutoWidthEdit = (function(_super) {
	  __extends(AutoWidthEdit, _super);

	  function AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn) {
	    var editWidth, self, testSubject, testSubjectStyle, _inputAttrs;
	    if (inputKeyFn == null) {
	      inputKeyFn = this.inputKeyFn;
	    }
	    self = this;
	    editWidth = 48;
	    testSubjectStyle = {
	      position: 'absolute',
	      top: '30px',
	      width: 'auto',
	      height: '20px',
	      whiteSpace: 'nowrap',
	      display: 'inline-block',
	      margin: '0',
	      padding: '0',
	      fontSize: function() {
	        return self.css('fontSize');
	      },
	      fontFamily: function() {
	        return self.css('fontFamily');
	      },
	      fontWeight: function() {
	        return self.css('fontWeight');
	      },
	      letterSpacing: function() {
	        return self.css('letterSpacing');
	      },
	      visibility: 'hidden'
	    };
	    testSubject = div({
	      style: testSubjectStyle
	    }, ((function(_this) {
	      return function() {
	        return _this.value;
	      };
	    })(this)));
	    this.inputKeyFn = function(event, comp) {
	      var node;
	      event.executeDefault = true;
	      node = comp.node;
	      self.value = node.value;
	      editWidth = testSubject.node.getBoundingClientRect().width;
	      self.update();
	      return node.focus();
	    };
	    _inputAttrs = {
	      style: {
	        position: 'absolute',
	        'z-index': '10',
	        width: function() {
	          return Math.max(Math.floor(editWidth) + 40, 48) + 'px';
	        },
	        whiteSpace: 'nowrap'
	      },
	      onkeydown: function(event, comp) {
	        return self.inputKeyFn(event, comp);
	      }
	    };
	    this.inputComp = text(overAttrs(_inputAttrs, inputAttrs));
	    contextEditAttrs = overAttrs({
	      onclick: function(event, comp) {
	        return this.focus();
	      }
	    }, contextEditAttrs);
	    AutoWidthEdit.__super__.constructor.call(this, 'div', contextEditAttrs, [this.inputComp, testSubject]);
	  }

	  return AutoWidthEdit;

	})(Tag);

	exports.autoWidthEdit = function(contextEditAttrs, inputAttrs, inputKeyFn) {
	  return new AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn);
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	var duplex, bound;

	bound = dc.bound, duplex = dc.duplex;

	exports.bindings = function(model) {
	  var key, result;
	  result = Object.create(null);
	  for (key in model) {
	    result['$' + key] = duplex(model, key);
	    result['_' + key] = bound(model, key);
	  }
	  return result;
	};


/***/ }
/******/ ])
});
;