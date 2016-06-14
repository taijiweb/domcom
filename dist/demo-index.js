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

	var demoMap, runDemo, _ref;

	_ref = __webpack_require__(/*! ./util */ 1), runDemo = _ref.runDemo, demoMap = _ref.demoMap;

	dc.alwaysRender = true;

	window.onload = function() {
	  return runDemo(demoMap, 'choose web framework');
	};


/***/ },
/* 1 */
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

	_ref = __webpack_require__(/*! ./demo-each */ 3), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

	chooseFramework = __webpack_require__(/*! ./demo-choose-web-framework */ 4);

	_ref1 = __webpack_require__(/*! ./demo-debug */ 5), demoEachPush = _ref1.demoEachPush, demoIfEach = _ref1.demoIfEach, demoModelOnMultipleInput = _ref1.demoModelOnMultipleInput;

	exports.demoMap = {
	  'choose web framework': chooseFramework,
	  "show hide": __webpack_require__(/*! ./demo-show-hide */ 6),
	  counter: __webpack_require__(/*! ./demo-counter */ 7),
	  event: __webpack_require__(/*! ./demo-event */ 8),
	  controls: __webpack_require__(/*! ./demo-controls */ 2),
	  "if": __webpack_require__(/*! ./demo-if-component */ 9),
	  each1: eachDemo1,
	  each2: eachDemo2,
	  each3: eachDemo3,
	  each4: eachDemo4,
	  'switch 1 2 3 4': __webpack_require__(/*! ./demo-switch-1-2-3-4 */ 10),
	  sum: __webpack_require__(/*! ./demo-sum */ 11),
	  'text model': __webpack_require__(/*! ./demo-text-model */ 12),
	  'mount/unmount': __webpack_require__(/*! ./demo-mount-unmount */ 13)
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
/* 2 */
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
/* 3 */
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
	  var comp, lst2;
	  lst2 = [1, 2];
	  return comp = each(lst2, function(item) {
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
	      return comp.render();
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
	      return comp.render();
	    }), 2000);
	  });
	  return comp;
	};


/***/ },
/* 4 */
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
	      return comp.render();
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
	      return comp.render();
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
/* 5 */
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
	  showingEach$(true);
	  return comp.render();
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
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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
	      return comp.render();
	    }
	  }, x), if_(x, div(1), div(2)));
	};

	module.exports = function() {
	  var comp, x;
	  x = see(0, parseFloat);
	  return comp = list(text({
	    onchange: function() {
	      return comp.render();
	    }
	  }, x), if_(x, div('It is not 0.'), div('It is 0 or NaN.')));
	};


/***/ },
/* 10 */
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
	      return comp.render();
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
	      return comp.render();
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
/* 11 */
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
/* 12 */
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
/* 13 */
/*!****************************************!*\
  !*** ./demo/demo-mount-unmount.coffee ***!
  \****************************************/
/***/ function(module, exports) {

	var div, if_, list, see;

	list = dc.list, div = dc.div, see = dc.see, if_ = dc.if_;

	module.exports = function() {
	  var active, comp, div1;
	  active = see(true);
	  return comp = list(div({
	    onclick: function() {
	      active(true);
	      return div1.render();
	    }
	  }, 'mount'), div({
	    onclick: function() {
	      active(false);
	      return div1.render();
	    }
	  }, 'unmount'), div1 = if_(active, div('toggle me')));
	};


/***/ }
/******/ ]);