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
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/coffee/index.coffee");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/coffee/demo-controls.coffee":
/*!******************************************!*\
  !*** ./demo/coffee/demo-controls.coffee ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar a, bindings, checkbox, list, p, text;\nvar _dc = dc;\nlist = _dc.list;\na = _dc.a;\ncheckbox = _dc.checkbox;\ntext = _dc.text;\np = _dc.p;\nbindings = _dc.bindings;\n\nfunction _default() {\n  var a$, cbx1, cbx2, checkboxes, text1, text2, texts;\n\n  var _bindings = bindings({\n    a: 1\n  });\n\n  a$ = _bindings.a$;\n  checkboxes = list(cbx1 = checkbox(a$), cbx2 = checkbox(a$));\n  texts = list(text1 = text(a$), text2 = text(a$));\n  a$(6);\n  return list(checkboxes, texts).renderWhen([cbx1, cbx2, text1, text2], 'change');\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-controls.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-counter.coffee":
/*!*****************************************!*\
  !*** ./demo/coffee/demo-counter.coffee ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar p, see, txt;\nvar _dc = dc;\ntxt = _dc.txt;\np = _dc.p;\nsee = _dc.see;\n\nfunction _default() {\n  var counter, counter$;\n  counter$ = see(counter = 0);\n  return p(txt(counter$)).on('willAttach', function () {\n    var count, countHandle;\n\n    count = function count() {\n      counter$(counter++);\n\n      if (counter === 1001) {\n        return clearInterval(countHandle);\n      }\n    };\n\n    return countHandle = setInterval(count, 1);\n  }).renderWhen(setInterval, 16, {\n    clear: function clear() {\n      return counter >= 1000;\n    }\n  });\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-counter.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-debug.coffee":
/*!***************************************!*\
  !*** ./demo/coffee/demo-debug.coffee ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar div, duplex, each, _exports, if_, list, p, see, text;\n\nvar _dc = dc;\nsee = _dc.see;\nif_ = _dc.if_;\nlist = _dc.list;\neach = _dc.each;\ndiv = _dc.div;\np = _dc.p;\ntext = _dc.text;\nduplex = _dc.duplex;\n//export default\n_exports = {};\n\n_exports.demoEachPush = function () {\n  var comp, lst;\n  lst = [1, 2];\n  comp = list(each(lst, function (item) {\n    return p(item);\n  }), 'some other thing');\n  comp.mount();\n  lst.push(3);\n  return comp.render();\n};\n\n_exports.demoIfEach = function () {\n  var comp, lst4, showingEach$;\n  showingEach$ = see(true);\n  lst4 = [1, 2];\n  comp = if_(showingEach$, each(lst4, function (item) {\n    return div(item);\n  }));\n  comp.mount();\n  showingEach$(false);\n  comp.render();\n  dc.clean();\n  showingEach$(true);\n  comp.render();\n  return dc.clean();\n};\n\n_exports.demoModelOnMultipleInput = function () {\n  var a, text1, text2;\n  a = {}; //a_x$ = duplex(a, 'x')\n\n  text1 = text({\n    $model: duplex(a, 'x')\n  });\n  text2 = text({\n    $model: duplex(a, 'x')\n  });\n  return list(text1, text2).renderWhen([text1, text2], 'change').mount();\n};\n\nvar _default = _exports;\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/coffee/demo-debug.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-each.coffee":
/*!**************************************!*\
  !*** ./demo/coffee/demo-each.coffee ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar each, _exports, list, p, txt;\n\nvar _dc = dc;\nlist = _dc.list;\neach = _dc.each;\np = _dc.p;\ntxt = _dc.txt;\n//export default\n_exports = {};\n\n_exports.eachDemo1 = function () {\n  var comp, lst1;\n  lst1 = [1, 2];\n  return comp = list(lst1);\n};\n\n_exports.eachDemo2 = function () {\n  var lst2;\n  lst2 = [1, 2];\n  return each(lst2, function (item) {\n    return p(item);\n  });\n};\n\n_exports.eachDemo3 = function () {\n  var comp, lst3;\n  lst3 = [1, 2, 3, 4, 5, 6];\n  comp = each(lst3, function (item) {\n    return p(item);\n  });\n  comp.on('willAttach', function () {\n    setTimeout(function () {\n      lst3.push(7);\n      return comp.render();\n    }, 1000);\n    return setTimeout(function () {\n      lst3.setLength(4);\n      comp.render();\n      return dc.clean();\n    }, 2000);\n  });\n  return comp;\n};\n\n_exports.eachDemo4 = function () {\n  var comp, lst4;\n  lst4 = [1, 2, 3, 4, 5, 6];\n  comp = each(lst4, function (item) {\n    return txt(item);\n  });\n  comp.on('willAttach', function () {\n    setTimeout(function () {\n      lst4.push(7);\n      return comp.render();\n    }, 1000);\n    return setTimeout(function () {\n      lst4.setLength(4);\n      comp.render();\n      return dc.clean();\n    }, 2000);\n  });\n  return comp;\n};\n\nvar _default = _exports;\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/coffee/demo-each.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-event.coffee":
/*!***************************************!*\
  !*** ./demo/coffee/demo-event.coffee ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar a, checkbox, list, p, text;\nvar _dc = dc;\nlist = _dc.list;\na = _dc.a;\ncheckbox = _dc.checkbox;\ntext = _dc.text;\np = _dc.p;\n\nfunction _default() {\n  var noPropagation, propagation;\n  propagation = a({\n    onclick: function onclick() {\n      return alert('parent');\n    }\n  }, p({\n    onclick: function onclick(event) {\n      alert('child');\n      return event.continuePropagation = true;\n    }\n  }, 'propagation'));\n  noPropagation = a({\n    onclick: function onclick() {\n      return alert('parent');\n    }\n  }, p({\n    onclick: function onclick(event) {\n      return alert('child');\n    }\n  }, 'do not propagation')); // below run ok\n  //  comp3 = a({onmouseleave: -> alert('parent')},\n  //    p({onmouseleave: (event) -> alert('child'); event.continuePropagation = true}, 'propagation leave'))\n  //  comp3.mount()\n\n  return list(propagation, noPropagation);\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-event.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-if-component.coffee":
/*!**********************************************!*\
  !*** ./demo/coffee/demo-if-component.coffee ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar div, if_, list, see, text;\nvar _dc = dc;\nlist = _dc.list;\nif_ = _dc.if_;\ntext = _dc.text;\ndiv = _dc.div;\nsee = _dc.see;\n\n(function () {\n  var comp, x;\n  x = see(0, parseNumber);\n  return comp = list(text({\n    onchange: function onchange() {\n      x = parseInt(this.node.value);\n      comp.render();\n      return dc.clean();\n    }\n  }, x), if_(x, div(1), div(2)));\n});\n\nfunction _default() {\n  //  comp = list(text({onchange: -> x = this.node.value; comp.render()}, (->x)), div(->x))\n  //  comp = list(number({onchange: -> x = parseInt(this.node.value); comp.render()}, (->x) ), div(->x), if_((-> x), div(1), div(2)))\n  // comp.mount()\n  var comp, x;\n  x = see(0, parseFloat);\n  return comp = list(text({\n    onchange: function onchange() {\n      comp.render();\n      return dc.clean();\n    }\n  }, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')));\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-if-component.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-mount-unmount.coffee":
/*!***********************************************!*\
  !*** ./demo/coffee/demo-mount-unmount.coffee ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar div, if_, list, see;\nvar _dc = dc;\nlist = _dc.list;\ndiv = _dc.div;\nsee = _dc.see;\nif_ = _dc.if_;\n\nfunction _default() {\n  var active, if1;\n  active = see(true);\n  return list(div({\n    onclick: function onclick() {\n      active(true);\n      return if1.render();\n    }\n  }, 'mount'), div({\n    onclick: function onclick() {\n      active(false);\n      if1.render();\n      return dc.clean();\n    }\n  }, 'unmount'), if1 = if_(active, div('toggle me')));\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-mount-unmount.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-show-hide.coffee":
/*!*******************************************!*\
  !*** ./demo/coffee/demo-show-hide.coffee ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar div, flow, list, p, see, text, toggle;\nvar _dc = dc;\nlist = _dc.list;\ntext = _dc.text;\ndiv = _dc.div;\np = _dc.p;\nsee = _dc.see;\nflow = _dc.flow;\ntoggle = flow.toggle;\n\nfunction _default() {\n  var comp, x;\n  x = see(true);\n  return comp = list(div({\n    onclick: function onclick() {\n      toggle(x);\n      return comp.render();\n    }\n  }, 'show/hide by changing style.display'), p({\n    class: {},\n    style: {\n      display: function display() {\n        if (x()) {\n          return 'block';\n        } else {\n          return 'none';\n        }\n      }\n    }\n  }, 'asdfdfs'));\n}\n\n; //comp.mount()\n\n//# sourceURL=webpack:///./demo/coffee/demo-show-hide.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-sum.coffee":
/*!*************************************!*\
  !*** ./demo/coffee/demo-sum.coffee ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\nvar demoSum, flow, list, p, see, text;\nvar _dc = dc;\nsee = _dc.see;\nflow = _dc.flow;\nlist = _dc.list;\ntext = _dc.text;\np = _dc.p;\n\ndemoSum = function demoSum() {\n  var a, b, comp, p1, t1, t2;\n  a = see(1, parseFloat);\n  b = see(2, parseFloat);\n  comp = list(t1 = text({\n    value: a,\n    onchange: function onchange() {\n      return a(this.node.value);\n    }\n  }), t2 = text({\n    value: b,\n    onchange: function onchange() {\n      return b(this.node.value);\n    }\n  }), p1 = p(flow.add(a, b))); //comp = list(t1=text({$model: a}), t2=text({$model:b}), p1 = p(flow.add a, b))\n  //  comp = list(t1=text(a), t2=text(b), p1 = p(flow.add a, b))\n\n  return comp.renderWhen([t1, t2], 'change');\n};\n\nvar _default = demoSum = function demoSum() {\n  var a, b, p1, t1, t2;\n  a = see(1);\n  b = see(2);\n  return list(t1 = text({\n    value: a,\n    onchange: function onchange() {\n      return a(this.node.value * 1);\n    }\n  }), t2 = text({\n    value: b,\n    onchange: function onchange() {\n      return b(this.node.value * 1);\n    }\n  }), p1 = p(flow.add(a, b))).renderWhen([t1, t2], 'change');\n};\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/coffee/demo-sum.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-switch-1-2-3-4.coffee":
/*!************************************************!*\
  !*** ./demo/coffee/demo-switch-1-2-3-4.coffee ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar div, each, flow, func, list, number, see;\nvar _dc = dc;\nfunc = _dc.func;\nsee = _dc.see;\nflow = _dc.flow;\neach = _dc.each;\nlist = _dc.list;\ndiv = _dc.div;\nnumber = _dc.number;\n\n(function () {\n  var comp, indexInput, lst, x;\n  x = 0;\n  comp = null;\n  indexInput = number({\n    onchange: function onchange() {\n      x = parseInt(this.node.value);\n      comp.render();\n      return dc.clean();\n    }\n  });\n  lst = each([0, 1, 2, 3], function (item) {\n    return div({\n      style: {\n        display: function display() {\n          if (item === x) {\n            return 'block';\n          } else {\n            return 'none';\n          }\n        }\n      }\n    }, item);\n  });\n  return comp = list(indexInput, lst);\n});\n\n(function () {\n  // The above is just for demonstration\n  // it can be implemented like below:\n  var comp, indexInput, x;\n  x = 0;\n  comp = null;\n  indexInput = number({\n    onchange: function onchange() {\n      x = parseInt(this.node.value);\n      comp.render();\n      return dc.clean();\n    }\n  });\n  return comp = list(indexInput, func(function () {\n    if (x >= 0 && x <= 3) {\n      return div(x);\n    }\n  }));\n});\n\nfunction _default() {\n  // by using flow, it can be improved like below\n  var comp, num, x;\n  x = see(0); //comp = list(number(x).bind('change', -> comp.render()), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))\n  //  comp = list(number(x).bind('change', pane.update.bind(pane)), pane=func(flow x, -> v = x(); if v>=0 and v<=3 then div v))\n  //list(num=number(x), func(flow x, -> v = x(); if v>=0 and v<=3 then div v)).renderWhen(num, 'change')\n\n  comp = list(num = number(x), func(flow(x, function () {\n    var v;\n    v = x();\n\n    if (v >= 0 && v <= 3) {\n      return div(v);\n    }\n  })));\n  return comp.renderWhen(num, 'change');\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-switch-1-2-3-4.coffee?");

/***/ }),

/***/ "./demo/coffee/demo-text-model.coffee":
/*!********************************************!*\
  !*** ./demo/coffee/demo-text-model.coffee ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = _default;\nvar a, bindings, checkbox, list, text;\nvar _dc = dc;\nlist = _dc.list;\nbindings = _dc.bindings;\na = _dc.a;\ncheckbox = _dc.checkbox;\ntext = _dc.text;\n\nfunction _default() {\n  var a$, attrs, comp;\n\n  var _bindings = bindings({\n    a: 1\n  });\n\n  a$ = _bindings.a$;\n  attrs = {\n    onchange: function onchange() {\n      return comp.render();\n    }\n  };\n  return comp = list(a = text(attrs, a$), text(attrs, a$));\n}\n\n;\n\n//# sourceURL=webpack:///./demo/coffee/demo-text-model.coffee?");

/***/ }),

/***/ "./demo/coffee/index.coffee":
/*!**********************************!*\
  !*** ./demo/coffee/index.coffee ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _util = __webpack_require__(/*! ./util */ \"./demo/coffee/util.coffee\");\n\ndc.alwaysRender = true;\n\nwindow.onload = function () {\n  //  comp = accordion()\n  //  comp = demoCombo()\n  //  comp = demoTriangle()\n  //  comp = demoMap[\"show hide\"]()\n  //  comp = demoMap[\"counter\"]()\n  //  comp = demoMap[\"dialog\"]()\n  //  comp = demoMap[\"event\"]()\n  //  comp = demoMap[\"controls\"]()\n  //  comp = demoMap[\"if\"]()\n  //  comp = demoMap[\"each1\"]()\n  //  comp = demoMap[\"each2\"]()\n  //  comp = demoMap[\"each3\"]()\n  //  comp = demoMap[\"each4\"]()\n  //  comp = demoMap[\"switch 1 2 3 4\"]()\n  //  comp = demoMap[\"splitter\"]()\n  //  comp = demoMap[\"sum\"]()\n  //  comp = demoMap[\"text model\"]()\n  //  comp = demoMap[\"auto width edit\"]()\n  //  comp = demoMap[\"mount/unmount\"]()\n  //  comp = chooseFramework()\n  //  comp.mount()\n  //  demoEachPush()\n  //  demoIfEach()\n  //  demoModelOnMultipleInput()\n  return (0, _util.runDemo)(_util.demoMap, 'choose web framework');\n};\n\n//# sourceURL=webpack:///./demo/coffee/index.coffee?");

/***/ }),

/***/ "./demo/coffee/util.coffee":
/*!*********************************!*\
  !*** ./demo/coffee/util.coffee ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _demoEach = __webpack_require__(/*! ./demo-each */ \"./demo/coffee/demo-each.coffee\");\n\nvar _demoDebug = __webpack_require__(/*! ./demo-debug */ \"./demo/coffee/demo-debug.coffee\");\n\nfunction _templateObject() {\n  var data = _taggedTemplateLiteral([\"./demo-choose-web-framework\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\nfunction _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }\n\n// domcom demo\nvar case_, div, each, _exports, func, if_, list, makeDemoComponent, p, see, select;\n\nvar _dc = dc;\nselect = _dc.select;\nsee = _dc.see;\nif_ = _dc.if_;\ncase_ = _dc.case_;\nlist = _dc.list;\nfunc = _dc.func;\neach = _dc.each;\ndiv = _dc.div;\np = _dc.p;\ndc.directive({\n  $options: dc.$options,\n  $model: dc.$model\n});\nchooseFramework(from(_templateObject()));\n//export default\n_exports = {};\n_exports.demoMap = {\n  'choose web framework': chooseFramework,\n  \"show hide\": __webpack_require__(/*! ./demo-show-hide */ \"./demo/coffee/demo-show-hide.coffee\"),\n  counter: __webpack_require__(/*! ./demo-counter */ \"./demo/coffee/demo-counter.coffee\"),\n  event: __webpack_require__(/*! ./demo-event */ \"./demo/coffee/demo-event.coffee\"),\n  controls: __webpack_require__(/*! ./demo-controls */ \"./demo/coffee/demo-controls.coffee\"),\n  if: __webpack_require__(/*! ./demo-if-component */ \"./demo/coffee/demo-if-component.coffee\"),\n  each1: _demoEach.eachDemo1,\n  each2: _demoEach.eachDemo2,\n  each3: _demoEach.eachDemo3,\n  each4: _demoEach.eachDemo4,\n  'switch 1 2 3 4': __webpack_require__(/*! ./demo-switch-1-2-3-4 */ \"./demo/coffee/demo-switch-1-2-3-4.coffee\"),\n  sum: __webpack_require__(/*! ./demo-sum */ \"./demo/coffee/demo-sum.coffee\"),\n  'text model': __webpack_require__(/*! ./demo-text-model */ \"./demo/coffee/demo-text-model.coffee\"),\n  'mount/unmount': __webpack_require__(/*! ./demo-mount-unmount */ \"./demo/coffee/demo-mount-unmount.coffee\")\n};\n\n_exports.makeDemoComponent = makeDemoComponent = function makeDemoComponent(demoMap, initItem) {\n  var comp, componentsMap, currentItem, demoSelect, else_, key;\n  currentItem = see(initItem);\n  componentsMap = {};\n\n  for (key in demoMap) {\n    comp = demoMap[key];\n\n    if (typeof comp === 'function') {\n      componentsMap[key] = comp();\n    } else {\n      componentsMap[key] = comp;\n    }\n  }\n\n  comp = list(demoSelect = select({\n    $options: [Object.keys(demoMap)],\n    $model: currentItem\n  }), div(case_(currentItem, componentsMap, else_ = componentsMap[initItem])));\n  return comp.renderWhen(demoSelect, 'change');\n};\n\n_exports.runDemo = function (demoMap, initItem, element) {\n  var comp;\n  comp = makeDemoComponent(demoMap, initItem);\n  return comp.mount(element);\n};\n\nvar _default = _exports;\nexports.default = _default;\n\n//# sourceURL=webpack:///./demo/coffee/util.coffee?");

/***/ })

/******/ });