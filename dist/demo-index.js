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
  !*** ./demo/index.coffee ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	var demoMap, options, repeatDemo1, repeatDemo2, repeatDemo3, runDemo, select, _ref;

	select = dc.select, options = dc.options;

	_ref = __webpack_require__(/*! domcom/demo/demo-repeat */ 2), repeatDemo1 = _ref.repeatDemo1, repeatDemo2 = _ref.repeatDemo2, repeatDemo3 = _ref.repeatDemo3;

	exports.demoMap = demoMap = {
	  accordion: __webpack_require__(/*! domcom/demo/demo-accordion */ 3),
	  builtins: __webpack_require__(/*! domcom/demo/demo-builtins */ 4),
	  counter: __webpack_require__(/*! domcom/demo/demo-counter */ 5),
	  dialog: __webpack_require__(/*! domcom/demo/demo-dialog */ 6),
	  event: __webpack_require__(/*! domcom/demo/demo-event */ 7),
	  controls: __webpack_require__(/*! domcom/demo/demo-controls */ 1),
	  "if": __webpack_require__(/*! domcom/demo/demo-if-component */ 8),
	  repeat1: repeatDemo1,
	  repeat2: repeatDemo2,
	  repeat3: repeatDemo3,
	  splitter: __webpack_require__(/*! domcom/demo/demo-splitter */ 9),
	  sum: __webpack_require__(/*! domcom/demo/demo-sum */ 10),
	  'text model': __webpack_require__(/*! domcom/demo/demo-text-model */ 11),
	  'auto width edit': __webpack_require__(/*! domcom/demo/demo-auto-width-edit */ 12)
	};

	exports.runDemo = runDemo = function(demoMap, initItem) {
	  var current, currentComp, demoSelect;
	  if (initItem == null) {
	    initItem = 'accordion';
	  }
	  current = initItem;
	  currentComp = demoMap[current]();
	  demoSelect = select({
	    $options: [Object.keys(demoMap)],
	    value: 'accordion',
	    onchange: function() {
	      if (this.value !== current) {
	        currentComp.unmount();
	        current = this.value;
	        currentComp = demoMap[current]();
	        return currentComp.mount();
	      }
	    }
	  });
	  demoSelect.mount();
	  return currentComp.mount();
	};

	exports.runDomComDemo = window.runDomComDemo = function() {
	  return runDemo(demoMap, 'accordion');
	};


/***/ },
/* 1 */
/*!***********************************!*\
  !*** ./demo/demo-controls.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var $a, $b, a, bindings, checkbox, list, p, text, _a, _b, _ref;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

	_ref = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref.$a, $b = _ref.$b, _a = _ref._a, _b = _ref._b;

	module.exports = function() {
	  var cbx, checkboxes, comps, texts;
	  checkboxes = list(cbx = checkbox($a), cbx = checkbox($a));
	  texts = list(a = text($a), text($a));
	  $a(6);
	  comps = list(checkboxes, texts);
	  comps.create();
	  cbx.node.addEventListener('change', function() {
	    $a(this.value);
	    return comps.update();
	  });
	  return comps;
	};


/***/ },
/* 2 */
/*!*********************************!*\
  !*** ./demo/demo-repeat.coffee ***!
  \*********************************/
/***/ function(module, exports) {

	var bindings, list, p, repeat, text;

	list = dc.list, repeat = dc.repeat, text = dc.text, p = dc.p, bindings = dc.bindings;

	exports.repeatDemo1 = function() {
	  var comp, lst;
	  lst = [1, 2];
	  return comp = list(lst);
	};

	exports.repeatDemo2 = function() {
	  var comp, lst;
	  lst = [1, 2];
	  return comp = repeat(lst, function(item) {
	    return p(item);
	  });
	};

	exports.repeatDemo3 = function() {
	  var comp, lst;
	  lst = [1, 2, 3, 4, 5, 6];
	  comp = repeat(lst, function(item) {
	    return p(item);
	  });
	  setTimeout((function() {
	    lst.push(7);
	    return comp.update();
	  }), 2000);
	  setTimeout((function() {
	    lst.length = 4;
	    return comp.update();
	  }), 4000);
	  return comp;
	};


/***/ },
/* 3 */
/*!************************************!*\
  !*** ./demo/demo-accordion.coffee ***!
  \************************************/
/***/ function(module, exports) {

	var accordion, bibind, div, repeat, span;

	bibind = dc.bibind, accordion = dc.accordion, repeat = dc.repeat, div = dc.div, span = dc.span;

	module.exports = function() {
	  var accordionGroupList, comp, content, group, groupAttrs, groupOptions, groups;
	  groups = [
	    {
	      heading: 'group1',
	      items: 'a b c'.split(' ')
	    }, {
	      heading: 'group2',
	      items: 'd e f'.split(' ')
	    }, {
	      heading: 'group3',
	      items: 'x y z'.split(' ')
	    }
	  ];
	  accordionGroupList = (function() {
	    var _i, _len, _results;
	    _results = [];
	    for (_i = 0, _len = groups.length; _i < _len; _i++) {
	      group = groups[_i];
	      groupOptions = {
	        opened: group.opened,
	        disable: group.disable
	      };
	      groupAttrs = {};
	      content = repeat(group.items, function(item) {
	        return span({
	          style: {
	            margin: '5px'
	          },
	          onclick: function() {}
	        }, item);
	      });
	      _results.push([groupAttrs, group.heading, content, groupOptions]);
	    }
	    return _results;
	  })();
	  return comp = accordion(Object.create(null), accordionGroupList, {
	    closeOthers: true
	  });
	};


/***/ },
/* 4 */
/*!***********************************!*\
  !*** ./demo/demo-builtins.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var arrow, bibind, comboEdit, div, hcombo, list, vcombo;

	bibind = dc.bibind, div = dc.div, arrow = dc.arrow, list = dc.list, comboEdit = dc.comboEdit, hcombo = dc.hcombo, vcombo = dc.vcombo;

	module.exports = function() {
	  var a, arrows, combo1, combo2;
	  a = {};
	  arrows = div(Object.create(null), arrow(Object.create(null), 'top', 10, 'blue'), arrow(Object.create(null), 'bottom', 10, 'black'), arrow(Object.create(null), 'left', 10, 'red'), arrow(Object.create(null), 'right', 10, 'green'));
	  combo1 = hcombo({
	    style: {
	      display: 'inline-block'
	    }
	  }, bibind(a, 'x'), 'a b'.split(' '));
	  combo2 = vcombo({
	    style: {
	      display: 'inline-block'
	    }
	  }, bibind(a, 'x'), 'a b'.split(' '));
	  return list(arrows, combo1, combo2);
	};


/***/ },
/* 5 */
/*!**********************************!*\
  !*** ./demo/demo-counter.coffee ***!
  \**********************************/
/***/ function(module, exports) {

	var p, txt;

	txt = dc.txt, p = dc.p;

	module.exports = function() {
	  var comp, count, countHandle, counter, update, updateHandle;
	  counter = 0;
	  comp = p(txt(function() {
	    return counter;
	  }));
	  count = function() {
	    counter++;
	    if (counter === 1000) {
	      return clearInterval(countHandle);
	    }
	  };
	  update = function() {
	    comp.update();
	    if (counter >= 1000) {
	      return clearInterval(updateHandle);
	    }
	  };
	  countHandle = setInterval(count, 1);
	  updateHandle = setInterval(update, 16);
	  return comp;
	};


/***/ },
/* 6 */
/*!*********************************!*\
  !*** ./demo/demo-dialog.coffee ***!
  \*********************************/
/***/ function(module, exports) {

	var dialog, div;

	dialog = dc.dialog, div = dc.div;

	module.exports = function() {
	  var dlg, onOk;
	  onOk = function() {
	    alert('onOk');
	    return dlg.close();
	  };
	  return dlg = dialog({
	    overlay: true,
	    showClose: true
	  }, div({
	    "class": 'message'
	  }, 'a message', div({
	    onclick: onOk
	  }, 'OK')));
	};


/***/ },
/* 7 */
/*!********************************!*\
  !*** ./demo/demo-event.coffee ***!
  \********************************/
/***/ function(module, exports) {

	var $a, $b, a, bindings, checkbox, list, p, text, _a, _b, _ref;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, p = dc.p, bindings = dc.bindings;

	_ref = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref.$a, $b = _ref.$b, _a = _ref._a, _b = _ref._b;

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
	  noPropagation.mount();
	  return list(propagation, noPropagation);
	};


/***/ },
/* 8 */
/*!***************************************!*\
  !*** ./demo/demo-if-component.coffee ***!
  \***************************************/
/***/ function(module, exports) {

	var div, if_, list, text;

	list = dc.list, if_ = dc.if_, text = dc.text, div = dc.div;

	module.exports = function() {
	  var comp, x;
	  x = 0;
	  return comp = list(text({
	    onchange: function() {
	      x = parseInt(this.value);
	      return comp.update();
	    }
	  }, x), if_((function() {
	    return x;
	  }), div(1), div(2)));
	};


/***/ },
/* 9 */
/*!***********************************!*\
  !*** ./demo/demo-splitter.coffee ***!
  \***********************************/
/***/ function(module, exports) {

	var div;

	div = dc.div;

	module.exports = function() {
	  var comp;
	  return comp = div({
	    horizontal: 'horizontal',
	    style: {
	      height: '100%',
	      width: '100%'
	    }
	  }, div({
	    style: {
	      'background-color': "blue",
	      width: '100%'
	    }
	  }, 1), div({
	    $splitter: 'vertical',
	    style: {
	      'background-color': "grey",
	      height: '100%',
	      width: '100%'
	    }
	  }, div(2), div(3)));
	};


/***/ },
/* 10 */
/*!******************************!*\
  !*** ./demo/demo-sum.coffee ***!
  \******************************/
/***/ function(module, exports) {

	var bindings, demoSum, list, p, text;

	bindings = dc.bindings, list = dc.list, text = dc.text, p = dc.p;

	module.exports = demoSum = function() {
	  var $a, $b, comp, _ref;
	  _ref = bindings({
	    a: 1,
	    b: 2
	  }), $a = _ref.$a, $b = _ref.$b;
	  return comp = list(text({
	    onchange: function() {
	      return comp.update();
	    }
	  }, $a), text({
	    onchange: function() {
	      return comp.update();
	    }
	  }, $b), p(function() {
	    return parseFloat($a()) + parseFloat($b());
	  }));
	};


/***/ },
/* 11 */
/*!*************************************!*\
  !*** ./demo/demo-text-model.coffee ***!
  \*************************************/
/***/ function(module, exports) {

	var a, bindings, checkbox, list, text;

	list = dc.list, a = dc.a, checkbox = dc.checkbox, text = dc.text, bindings = dc.bindings;

	module.exports = function() {
	  var $a, $b, attrs, comp, _a, _b, _ref;
	  _ref = bindings({
	    a: 1,
	    b: 2
	  }), $a = _ref.$a, $b = _ref.$b, _a = _ref._a, _b = _ref._b;
	  attrs = {
	    onchange: function() {
	      return comp.update();
	    }
	  };
	  return comp = list(a = text(attrs, $a), text(attrs, $a));
	};


/***/ },
/* 12 */
/*!******************************************!*\
  !*** ./demo/demo-auto-width-edit.coffee ***!
  \******************************************/
/***/ function(module, exports) {

	var autoWidthEdit;

	autoWidthEdit = dc.autoWidthEdit;

	module.exports = function() {
	  return autoWidthEdit();
	};


/***/ }
/******/ ]);