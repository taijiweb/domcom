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
/*!*********************************!*\
  !*** ./src/domcom-addon.coffee ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var extend;

	extend = dc.extend;

	extend(dc, __webpack_require__(/*! ./directives */ 29), __webpack_require__(/*! ./builtins */ 36), __webpack_require__(/*! ./addon-util */ 43));

	module.exports = dc;


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */
/*!****************************************!*\
  !*** ./src/directives/register.coffee ***!
  \****************************************/
/***/ function(module, exports) {

	var _directiveRegistry;

	exports._directiveRegistry = _directiveRegistry = Object.create(null);

	exports.registerDirective = function(directiveName, directiveHandler) {
	  return _directiveRegistry[directiveName] = directiveHandler;
	};


/***/ },
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/*!*************************************!*\
  !*** ./src/directives/index.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var hide, show, _ref;

	exports.model = __webpack_require__(/*! ./model */ 31);

	exports.bind = __webpack_require__(/*! ./bind */ 32);

	_ref = __webpack_require__(/*! ./show-hide */ 33), show = _ref.show, hide = _ref.hide;

	exports.show = show;

	exports.hide = hide;

	exports.blink = __webpack_require__(/*! ./blink */ 30);

	exports.splitter = __webpack_require__(/*! ./splitter */ 34);

	exports.options = __webpack_require__(/*! ./options */ 35);


/***/ },
/* 30 */
/*!*************************************!*\
  !*** ./src/directives/blink.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var blink, registerDirective;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;

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
/* 31 */
/*!*************************************!*\
  !*** ./src/directives/model.coffee ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var extendEventValue, getBindProp, model, registerDirective;

	extendEventValue = dc.extendEventValue, getBindProp = dc.getBindProp;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;

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
/* 32 */
/*!************************************!*\
  !*** ./src/directives/bind.coffee ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	var bind, getBindProp, registerDirective;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;

	getBindProp = dc.getBindProp;

	module.exports = bind = function(binding) {
	  return function(comp) {
	    comp.props[getBindProp(comp)] = binding;
	    return comp;
	  };
	};

	registerDirective('bind', bind);


/***/ },
/* 33 */
/*!*****************************************!*\
  !*** ./src/directives/show-hide.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var hide, registerDirective, show, showHide;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;


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
/* 34 */
/*!****************************************!*\
  !*** ./src/directives/splitter.coffee ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, classFn, div, pairListDict, registerDirective, span, splitter;

	pairListDict = dc.pairListDict, classFn = dc.classFn, Component = dc.Component, div = dc.div, span = dc.span;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;

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
/* 35 */
/*!***************************************!*\
  !*** ./src/directives/options.coffee ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	var List, Tag, option, options, registerDirective, repeat, txt;

	Tag = dc.Tag, List = dc.List, repeat = dc.repeat, txt = dc.txt, option = dc.option;

	registerDirective = __webpack_require__(/*! ./register */ 20).registerDirective;

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
/* 36 */
/*!***********************************!*\
  !*** ./src/builtins/index.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	var extend;

	extend = dc.extend;

	extend(exports, __webpack_require__(/*! ./accordion */ 38));

	exports.arrow = __webpack_require__(/*! ./arrow */ 39);

	exports.dialog = __webpack_require__(/*! ./dialog */ 40);

	extend(exports, __webpack_require__(/*! ./combo */ 37));

	exports.comboEdit = __webpack_require__(/*! ./comboEdit */ 41);

	extend(exports, __webpack_require__(/*! ./autoWidthEdit */ 42));


/***/ },
/* 37 */
/*!***********************************!*\
  !*** ./src/builtins/combo.coffee ***!
  \***********************************/
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
/* 38 */
/*!***************************************!*\
  !*** ./src/builtins/accordion.coffee ***!
  \***************************************/
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
/* 39 */
/*!***********************************!*\
  !*** ./src/builtins/arrow.coffee ***!
  \***********************************/
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
/* 40 */
/*!************************************!*\
  !*** ./src/builtins/dialog.coffee ***!
  \************************************/
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
/* 41 */
/*!***************************************!*\
  !*** ./src/builtins/comboEdit.coffee ***!
  \***************************************/
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
/* 42 */
/*!*******************************************!*\
  !*** ./src/builtins/autoWidthEdit.coffee ***!
  \*******************************************/
/***/ function(module, exports) {

	var AutoWidthEdit, Tag, div, overAttrs, text,
	  __hasProp = {}.hasOwnProperty,
	  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	div = dc.div, text = dc.text, overAttrs = dc.overAttrs, Tag = dc.Tag;

	exports.AutoWidthEdit = AutoWidthEdit = (function(_super) {
	  __extends(AutoWidthEdit, _super);

	  function AutoWidthEdit(contextEditAttrs, inputAttrs, inputKeyFn) {
	    var editWidth, testSubject, testSubjectStyle, _inputAttrs;
	    if (inputKeyFn == null) {
	      inputKeyFn = this.inputKeyFn;
	    }
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
	      fontSize: (function(_this) {
	        return function() {
	          return _this.css('fontSize');
	        };
	      })(this),
	      fontFamily: (function(_this) {
	        return function() {
	          return _this.css('fontFamily');
	        };
	      })(this),
	      fontWeight: (function(_this) {
	        return function() {
	          return _this.css('fontWeight');
	        };
	      })(this),
	      letterSpacing: (function(_this) {
	        return function() {
	          return _this.css('letterSpacing');
	        };
	      })(this),
	      visibility: 'hidden'
	    };
	    testSubject = div({
	      style: testSubjectStyle
	    }, ((function(_this) {
	      return function() {
	        return _this.value;
	      };
	    })(this)));
	    this.inputKeyFn = inputKeyFn = (function(_this) {
	      return function(event, comp) {
	        var node;
	        event.executeDefault = true;
	        node = comp.node;
	        _this.value = node.value;
	        editWidth = testSubject.node.getBoundingClientRect().width;
	        _this.update();
	        return node.focus();
	      };
	    })(this);
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
	        return inputKeyFn(event, comp);
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
/* 43 */
/*!*******************************!*\
  !*** ./src/addon-util.coffee ***!
  \*******************************/
/***/ function(module, exports) {

	var bibind, sibind;

	sibind = dc.sibind, bibind = dc.bibind;

	exports.bindings = function(model) {
	  var key, result;
	  result = Object.create(null);
	  for (key in model) {
	    result['$' + key] = bibind(model, key);
	    result['_' + key] = sibind(model, key);
	  }
	  return result;
	};


/***/ }
/******/ ])
});
;