!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/assets/",n(n.s=0)}([
/*!**********************************!*\
  !*** ./test/coffee/index.coffee ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";dc.alwaysRender=!0,n(/*! ./test-new-dc */1)},
/*!****************************************!*\
  !*** ./test/coffee/test-new-dc.coffee ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var o,r,u,i=function(e){return e&&e.__esModule?e:{default:e}}(n(/*! ../../src/backend/React */2));var c=n(/*! bdd-test-helper */4);r=c.expect,c.iit,c.idescribe,c.nit,c.ndescribe,c.newDemoNode,n(/*! ./helper */6).newDemoNode;var a=dc;o=a.bindings,a.see,a.Tag,a.Text,a.List,a.txt,a.list,a.p,a.div,a.Html,a.html,a.classFn,a.styleFrom,a.Nothing,u=a.isComponent,a.getters,o({a:1,b:2}).a_,describe("test-base-component",function(){return afterEach(function(){return dc.reset()}),describe("update BaseBlock",function(){return it("should dc generate a component",function(){var e;return e=dc(),r(u(e)).to.be.true}),it("dc() chaining call",function(){var e,t;return t=at("x y"),e={x:x,y:y},dc.div(t).with(e)}),it("dc.react should be an backend",function(){var e;return e=dc.react(),r(e).to.be.instanceof(i.default)})})})},
/*!**********************************!*\
  !*** ./src/backend/React.coffee ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=function(e){return e&&e.__esModule?e:{default:e}}(n(/*! ./Backend */3));function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var c=function(){var e=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),u(void 0)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(t,o.default),t}();return e.prototype.name="React",e}.call(void 0);t.default=c},
/*!************************************!*\
  !*** ./src/backend/Backend.coffee ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this instanceof e&&dc.error(new Error("Backend is an abstract Base Class;\n should not create the instance of Backend directly,\n use its Derived classes instead"))}return function(e,t,n){t&&o(e.prototype,t),n&&o(e,n)}(e,[{key:"by",value:function(e){var t;return(t=new Component).ComponentClass=e,t.backend=this,t}},{key:"render",value:function(e){}},{key:"mount",value:function(e,t){}},{key:"unmount",value:function(e){}},{key:"create",value:function(e){}}]),e}();t.default=r},
/*!**********************************************************************!*\
  !*** ./node_modules/_bdd-test-helper@0.0.3@bdd-test-helper/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";if("undefined"==typeof window)var o=n(/*! chai */5);else o=window.chai;t.expect=o.expect,t.iit=it.only,t.idescribe=describe.only,t.nit=function(){},t.ndescribe=function(){}},
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t){e.exports=chai},
/*!***********************************!*\
  !*** ./test/coffee/helper.coffee ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var o;o=n(/*! extend */7),t.newDemoNode=function(e){var t;return t=document.createElement("div"),document.body.appendChild(t),e&&t.setAttribute("id",e),t},t.fakeEvent=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"click",n=arguments.length>2?arguments[2]:void 0;return"number"==typeof n?{target:e,type:t,keyCode:n,preventDefault:function(){},stopPropagation:function(){}}:o({target:e,type:t,preventDefault:function(){},stopPropagation:function(){}},n)}},
/*!****************************************************!*\
  !*** ./node_modules/_extend@3.0.2@extend/index.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=Object.prototype.hasOwnProperty,u=Object.prototype.toString,i=Object.defineProperty,c=Object.getOwnPropertyDescriptor,a=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===u.call(e)},f=function(e){if(!e||"[object Object]"!==u.call(e))return!1;var t,n=r.call(e,"constructor"),o=e.constructor&&e.constructor.prototype&&r.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!n&&!o)return!1;for(t in e);return void 0===t||r.call(e,t)},l=function(e,t){i&&"__proto__"===t.name?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},s=function(e,t){if("__proto__"===t){if(!r.call(e,t))return;if(c)return c(e,t).value}return e[t]};e.exports=function e(){var t,n,r,u,i,c,d=arguments[0],p=1,y=arguments.length,b=!1;for("boolean"==typeof d&&(b=d,d=arguments[1]||{},p=2),(null==d||"object"!==(void 0===d?"undefined":o(d))&&"function"!=typeof d)&&(d={});p<y;++p)if(null!=(t=arguments[p]))for(n in t)r=s(d,n),d!==(u=s(t,n))&&(b&&u&&(f(u)||(i=a(u)))?(i?(i=!1,c=r&&a(r)?r:[]):c=r&&f(r)?r:{},l(d,{name:n,newValue:e(b,c,u)})):void 0!==u&&l(d,{name:n,newValue:u}));return d}}]);