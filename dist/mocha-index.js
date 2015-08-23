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

	__webpack_require__(/*! ./test-property */ 1);

	__webpack_require__(/*! ./test-toString */ 3);

	__webpack_require__(/*! ./test-dc */ 4);

	__webpack_require__(/*! ./test-base-component */ 5);

	__webpack_require__(/*! ./test-component */ 6);

	__webpack_require__(/*! ./test-directive */ 7);

	__webpack_require__(/*! ./test-if-case-func */ 8);

	__webpack_require__(/*! ./test-list-repeat */ 9);

	__webpack_require__(/*! ./test-ref-clone */ 10);

	__webpack_require__(/*! ./test-accordion */ 11);

	__webpack_require__(/*! ./test-mount-callback */ 12);


/***/ },
/* 1 */
/*!*****************************************!*\
  !*** ./test/mocha/test-property.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, a, bibind, checkbox, classFn, div, expect, func, hide, idescribe, if_, iit, li, list, model, ndescribe, nit, options, p, show, sibind, span, splitter, text, util, _ref;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	util = dc.util, sibind = dc.sibind, bibind = dc.bibind, classFn = dc.classFn, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, checkbox = dc.checkbox, model = dc.model, show = dc.show, hide = dc.hide, splitter = dc.splitter, options = dc.options;

	describe('properties ', function() {
	  describe("classFn", function() {
	    it('get value of classFn', function() {
	      var active, x;
	      active = true;
	      x = classFn([
	        'a', {
	          b: function() {
	            return active;
	          }
	        }
	      ]);
	      expect(x()).to.equal('a b');
	      active = false;
	      return expect(x()).to.equal('a');
	    });
	    it('should compute needUpdate', function() {
	      var active, x;
	      active = true;
	      x = classFn(['a']);
	      expect(x.needUpdate).to.equal(true);
	      expect(x()).to.equal('a');
	      expect(x.needUpdate).to.equal(false);
	      x.extend('a');
	      expect(x.needUpdate).to.equal(false);
	      expect(x()).to.equal('a');
	      x.extend('b');
	      expect(x.needUpdate).to.equal(true);
	      expect(x()).to.equal('a b');
	      x.extend('!b');
	      expect(x.needUpdate).to.equal(true);
	      return expect(x()).to.equal('a');
	    });
	    return it('should get class property in component', function() {
	      var active, comp;
	      active = true;
	      comp = div({
	        "class": {
	          a: 1,
	          b: function() {
	            return active;
	          }
	        }
	      });
	      comp.init();
	      expect(comp.className()).to.equal('a b');
	      comp.className = classFn({
	        a: 1,
	        b: function() {
	          return active;
	        }
	      });
	      expect(comp.className.needUpdate).to.equal(true);
	      return comp.mount();
	    });
	  });
	  describe('create', function() {
	    return it('should create properties', function() {
	      var p1;
	      p1 = p({
	        value: sibind({
	          a: 1
	        }, 'a')
	      });
	      p1.mount();
	      return expect(p1.node.value).to.equal(1);
	    });
	  });
	  describe('event', function() {
	    it('click event ', function() {
	      var comp, x;
	      x = 1;
	      comp = a({
	        onclick: function() {
	          return x = 2;
	        }
	      }, 'click me');
	      comp.mount('#demo');
	      comp.node.click();
	      return expect(x).to.equal(2);
	    });
	    it('multiple handlers for one event', function() {
	      var $a, comp, spy1, x;
	      $a = bibind(x = {
	        a: 2
	      }, 'a');
	      spy1 = sinon.spy();
	      comp = text({
	        onchange: spy1,
	        $model: $a
	      });
	      comp.mount();
	      comp.node.value = 2;
	      comp.node.onchange();
	      expect(spy1.called).to.equal(true);
	      return expect(x.a).to.equal('2');
	    });
	    return it('multiple handlers for one event, with bound value', function() {
	      var $a, comp, spy1, x;
	      $a = bibind(x = {
	        a: 1
	      }, 'a');
	      spy1 = sinon.spy();
	      comp = text({
	        onchange: spy1
	      }, $a);
	      comp.mount();
	      comp.node.value = 2;
	      comp.node.onchange();
	      expect(spy1.called).to.equal(true);
	      return expect(x.a).to.equal('2');
	    });
	  });
	  describe('style', function() {
	    it('should set style property with string value', function() {
	      var comp, elm;
	      comp = a({
	        style: "border:red 1px solid"
	      }, 'red 1px solid');
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
	      var color, comp, handle, i, paddingColor, styleFn;
	      paddingColor = function(hexStr) {
	        if (!(hexStr.match(/^\d/))) {
	          return hexStr;
	        }
	        while (hexStr.length < 6) {
	          hexStr = '0' + hexStr;
	        }
	        return '#' + hexStr;
	      };
	      color = "red";
	      i = 0;
	      comp = a({
	        style: {
	          borderWidth: (function() {
	            return i + "px";
	          }),
	          borderStyle: "solid",
	          borderColor: function() {
	            return paddingColor(color.toString(16));
	          }
	        }
	      }, 'dynamic property');
	      comp.mount('#demo');
	      color = 0;
	      styleFn = function() {
	        color += 0x111111;
	        i++;
	        comp.render();
	        if (i === 50) {
	          return clearInterval(handle);
	        }
	      };
	      return handle = setInterval(styleFn, 5);
	    });
	  });
	  return it('bidirectional bound checkbox', function() {
	    var bb, cbx, model1;
	    model1 = {
	      a: 1
	    };
	    bb = bibind(model1, 'a');
	    cbx = checkbox({
	      $model: bb
	    });
	    cbx.mount('#demo');
	    expect(cbx.node.onchange).to.be.defined;
	    cbx.node.checked = true;
	    cbx.node.onchange();
	    return expect(model1.a).to.equal(true);
	  });
	});


/***/ },
/* 2 */
/*!**********************************!*\
  !*** ./test/mocha/helper.coffee ***!
  \**********************************/
/***/ function(module, exports) {

	exports.expect = chai.expect;

	exports.iit = it.only;

	exports.idescribe = describe.only;

	exports.nit = function() {};

	exports.ndescribe = function() {};

	exports.rtimeout = function(ms, fn) {
	  return setTimeout(fn, ms);
	};

	exports.rinterval = function(ms, fn) {
	  return setInterval(fn, ms);
	};


/***/ },
/* 3 */
/*!*****************************************!*\
  !*** ./test/mocha/test-toString.coffee ***!
  \*****************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, div, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, repeat, span, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, repeat = dc.repeat, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe('toString', function() {
	  it('should toString list of if(tag)', function() {
	    var comp, pIf, t1, x;
	    x = 0;
	    comp = list(t1 = text({
	      onchange: function() {
	        x = parseInt(this.value);
	        return comp.update();
	      }
	    }, x), pIf = if_((function() {
	      return x;
	    }), div(1), div(2)));
	    console.log(comp.toString());
	    return expect(comp.toString()).to.equal('\n<List>\n  <input type="text" onchange=fn:x = parseInt(this.value);\n\t        return comp.update() value=0><nothing/></input>\n  <if fn:x>\n    <div>\n      1</div>\n    <div>\n      2</div>\n  </if>\n</List>');
	  });
	  it('should toString  tag with props', function() {
	    var comp, x;
	    x = 0;
	    comp = div({
	      value: 1
	    }, 1);
	    console.log(comp.toString());
	    return expect(comp.toString()).to.equal('\n<div value=1>\n  1</div>');
	  });
	  return it('should toString', function() {
	    var comp;
	    comp = case_((function() {
	      return x;
	    }), {
	      1: p(1),
	      2: p(2),
	      3: p(3)
	    }, 'others');
	    console.log(comp.toString());
	    return expect(comp.toString()).to.equal('\n<Case fn:x>\n  1: <p>\n    1</p>\n  2: <p>\n    2</p>\n  3: <p>\n    3</p>\n  "others"\n</Case>');
	  });
	});


/***/ },
/* 4 */
/*!***********************************!*\
  !*** ./test/mocha/test-dc.coffee ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-component
	 */
	var expect, idescribe, iit, isComponent, ndescribe, nit, rinterval, rtimeout, _ref;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe, rtimeout = _ref.rtimeout, rinterval = _ref.rinterval;

	isComponent = dc.isComponent;

	describe("test dc", function() {
	  return describe('dc(document)', function() {
	    it('dc(document) should be Component', function() {
	      return expect(!isComponent(dc(document))).to.equal(true);
	    });
	    it('should cache DomNodeComponent', function() {
	      var x;
	      x = dc(document);
	      return expect(dc(document)).to.equal(x);
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
/* 5 */
/*!***********************************************!*\
  !*** ./test/mocha/test-base-component.coffee ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-virtual-tree
	 */
	var $a, $b, List, Nothing, Tag, Text, VirtualNode, bindings, classFn, div, expect, idescribe, iit, list, ndescribe, nit, p, styleFrom, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, Nothing = dc.Nothing, Tag = dc.Tag, Text = dc.Text, List = dc.List, txt = dc.txt, list = dc.list, p = dc.p, div = dc.div, classFn = dc.classFn, styleFrom = dc.styleFrom, VirtualNode = dc.VirtualNode;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe("test base component", function() {
	  describe('getBaseComponent', function() {
	    it('should have getBaseComponent of List', function() {
	      var baseComponent, comp;
	      comp = list([1, 2]);
	      baseComponent = comp.getBaseComponent();
	      expect(baseComponent.isList).to.equal(true);
	      return expect(baseComponent.children.length).to.equal(2);
	    });
	    return it('should have correct children', function() {
	      var baseComponent, comp;
	      comp = p(0);
	      baseComponent = comp.getBaseComponent();
	      return expect(baseComponent.children.text).to.equal(0);
	    });
	  });
	  describe('process getBaseComponent of Tag', function() {
	    it('should getBaseComponent of two tags', function() {
	      var baseComponent, d, p1;
	      p1 = new Tag('p', Object.create(null), []);
	      d = new Tag('div', Object.create(null), [p1]);
	      baseComponent = d.getBaseComponent();
	      expect(baseComponent).to.equal(d);
	      expect(baseComponent.children).to.be["instanceof"](Tag);
	      d.baseComponent = null;
	      d.mount();
	      baseComponent = d.getBaseComponent();
	      return expect(baseComponent.baseComponent).to.equal(d);
	    });
	    it('should process tag with nonempty child tag', function() {
	      var baseComponent, d, p1;
	      d = new Tag('div', {}, [
	        p1 = new Tag('p', {
	          fakeProp: function() {}
	        }, [])
	      ]);
	      d.mount();
	      baseComponent = d.getBaseComponent();
	      return expect(baseComponent).to.equal(d);
	    });
	    it('should process tag with mulit level nonempty child tag', function() {
	      var baseComponent, d, p1;
	      d = div(div(p1 = p({
	        fakeProp: function() {}
	      })));
	      d.mount();
	      baseComponent = d.getBaseComponent();
	      return expect(baseComponent).to.equal(d);
	    });
	    return it('should set Text.baseComponent to VirtualNoop', function() {
	      var comp;
	      comp = txt(1);
	      comp.mount();
	      return expect(comp.isNoop).to.equal(true);
	    });
	  });
	  return describe('process creatDom', function() {
	    it('should creatDom of p(1)', function() {
	      var baseComponent, comp;
	      comp = p(1);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      expect(comp.node.innerHTML).to.equal('1');
	      return expect(baseComponent.isNoop).to.equal(true);
	    });
	    it('should creatDom of p(->1)', function() {
	      var baseComponent, comp;
	      comp = p(function() {
	        return 1;
	      });
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      expect(comp.node.innerHTML).to.equal('1');
	      return expect(!!baseComponent.isNoop).to.equal(false);
	    });
	    it('should creatDom of p(p(p(t=txt(->1))))', function() {
	      var baseComponent, comp, t;
	      comp = p(p(p(t = txt(function() {
	        return 1;
	      }))));
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      expect(comp.node.innerHTML).to.equal('<p><p>1</p></p>');
	      return expect(!!baseComponent.isNoop).to.equal(false);
	    });
	    it('should createDom Text with text is  0', function() {
	      var baseComponent, n;
	      n = new Text(0);
	      baseComponent = n.getBaseComponent();
	      baseComponent.createDom();
	      return expect(n.node.textContent).to.equal('0');
	    });
	    it('should createDom tag', function() {
	      var baseComponent;
	      p = new Tag('p', {}, []);
	      baseComponent = p.getBaseComponent();
	      baseComponent.createDom();
	      return expect(baseComponent.node.tagName).to.equal('P');
	    });
	    it('should createDom  tag with attribute', function() {
	      var baseComponent;
	      p = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, []);
	      baseComponent = p.getBaseComponent();
	      baseComponent.createDom();
	      expect(p.node.className).to.equal('some class');
	      return expect(p.node.getAttribute('className')).to.equal(null);
	    });
	    it('process sibind as value', function() {
	      var baseComponent, comp;
	      comp = new Tag('input', {
	        type: 'text',
	        value: _a
	      }, [new Text(_a)]);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node.value).to.equal('1');
	    });
	    it('tag shoud have children', function() {
	      var baseComponent, comp;
	      comp = new Tag('p', {}, [new Text(1), new Text(2)]);
	      expect(comp.children.children.length).to.equal(2);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node.childNodes.length).to.equal(2);
	    });
	    it('should create  tag with children', function() {
	      var baseComponent, comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node.getElementsByTagName('span').length).to.equal(1);
	    });
	    it('should createDom tag 2', function() {
	      var baseComponent, comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')])]);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    it('should createDom for tag with children', function() {
	      var baseComponent, comp;
	      comp = new Tag('p', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [new Tag('span', {}, [new Text('adf')]), new Text(function() {})]);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node.className).to.equal('some class');
	    });
	    return it('should createDom list with children', function() {
	      var baseComponent, comp;
	      comp = new List([
	        new Tag('span', {}, [new Text('adf')]), new Text(function() {
	          return void 0;
	        })
	      ]);
	      baseComponent = comp.getBaseComponent();
	      baseComponent.createDom();
	      return expect(comp.node[0].tagName).to.equal('SPAN');
	    });
	  });
	});


/***/ },
/* 6 */
/*!******************************************!*\
  !*** ./test/mocha/test-component.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, List, Tag, Text, a, bibind, bindings, button, classFn, div, expect, func, idescribe, if_, iit, input, li, list, ndescribe, nit, p, span, styleFrom, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, bibind = dc.bibind, classFn = dc.classFn, styleFrom = dc.styleFrom, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe("component  ", function() {
	  describe('construct component', function() {
	    it('component shoud have children', function() {
	      var comp;
	      comp = p(Object.create(null), [1, 2]);
	      return expect(comp.children.children.length).to.equal(2);
	    });
	    it('should construct component', function() {
	      var d, p1;
	      p1 = new Tag('p', {}, []);
	      d = new Tag('div', {}, [p1]);
	      return expect(d.children).to.equal(p1);
	    });
	    it('tag shoud have children 1', function() {
	      var comp;
	      comp = new Tag('span', {}, [new Text('adf')]);
	      return expect(comp.children.text).to.equal('adf');
	    });
	    return it('tag shoud have children 2', function() {
	      var comp, span1;
	      span1 = new Tag('span', {}, [new Text('adf')]);
	      comp = new Tag('div', {
	        className: classFn('some class'),
	        style: styleFrom("width:1px;")
	      }, [span1]);
	      return expect(comp.children).to.equal(span1);
	    });
	  });
	  describe('component.append', function() {
	    return nit('should append tag.children', function() {
	      var d, p1;
	      d = div();
	      p1 = p();
	      d.append(p1);
	      return expect(d.children).to.equal(p1);
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
	      comp = new Tag('div', Object.create(null), []);
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
	    it('should not run event hanlder while creating tag', function() {
	      var comp, spy;
	      spy = sinon.spy();
	      comp = p({
	        onclick: spy
	      });
	      comp.mount();
	      expect(spy.called).to.equal(false);
	      comp.node.onclick();
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
	      comp.node.onclick();
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
	      comp.node.onclick();
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
	      comp.node.onclick();
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
	      comp.children.node.onclick();
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
	      var comp, elm;
	      _a = bindings({
	        a: 1
	      })._a;
	      comp = text(_a);
	      elm = comp.mount();
	      elm = comp.node;
	      return expect(elm.value).to.equal('1');
	    });
	    it('component shoud have children 2', function() {
	      var comp;
	      comp = span('adf');
	      return expect(comp.children.text).to.equal('adf');
	    });
	    it('should create tag with children', function() {
	      var comp, span1;
	      comp = p({
	        className: 'some class',
	        style: "width:1px;"
	      }, span1 = span(['adf']));
	      expect(comp.children).to.equal(span1);
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
	  describe('component update', function() {
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
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('2');
	      ++count;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('3');
	    });
	    it('should process bidirectional bind', function() {
	      var comp;
	      comp = new Tag('input', {
	        value: $a
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
	      comp.update();
	      expect(elm.innerHTML).to.equal('2');
	      ++count;
	      comp.update();
	      return expect(elm.innerHTML).to.equal('3');
	    });
	    it('should process bidirectional bind', function() {
	      var comp;
	      $a = bindings({
	        a: 1
	      }).$a;
	      comp = text($a);
	      comp.mount('#demo');
	      expect(comp.node.value).to.equal('1');
	      comp.node.value = '2';
	      comp.node.onchange();
	      return expect($a()).to.equal('2');
	    });
	    it('should render div(2) component', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should execute component.remove', function() {
	      var comp;
	      comp = div(2);
	      comp.mount();
	      return comp.remove();
	    });
	    return it('p(->12) ', function() {
	      var comp;
	      comp = p(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('12');
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	  });
	  return describe('demo', function() {
	    describe('test for sum', function() {
	      return it('should construct and create components', function() {
	        var comp, x, y, z, _ref2;
	        _ref2 = bindings({
	          a: 1,
	          b: 2
	        }), $a = _ref2.$a, $b = _ref2.$b, _a = _ref2._a, _b = _ref2._b;
	        x = text($a);
	        y = text($b);
	        z = p(txt(function() {
	          return _a() + _b();
	        }));
	        comp = list(x, y, z);
	        comp.mount('#demo');
	        expect(z.node.innerHTML).to.equal('3');
	        x.node.value = '3';
	        y.node.value = '4';
	        x.node.onchange();
	        y.node.onchange();
	        comp.update();
	        return expect(z.node.innerHTML).to.equal('34');
	      });
	    });
	    describe('test for todomvc', function() {
	      return it('should construct and create components', function() {
	        var comp;
	        comp = li(a({
	          className: {
	            selected: 1
	          },
	          href: "#/"
	        }, "All"));
	        return comp.mount('#demo');
	      });
	    });
	    return describe('test for combobox', function() {
	      it('should process event property of child component', function() {
	        var c0, comp, x;
	        x = 0;
	        comp = div({}, c0 = input({
	          onmouseenter: function() {
	            return x = 1;
	          }
	        }), div({}, 'wawa'));
	        comp.mount();
	        c0.node.onmouseenter();
	        return expect(x).to.equal(1);
	      });
	      return it('should process event property of child component with model directive', function() {
	        var c0, comp, x;
	        x = 0;
	        comp = div({}, c0 = input({
	          $model: bibind({}, 'x'),
	          onmouseenter: function() {
	            return x = 1;
	          }
	        }), div({}, 'wawa'));
	        comp.mount();
	        c0.node.onmouseenter();
	        return expect(x).to.equal(1);
	      });
	    });
	  });
	});


/***/ },
/* 7 */
/*!******************************************!*\
  !*** ./test/mocha/test-directive.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**test-directive
	 */
	var $a, $b, Component, a, bibind, bindings, div, expect, func, hide, idescribe, if_, iit, input, list, ndescribe, nit, p, repeat, select, show, span, splitter, text, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, repeat = dc.repeat, a = dc.a, div = dc.div, p = dc.p, span = dc.span, text = dc.text, select = dc.select, input = dc.input, show = dc.show, hide = dc.hide, splitter = dc.splitter, bindings = dc.bindings, bibind = dc.bibind;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe('directives', function() {
	  describe('model ', function() {
	    it('should process model  directive', function() {
	      var comp;
	      comp = text({
	        $model: $a
	      });
	      comp.mount();
	      comp.node.value = '2';
	      comp.node.onchange();
	      return expect($a()).to.equal('2');
	    });
	    return it('should process event property of component with model directive', function() {
	      var comp, modelValue, x;
	      x = 0;
	      modelValue = bibind({}, 'x');
	      comp = input({
	        $model: modelValue,
	        onmouseenter: function() {
	          return x = 1;
	        }
	      });
	      comp.mount();
	      comp.node.onmouseenter();
	      return expect(x).to.equal(1);
	    });
	  });
	  describe('show', function() {
	    it('should process show directive', function() {
	      var comp;
	      comp = div({
	        $show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	    it('should process show directive with non block display', function() {
	      var comp;
	      comp = div({
	        style: {
	          display: "inline"
	        },
	        show: true
	      });
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('inline');
	    });
	    it('should process show directive with false value', function() {
	      var comp;
	      comp = div({
	        $show: false
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('none');
	    });
	    it('should process show directive with function value', function() {
	      var comp;
	      a = true;
	      comp = div({
	        $show: function() {
	          return a;
	        }
	      });
	      comp.mount();
	      expect(comp.node.style.display).to.equal('block');
	      a = false;
	      comp.update();
	      return expect(comp.node.style.display).to.equal('none');
	    });
	    it('should process hide directive', function() {
	      var comp;
	      comp = div({
	        $hide: true
	      }, div(1));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('none');
	    });
	    return it('should process hide directive with false value', function() {
	      var comp;
	      comp = hide(false)(div(div(1)));
	      comp.mount();
	      return expect(comp.node.style.display).to.equal('block');
	    });
	  });
	  describe('splitter', function() {
	    return it('should constructor splitter', function() {
	      var comp;
	      comp = splitter('vertical')(div(div(1), div(2)));
	      comp.mount();
	      return expect(comp.node.innerHTML).to.match(/splitbar/);
	    });
	  });
	  return describe('select options', function() {
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
/* 8 */
/*!*********************************************!*\
  !*** ./test/mocha/test-if-case-func.coffee ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, div, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, repeat, span, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, repeat = dc.repeat, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe('if, case, func', function() {
	  describe('If', function() {
	    it('should getBaseComponent of if_(->x, txt(1), txt(2))', function() {
	      var comp, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), txt(1), txt(2));
	      comp.mount();
	      expect(comp.node.textContent).to.equal('2');
	      comp.update();
	      expect(comp.node.textContent).to.equal('2');
	      x = 1;
	      comp.update();
	      expect(comp.node.textContent).to.equal('1');
	      x = 0;
	      comp.update();
	      return expect(comp.node.textContent).to.equal('2');
	    });
	    it('should render If component', function() {
	      var comp, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), div(1), div(2));
	      comp.mount();
	      expect(comp.node.innerHTML).to.equal('2');
	      x = 1;
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('1');
	      x = 0;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should create  and render  if', function() {
	      var comp, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), p(1), p(2));
	      expect(comp).to.be["instanceof"](TransformComponent);
	      comp.mount();
	      expect(comp.node.tagName).to.equal('P');
	      expect(comp.node.innerHTML).to.equal('2');
	      x = 1;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	    it('should create and update if_ with attrs', function() {
	      var c1, c2, comp, x;
	      x = 0;
	      comp = if_({
	        "class": 'main',
	        fakeProp: function() {
	          return x;
	        }
	      }, (function() {
	        return x;
	      }), c1 = p(1), c2 = p(2));
	      expect(comp).to.be["instanceof"](Tag);
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(0);
	      expect(comp.node.childNodes[0].innerHTML).to.equal('2');
	      expect(comp.node.childNodes[0].tagName).to.equal('P');
	      x = 1;
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(1);
	      expect(comp.node.childNodes[0].innerHTML).to.equal('1');
	      return expect(comp.node.childNodes[0]).to.equal(c1.node);
	    });
	    it('should create and render if followed by other node ', function() {
	      var comp, demo2Node, p1, p2, p3, pIf, x;
	      demo2Node = document.getElementById('demo2');
	      demo2Node.innerHTML = '';
	      x = 0;
	      comp = list(pIf = if_((function() {
	        return x;
	      }), p1 = p(1), p2 = p(2)), p3 = p(3));
	      comp.mount(demo2Node);
	      expect(pIf.node.innerHTML).to.equal('2');
	      expect(demo2Node.innerHTML).to.equal('<p>2</p><p>3</p>');
	      x = 1;
	      comp.update();
	      expect(pIf.node.innerHTML).to.equal('1');
	      expect(comp.node[0].innerHTML).to.equal('1');
	      return expect(demo2Node.innerHTML).to.equal('<p>1</p><p>3</p>');
	    });
	    it('should create and render embedded if', function() {
	      var c0, c1, c2, comp, x;
	      x = 0;
	      comp = list(text(x), c0 = if_((function() {
	        return x;
	      }), c1 = div(1), c2 = div(2)));
	      comp.mount();
	      expect(comp.mountNode).to.equal(document.body);
	      expect(comp.parentNode).to.equal(document.body);
	      expect(comp.node[1].innerHTML).to.equal('2');
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      x = 1;
	      comp.update();
	      expect(c0.parentNode).to.equal(comp.parentNode);
	      expect(c0.node.innerHTML).to.equal('1');
	      expect(c2.node.innerHTML).to.equal('2');
	      expect(c0.node).to.equal(c1.node);
	      return expect(comp.node[1]).to.equal(c1.node);
	    });
	    it('should process event in embedded if 2', function() {
	      var comp, pIf, t1, x;
	      x = 0;
	      comp = list(t1 = text({
	        onchange: function() {
	          x = parseInt(this.value);
	          return comp.update();
	        }
	      }, x), pIf = if_((function() {
	        return x;
	      }), div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      t1.node.value = 1;
	      t1.node.onchange();
	      expect(pIf.node.innerHTML).to.equal('1');
	      t1.node.value = 0;
	      t1.node.onchange();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	    return it('should process embedded if 2', function() {
	      var comp, pIf, t1, x;
	      x = 0;
	      comp = list(t1 = text(x), pIf = if_((function() {
	        return x;
	      }), div(1), div(2)));
	      comp.mount();
	      expect(pIf.node.innerHTML).to.equal('2');
	      x = 1;
	      comp.update();
	      expect(pIf.node.innerHTML).to.equal('1');
	      x = 0;
	      comp.update();
	      return expect(pIf.node.innerHTML).to.equal('2');
	    });
	  });
	  describe('Case', function() {
	    return it('should create and render case_', function() {
	      var comp, x;
	      x = 0;
	      comp = case_((function() {
	        return x;
	      }), {
	        1: p(1),
	        2: p(2),
	        3: p(3)
	      }, 'others');
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x = 1;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	  });
	  return describe('Func', function() {
	    it('func(->12) ', function() {
	      var comp;
	      comp = func(function() {
	        return 12;
	      });
	      comp.mount();
	      expect(comp.node.textContent).to.equal('12');
	      comp.update();
	      expect(comp.node.textContent).to.equal('12');
	      comp.update();
	      return expect(comp.node.textContent).to.equal('12');
	    });
	    it('p(-> a))', function() {
	      var comp;
	      a = 1;
	      comp = p(function() {
	        return a;
	      });
	      comp.mount();
	      a = 2;
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('2');
	      a = 3;
	      comp.update();
	      a = 4;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('4');
	    });
	    it('should  create func component', function() {
	      var comp, x;
	      x = 1;
	      comp = func(function() {
	        return x;
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      return expect(comp.node.textContent).to.equal('1');
	    });
	    it('should create and  render func', function() {
	      var comp, x;
	      x = 0;
	      comp = func(function() {
	        return {
	          1: p(1),
	          2: p(2),
	          3: p(3)
	        }[x] || 'others';
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](window.Text);
	      expect(comp.node.textContent).to.equal('others');
	      x = 1;
	      comp.update();
	      expect(comp.node.innerHTML).to.equal('1');
	      x = 2;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should create and update func with  attrs', function() {
	      var comp, x;
	      x = 1;
	      comp = func({
	        "class": 'main',
	        fakeProp: function() {
	          return x;
	        }
	      }, function() {
	        return x;
	      });
	      comp.mount();
	      expect(comp.node.tagName).to.equal('DIV');
	      expect(comp.node.fakeProp).to.equal(1);
	      expect(comp.node).to.be["instanceof"](Element);
	      expect(comp.node.childNodes[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(2);
	      return expect(comp.node.childNodes[0].textContent).to.equal('2');
	    });
	    return it('should process tag with function', function() {
	      var comp;
	      comp = p(txt(function() {
	        return 1;
	      }));
	      expect(comp.children).to.be["instanceof"](Text);
	      comp.mount();
	      return expect(comp.node.innerHTML).to.equal('1');
	    });
	  });
	});


/***/ },
/* 9 */
/*!********************************************!*\
  !*** ./test/mocha/test-list-repeat.coffee ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, div, expect, func, idescribe, if_, iit, isComponent, list, ndescribe, nit, p, repeat, span, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, isComponent = dc.isComponent, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, repeat = dc.repeat, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe('list, repeat', function() {
	  describe('List', function() {
	    it('all of item in list should be  component', function() {
	      var comp;
	      comp = list([1, 2]);
	      return expect(!!isComponent(comp.children[0])).to.equal(true);
	    });
	    it('should create list component', function() {
	      var comp;
	      comp = list([span(['adf'])]);
	      comp.mount();
	      return expect(comp.node.tagName).to.equal('SPAN');
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
	      return expect(lst.node[1].textContent).to.equal('2');
	    });
	    return it('should create list with attrs', function() {
	      var comp, x;
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
	      comp.update();
	      expect(comp.node.fakeProp).to.equal(3);
	      return expect(comp.node.childNodes[1].textContent).to.equal('3');
	    });
	  });
	  describe('list', function() {
	    it('list(txt(->12))', function() {
	      var comp;
	      comp = list(txt(function() {
	        return 12;
	      }));
	      comp.mount();
	      comp.update();
	      comp.update();
	      comp.update();
	      return expect(comp.node.textContent).to.equal('12');
	    });
	    it('list(p(txt(->12))) ', function() {
	      var comp;
	      comp = list(p(txt(function() {
	        return 12;
	      })));
	      comp.mount();
	      comp.update();
	      comp.update();
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	    return it('list(p(->12)) ', function() {
	      var comp;
	      comp = list(p(function() {
	        return 12;
	      }));
	      comp.mount();
	      comp.update();
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('12');
	    });
	  });
	  return describe('Repeat', function() {
	    it('should create  repeat component', function() {
	      var comp, lst;
	      comp = repeat(lst = ['repeat', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount();
	      expect(comp.node).to.be["instanceof"](Array);
	      return expect(comp.node[0]).to.be["instanceof"](Element);
	    });
	    it('should mount and render repeat  component', function() {
	      var comp, lst;
	      document.getElementById('demo').innerHTML = '';
	      comp = repeat(lst = ['repeat', 'simple'], function(item, i) {
	        return p(item);
	      });
	      comp.mount("#demo");
	      expect(comp.node[0].innerHTML).to.equal('repeat');
	      expect(comp.node[1].innerHTML).to.equal('simple');
	      lst[0] = 3;
	      lst[1] = 4;
	      comp.update();
	      expect(comp.node[0].innerHTML).to.equal('3');
	      expect(comp.node[1].innerHTML).to.equal('4');
	      lst[2] = 5;
	      comp.update();
	      expect(comp.node[2].innerHTML).to.equal('5');
	      lst.length = 0;
	      comp.update();
	      return expect(comp.node.length).to.equal(1);
	    });
	    it('should process immutable template in repeat component', function() {
	      var comp, lst;
	      document.getElementById('demo').innerHTML = '';
	      comp = repeat(lst = [
	        {
	          text: 'a'
	        }, {
	          text: 'b'
	        }
	      ], (function(item, i) {
	        return p(txt(function() {
	          return item.text;
	        }));
	      }), {
	        itemTemplateImmutable: true
	      });
	      comp.mount("#demo");
	      expect(comp.node[0].textContent).to.equal('a');
	      expect(comp.node[1].textContent).to.equal('b');
	      lst[0].text = 'c';
	      lst[1].text = 'd';
	      comp.update();
	      expect(comp.node[0].textContent).to.equal('c');
	      expect(comp.node[1].textContent).to.equal('d');
	      lst[2] = {
	        text: 'e'
	      };
	      comp.update();
	      expect(comp.node[2].textContent).to.equal('e');
	      lst.length = 0;
	      comp.update();
	      return expect(comp.node.length).to.equal(1);
	    });
	    it('should process itemTemplateImmutable repeat component ', function() {
	      var comp, lst;
	      comp = repeat(lst = ['a', 'b'], (function(item, i, list) {
	        return p(txt(function() {
	          return list[i];
	        }));
	      }), {
	        itemTemplateImmutable: true
	      });
	      comp.mount();
	      lst[0] = 'c';
	      comp.update();
	      return expect(comp.node[0].textContent).to.equal('c');
	    });
	    it('should process tag with repeat', function() {
	      var comp, repeat1, text1, x;
	      x = 1;
	      text1 = null;
	      comp = new Tag('div', {}, [
	        repeat1 = repeat([1], function(item) {
	          return text1 = txt(x);
	        })
	      ]);
	      comp.create();
	      expect(comp.node.innerHTML).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(text1.node.textContent).to.equal('2');
	      expect(repeat1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	    it('should create and update deeper embedded repeat', function() {
	      var comp, repeat1, span1, x;
	      x = 1;
	      comp = div({}, span1 = new Tag('span', {}, [
	        repeat1 = repeat((function() {
	          return [x];
	        }), function(item) {
	          return txt(item);
	        })
	      ]));
	      comp.mount();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<span>2</span>');
	    });
	    it('should create and update embedded repeat in 3 layer', function() {
	      var comp, repeat1, span1, x;
	      x = 1;
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        repeat1 = repeat([1], function(item) {
	          return txt(x);
	        })
	      ])));
	      comp.mount();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	    });
	    it('should create and update embedded repeat in 3  layer', function() {
	      var comp, repeat1, span1, x;
	      x = 1;
	      comp = div({}, div({}, span1 = new Tag('span', {}, [
	        repeat1 = repeat((function() {
	          return [x];
	        }), function(item) {
	          return txt(item);
	        })
	      ])));
	      comp.mount();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(repeat1.node.parentNode).to.equal(span1.node);
	      expect(repeat1.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('<div><span>2</span></div>');
	    });
	    return it('should process repeat under repeat', function() {
	      var comp, repeat1, repeat2, x;
	      x = 1;
	      repeat2 = null;
	      comp = div({}, repeat1 = repeat([1], function() {
	        return repeat2 = repeat((function() {
	          return [x];
	        }), function(item) {
	          return item;
	        });
	      }));
	      comp.mount();
	      expect(repeat1.node.parentNode).to.equal(comp.node);
	      expect(repeat2.node[0].textContent).to.equal('1');
	      x = 2;
	      comp.update();
	      expect(repeat1.node.parentNode).to.equal(comp.node);
	      expect(repeat2.node[0].textContent).to.equal('2');
	      return expect(comp.node.innerHTML).to.equal('2');
	    });
	  });
	});


/***/ },
/* 10 */
/*!******************************************!*\
  !*** ./test/mocha/test-ref-clone.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, Tag, Text, TransformComponent, a, bindings, case_, clone, div, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, ref, repeat, span, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, repeat = dc.repeat, ref = dc.ref, clone = dc.clone, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe('ref, clone', function() {
	  describe('Ref', function() {
	    it('should throw error while constucting conflicted component without ref: if_((-> x), t1=txt(1), Ref(t1))', function() {
	      var t1;
	      t1 = txt(1);
	      return expect(function() {
	        return list(p(t1), if_(1, t1, t1));
	      }).to.not["throw"](Error);
	    });
	    return it('should getBaseComponent of if_((-> x), t1=txt(1), Ref(t1))', function() {
	      var comp, t1, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), t1 = txt(1), t1);
	      comp.mount();
	      return comp.update();
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
	    it('should process text clone component ', function() {
	      var comp, t1;
	      comp = list(t1 = txt(1), clone(t1));
	      comp.mount('#demo');
	      comp.update();
	      return expect(comp.node[1].textContent).to.equal('1');
	    });
	    it('should process tag clone component ', function() {
	      var c1, c2, comp;
	      comp = list(c1 = p(1), c2 = clone(c1));
	      comp.mount('#demo');
	      comp.update();
	      return expect(comp.node[1].innerHTML).to.equal('1');
	    });
	    return it('should process if_  clone component ', function() {
	      var c1, c2, comp, lstComp, x;
	      x = 0;
	      lstComp = list(c1 = p(2), c2 = clone(c1));
	      comp = if_((function() {
	        return x;
	      }), c1 = p(3), lstComp);
	      comp.mount('#demo');
	      x = 1;
	      comp.update();
	      return expect(comp.node.innerHTML).to.equal('3');
	    });
	  });
	});


/***/ },
/* 11 */
/*!******************************************!*\
  !*** ./test/mocha/test-accordion.coffee ***!
  \******************************************/
/***/ function(module, exports, __webpack_require__) {

	var Component, Tag, Text, TransformComponent, a, accordion, accordionGroup, bindings, case_, div, expect, func, idescribe, if_, iit, list, ndescribe, nit, p, repeat, span, text, txt, _ref;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, Component = dc.Component, TransformComponent = dc.TransformComponent, Tag = dc.Tag, Text = dc.Text, txt = dc.txt, list = dc.list, func = dc.func, if_ = dc.if_, case_ = dc.case_, func = dc.func, repeat = dc.repeat, accordionGroup = dc.accordionGroup, accordion = dc.accordion, a = dc.a, p = dc.p, span = dc.span, text = dc.text, div = dc.div;

	describe('accordion', function() {
	  it('should create and update accordion group', function() {
	    var comp;
	    comp = accordionGroup({}, 'group head', new Tag('span', {}, [
	      repeat([1], function(item) {
	        return txt(1);
	      })
	    ]), {});
	    comp.mount();
	    return expect(comp.node.innerHTML).to.equal('<div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div>');
	  });
	  it('should mount accordion', function() {
	    var comp;
	    comp = accordion({}, [
	      [
	        {}, 'group head', new Tag('span', {}, [
	          repeat([1], function(item) {
	            return txt(1);
	          })
	        ]), {}
	      ]
	    ], {});
	    comp.mount();
	    return expect(comp.node.innerHTML).to.equal('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
	  });
	  it('should mount and update repeat', function() {
	    var comp;
	    comp = new Tag('span', {}, [
	      repeat([1], function(item) {
	        return txt(1);
	      })
	    ]);
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal('1');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal('1');
	  });
	  it('should mount and update accordion', function() {
	    var comp, s;
	    comp = accordion({}, [
	      [
	        {}, 'group head', new Tag('span', {}, [
	          repeat([1], function(item) {
	            return txt(1);
	          })
	        ]), {}
	      ]
	    ], {});
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body"><span>1</span></div></div></div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal(s);
	  });
	  it('should mount and update accordion 2', function() {
	    var comp, s;
	    comp = accordion({}, [[{}, 'group head', txt(1), {}]], {});
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><div class="accordion-toggle"><span>group head</span></div></h4></div><div class="panel-collapse" style="display: none;"><div class="panel-body">1</div></div></div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal(s);
	  });
	  it('should mount and update accordion 3', function() {
	    var comp, s;
	    comp = div(div(repeat([txt(1)], function(item) {
	      return item;
	    })));
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '<div>1</div>');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal('<div>1</div>');
	  });
	  return it('should mount and update accordion 4', function() {
	    var comp, s;
	    comp = div(repeat([txt(1)], function(item) {
	      return item;
	    }));
	    comp.mount();
	    expect(comp.node.innerHTML).to.equal(s = '1');
	    comp.update();
	    return expect(comp.node.innerHTML).to.equal('1');
	  });
	});


/***/ },
/* 12 */
/*!***********************************************!*\
  !*** ./test/mocha/test-mount-callback.coffee ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var $a, $b, Component, List, Tag, Text, a, bibind, bindings, button, classFn, div, expect, func, idescribe, if_, iit, input, li, list, model, ndescribe, nit, p, show, span, styleFrom, text, txt, _a, _b, _ref, _ref1;

	_ref = __webpack_require__(/*! ./helper */ 2), expect = _ref.expect, iit = _ref.iit, idescribe = _ref.idescribe, nit = _ref.nit, ndescribe = _ref.ndescribe;

	bindings = dc.bindings, bibind = dc.bibind, classFn = dc.classFn, styleFrom = dc.styleFrom, model = dc.model, show = dc.show, Tag = dc.Tag, Text = dc.Text, List = dc.List, Component = dc.Component, list = dc.list, func = dc.func, if_ = dc.if_, txt = dc.txt, a = dc.a, p = dc.p, span = dc.span, text = dc.text, li = dc.li, div = dc.div, button = dc.button, input = dc.input;

	_ref1 = bindings({
	  a: 1,
	  b: 2
	}), $a = _ref1.$a, $b = _ref1.$b, _a = _ref1._a, _b = _ref1._b;

	describe("test beforeMount afterUnmount callback  ", function() {
	  describe('before mount callback', function() {
	    it('component shoud call mountCallback before mounting', function() {
	      var comp, x;
	      x = 0;
	      comp = p();
	      comp.beforeMount(function() {
	        return x = 1;
	      });
	      comp.mount();
	      return expect(x).to.equal(1);
	    });
	    it('component shoud call mountCallback before mounting if_', function() {
	      var comp, x;
	      x = 0;
	      comp = if_(1, 2, 3);
	      comp.beforeMount(function() {
	        return x = 1;
	      });
	      comp.mount();
	      return expect(x).to.equal(1);
	    });
	    it('component shoud call then_.mountCallback before updating if_', function() {
	      var comp, t, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), t = txt(1), txt(2));
	      t.beforeMount(function() {
	        return x = 1;
	      });
	      comp.mount();
	      expect(x).to.equal(0);
	      x = 1;
	      comp.update();
	      return expect(x).to.equal(1);
	    });
	    return it('component shoud call embeded mountCallback before updating if_', function() {
	      var comp, t, x;
	      x = 0;
	      comp = if_((function() {
	        return x;
	      }), p(t = txt(1)), txt(2));
	      t.beforeMount(function() {
	        return x = 1;
	      });
	      comp.mount();
	      expect(x).to.equal(0);
	      x = 1;
	      comp.update();
	      return expect(x).to.equal(1);
	    });
	  });
	  return describe('after unmount callback', function() {
	    it('component shoud call unmountCallback after mounting', function() {
	      var comp, x;
	      x = 0;
	      comp = p();
	      comp.beforeMount(function() {
	        return x = 1;
	      });
	      comp.afterUnmount(function() {
	        return x = 2;
	      });
	      comp.mount();
	      expect(x).to.equal(1);
	      comp.unmount();
	      return expect(x).to.equal(2);
	    });
	    it('component shoud call mountCallback before mounting if_', function() {
	      var comp, x, y;
	      x = 0;
	      y = 0;
	      comp = if_(1, 2, 3);
	      comp.beforeMount(function() {
	        return x = 1;
	      });
	      comp.afterUnmount(function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x).to.equal(1);
	      comp.unmount();
	      return expect(y).to.equal(2);
	    });
	    it('component shoud call then_.mountCallback before updating if_', function() {
	      var comp, t, t2, x, y;
	      x = 0;
	      y = 0;
	      comp = if_((function() {
	        return x;
	      }), t = txt(1), t2 = txt(2));
	      t.beforeMount(function() {
	        return x = 1;
	      });
	      t2.afterUnmount(function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x).to.equal(0);
	      x = 1;
	      comp.update();
	      expect(x).to.equal(1);
	      return expect(y).to.equal(2);
	    });
	    return it('component shoud call embeded mountCallback before updating if_', function() {
	      var comp, t, t2, x, y;
	      x = 0;
	      y = 0;
	      comp = if_((function() {
	        return x;
	      }), p(t = txt(1)), p(t2 = txt(2)));
	      t.beforeMount(function() {
	        return x = 1;
	      });
	      t2.afterUnmount(function() {
	        return y = 2;
	      });
	      comp.mount();
	      expect(x).to.equal(0);
	      x = 1;
	      comp.update();
	      expect(x).to.equal(1);
	      return expect(y).to.equal(2);
	    });
	  });
	});


/***/ }
/******/ ]);