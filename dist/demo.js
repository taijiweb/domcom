/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/index.coffee");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/demo-choose-web-framework.coffee":
/*!***********************************************!*\
  !*** ./demo/demo-choose-web-framework.coffee ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nvar _default = module.exports = function () {\n  var comp, frameworks, onBlur, view;\n\n  onBlur = function onBlur(event) {\n    comp.otherFramework = event.target.value;\n    comp.update();\n    comp.textNode.focus();\n  };\n\n  frameworks = ['Domcom', 'jQuery', 'Angular', 'React', 'Backbone', 'Ember'];\n\n  view = function view() {\n    var currentFrameWorks, frameworkLiItems;\n    currentFrameWorks = frameworks.concat([comp.otherFramework || 'other']);\n    frameworkLiItems = currentFrameWorks.map(function (item) {\n      var onClick;\n\n      onClick = function onClick() {\n        return comp.choice = item;\n      };\n\n      return ['li', {\n        onClick: onClick\n      }, \"\".concat(item)];\n    });\n    return ['div', ['label', 'Please choose: '], ['ol', {}].concat(_toConsumableArray(frameworkLiItems)), ['div', \"You perfer \", comp.choice, \".\"], ['label', 'add some others: '], ['text', {\n      onBlur: onBlur,\n      value: comp.otherFramework,\n      key: 'other-framework',\n      ref: function ref(el) {\n        return comp.textNode = el;\n      },\n      keepid: 1\n    }]];\n  };\n\n  return comp = dc({\n    view: view,\n    choice: 'Domcom'\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-choose-web-framework.coffee?");

/***/ }),

/***/ "./demo/demo-controls.coffee":
/*!***********************************!*\
  !*** ./demo/demo-controls.coffee ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var view;\n  view = ['div', ['checkbox', 'a'], ['text', 'a'], ['checkbox', 'b'], ['text', 'b']];\n  return dc({\n    view: view,\n    a: true,\n    b: true\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-controls.coffee?");

/***/ }),

/***/ "./demo/demo-counter.coffee":
/*!**********************************!*\
  !*** ./demo/demo-counter.coffee ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var comp, startCounter, stopCounter, timer, view;\n  timer = null;\n\n  view = function view() {\n    var comp, reset, start, stop;\n    comp = this;\n\n    start = function start() {\n      startCounter();\n    };\n\n    stop = function stop() {\n      return stopCounter();\n    };\n\n    reset = function reset() {\n      stopCounter();\n      return comp.count = 0;\n    };\n\n    return ['div', ['p', this.count], ['p', {\n      onClick: stop,\n      keepid: 101\n    }, 'stop'], ['p', {\n      onClick: reset,\n      keepid: 102\n    }, 'reset'], ['p', {\n      onClick: start,\n      keepid: 103\n    }, 'start']];\n  };\n\n  comp = dc({\n    view: view,\n    count: 0\n  });\n\n  startCounter = function startCounter() {\n    timer = setInterval(function () {\n      return comp.count++;\n    }, 300);\n  };\n\n  stopCounter = function stopCounter() {\n    return clearInterval(timer);\n  };\n\n  comp.on('mounted', function () {\n    return startCounter();\n  });\n  comp.on('unmounting', function () {\n    return stopCounter();\n  });\n  return comp;\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-counter.coffee?");

/***/ }),

/***/ "./demo/demo-debug.coffee":
/*!********************************!*\
  !*** ./demo/demo-debug.coffee ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _exports;\n\n_exports = {};\n\n_exports.demoEachPush = function () {\n  var comp, list, view;\n  list = [1, 2];\n  view = ['div', ['div', this.list.map(function (item) {\n    return ['p', item];\n  })], 'some other thing'];\n  comp = dc({\n    view: view,\n    list: list\n  });\n  comp.mount();\n  lst.push(3);\n  return comp.update();\n};\n\n_exports.demoIfEach = function () {\n  var comp, view;\n\n  view = function view() {\n    if (this.showing) {\n      return this.list.map(function (item) {\n        return ['div', {}, item];\n      });\n    } else {\n      return null;\n    }\n  };\n\n  comp = {\n    view: view,\n    list: [1, 2]\n  };\n  comp.mount();\n  comp.showing = false;\n  comp.showing = true;\n  return comp;\n};\n\n_exports.demoModelOnMultipleInput = function () {\n  var comp, view;\n\n  view = function view() {\n    return ['div', ['text', {\n      '#': [[dc.model, 'x']]\n    }], ['text', {\n      '#': [[dc.model, 'x']]\n    }]];\n  };\n\n  return comp = dc({\n    view: view,\n    x: 'input some text'\n  });\n};\n\nvar _default = _exports;\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-debug.coffee?");

/***/ }),

/***/ "./demo/demo-each.coffee":
/*!*******************************!*\
  !*** ./demo/demo-each.coffee ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var comp, i, list, onClick, view;\n  list = [1, 2, 3, 4, 5, 6];\n  i = 7;\n\n  onClick = function onClick() {\n    list.push(i++);\n    return comp.update();\n  };\n\n  view = function view() {\n    return ['div', {\n      onClick: onClick\n    }, 'click to append: ', this.list.join(' ')];\n  };\n\n  return comp = dc({\n    view: view,\n    list: list\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-each.coffee?");

/***/ }),

/***/ "./demo/demo-function-lead-item.coffee":
/*!*********************************************!*\
  !*** ./demo/demo-function-lead-item.coffee ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\nvar if_;\n\nif_ = function if_(test, then_, else_) {\n  if (test) {\n    return then_;\n  } else {\n    return else_;\n  }\n};\n\nvar _default = module.exports = function () {\n  var view;\n\n  view = function view() {\n    return ['div', ['text', 'x'], [if_, !(this.x * 1), ['div', 'It is 0 or NaN.'], ['div', 'it is other number']]];\n  };\n\n  return dc({\n    view: view,\n    x: 1\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-function-lead-item.coffee?");

/***/ }),

/***/ "./demo/demo-show-hide.coffee":
/*!************************************!*\
  !*** ./demo/demo-show-hide.coffee ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var comp, view;\n\n  view = function view(data) {\n    var _this = this;\n\n    var display, onClick;\n\n    if (this.display) {\n      display = 'block';\n    } else {\n      display = 'none';\n    }\n\n    onClick = function onClick() {\n      return _this.display = !_this.display;\n    };\n\n    return ['div', ['div', {\n      onClick: onClick\n    }, 'click to show or hide by changing style.display'], ['p', {\n      style: {\n        display: display\n      }\n    }, 'this is the controlled content']];\n  };\n\n  comp = dc({\n    view: view,\n    display: true\n  });\n  return comp;\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-show-hide.coffee?");

/***/ }),

/***/ "./demo/demo-sum.coffee":
/*!******************************!*\
  !*** ./demo/demo-sum.coffee ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var comp, data, view;\n  data = {\n    a: 1,\n    b: 2\n  };\n\n  view = function view(data) {\n    var props1, props2;\n    props1 = {\n      focusid: 1,\n      value: data.a,\n      onChange: function onChange(event) {\n        data.a = event.target.value * 1;\n        return comp.update();\n      }\n    };\n    props2 = {\n      focusid: 2,\n      value: data.b,\n      onChange: function onChange(event) {\n        data.b = event.target.value * 1;\n        return comp.update();\n      }\n    };\n    return ['div', {\n      key: 0\n    }, ['text', props1], ['text', props2], ['p', data.a + data.b]];\n  };\n\n  return comp = dc({\n    data: data,\n    view: view\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-sum.coffee?");

/***/ }),

/***/ "./demo/demo-text-model.coffee":
/*!*************************************!*\
  !*** ./demo/demo-text-model.coffee ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _default = module.exports = function () {\n  var comp, view;\n\n  view = function view() {\n    return ['div', ['text', {\n      $model: 'a',\n      key: 1,\n      ref: function ref(el) {\n        return comp.textInput = el;\n      }\n    }], ['p', {}, this.a]];\n  };\n\n  comp = dc({\n    view: view,\n    a: 'hello'\n  });\n  return comp.on('updated', function () {\n    comp.textInput.focus();\n  });\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/demo-text-model.coffee?");

/***/ }),

/***/ "./demo/index.coffee":
/*!***************************!*\
  !*** ./demo/index.coffee ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar demoMap, runDemo;\ndc.addReactProxy(window.React, window.ReactDOM, window.React.Component);\n\nvar _require = __webpack_require__(/*! ./util */ \"./demo/util.coffee\");\n\nrunDemo = _require.runDemo;\ndemoMap = _require.demoMap;\n\nwindow.onload = function () {\n  //  demo = require('./demo-text-model')\n  //  comp = demo()\n  //  comp.mount('#demo')\n  //  return\n  //  comp = demoMap[\"show hide\"]()\n  //  comp = demoMap[\"counter\"]()\n  //  comp = demoMap[\"dialog\"]()\n  //  comp = demoMap[\"event\"]()\n  //  comp = demoMap[\"controls\"]()\n  //  comp = demoMap[\"if\"]()\n  //  comp = demoMap[\"each1\"]()\n  //  comp = demoMap[\"each2\"]()\n  //  comp = demoMap[\"each3\"]()\n  //  comp = demoMap[\"each4\"]()\n  //  comp = demoMap[\"switch 1 2 3 4\"]()\n  //  comp = demoMap[\"splitter\"]()\n  //  comp = demoMap[\"sum\"]()\n  //  comp = demoMap[\"text model\"]()\n  //  comp = demoMap[\"auto width edit\"]()\n  //  comp = demoMap[\"mount/unmount\"]()\n  //  comp = chooseFramework()\n  //  comp.mount()\n  //  demoEachPush()\n  //  demoIfEach()\n  //  demoModelOnMultipleInput()\n  return runDemo(demoMap, 'choose web framework', '#demo');\n};\n\n//# sourceURL=webpack:///./demo/index.coffee?");

/***/ }),

/***/ "./demo/util.coffee":
/*!**************************!*\
  !*** ./demo/util.coffee ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _demoChooseWebFramework = _interopRequireDefault(__webpack_require__(/*! ./demo-choose-web-framework */ \"./demo/demo-choose-web-framework.coffee\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n// domcom demo\nvar demoEachPush, demoIfEach, demoModelOnMultipleInput, eachDemo, _exports, makeDemoComponent;\n\neachDemo = __webpack_require__(/*! ./demo-each */ \"./demo/demo-each.coffee\");\n\nvar _require = __webpack_require__(/*! ./demo-debug */ \"./demo/demo-debug.coffee\");\n\ndemoEachPush = _require.demoEachPush;\ndemoIfEach = _require.demoIfEach;\ndemoModelOnMultipleInput = _require.demoModelOnMultipleInput;\n\nvar _default = module.exports = _exports = {};\n\nexports.default = _default;\n_exports.demoMap = {\n  'choose web framework': _demoChooseWebFramework.default,\n  \"show hide\": __webpack_require__(/*! ./demo-show-hide */ \"./demo/demo-show-hide.coffee\"),\n  counter: __webpack_require__(/*! ./demo-counter */ \"./demo/demo-counter.coffee\"),\n  controls: __webpack_require__(/*! ./demo-controls */ \"./demo/demo-controls.coffee\"),\n  'function lead item': __webpack_require__(/*! ./demo-function-lead-item */ \"./demo/demo-function-lead-item.coffee\"),\n  sum: __webpack_require__(/*! ./demo-sum */ \"./demo/demo-sum.coffee\"),\n  'text model': __webpack_require__(/*! ./demo-text-model */ \"./demo/demo-text-model.coffee\")\n};\n\n_exports.makeDemoComponent = makeDemoComponent = function makeDemoComponent(demoMap, initItem) {\n  var comp, componentsMap, key, view;\n  componentsMap = {};\n\n  for (key in demoMap) {\n    comp = demoMap[key];\n\n    if (typeof comp === 'function') {\n      componentsMap[key] = comp();\n    } else {\n      componentsMap[key] = comp;\n    }\n  }\n\n  console.log(' componentsMap: ', componentsMap);\n\n  view = function view() {\n    return ['div', ['select', {\n      $options: Object.keys(demoMap),\n      $model: 'select'\n    }], ['div', componentsMap[comp.select]]];\n  };\n\n  return comp = dc({\n    view: view,\n    select: initItem\n  });\n};\n\n_exports.runDemo = function (demoMap, initItem, element) {\n  var comp;\n  comp = makeDemoComponent(demoMap, initItem);\n  return comp.mount(element);\n};\n\n//# sourceURL=webpack:///./demo/util.coffee?");

/***/ })

/******/ });