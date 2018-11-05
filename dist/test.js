!function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/assets/",n(n.s=0)}([
/*!**********************************!*\
  !*** ./test/coffee/index.coffee ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";dc.alwaysRender=!0,n(/*! ./test-new-dc */1)},
/*!****************************************!*\
  !*** ./test/coffee/test-new-dc.coffee ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";var o,r,i,c,u=function(t){return t&&t.__esModule?t:{default:t}}(n(/*! ../../lib/backend/React */2));var a=n(/*! bdd-test-helper */4);r=a.expect,i=a.iit,a.idescribe,a.nit,a.ndescribe,a.newDemoNode,n(/*! ./helper */6).newDemoNode;var f=dc;o=f.bindings,f.see,f.Tag,f.Text,f.List,f.txt,f.list,f.p,f.div,f.Html,f.html,f.classFn,f.styleFrom,f.Nothing,c=f.isComponent,f.getters,o({a:1,b:2}).a_,describe("test-base-component",function(){return afterEach(function(){return dc.reset()}),describe("update baseComponent",function(){return it("should dc generate a component",function(){var t;return t=dc(),r(c(t)).to.be.true}),it("dc() chaining call",function(){var t,e;return e=at("x y"),t={x:x,y:y},dc.div(e).with(t)}),i("dc.react should be an backend",function(){var t;return t=dc.react(),r(t).to.be.instanceof(u.default)})})})},
/*!******************************!*\
  !*** ./lib/backend/React.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";var o=function(t){return t&&t.__esModule?t:{default:t}}(n(/*! ./Backend */3));t.exports=function(t){function e(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,o.default),e}()},
/*!********************************!*\
  !*** ./lib/backend/Backend.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}},
/*!**********************************************************************!*\
  !*** ./node_modules/_bdd-test-helper@0.0.3@bdd-test-helper/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";if("undefined"==typeof window)var o=n(/*! chai */5);else o=window.chai;e.expect=o.expect,e.iit=it.only,e.idescribe=describe.only,e.nit=function(){},e.ndescribe=function(){}},
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e){t.exports=chai},
/*!***********************************!*\
  !*** ./test/coffee/helper.coffee ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";var o;o=n(/*! extend */7),e.newDemoNode=function(t){var e;return e=document.createElement("div"),document.body.appendChild(e),t&&e.setAttribute("id",t),e},e.fakeEvent=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"click",n=arguments.length>2?arguments[2]:void 0;return"number"==typeof n?{target:t,type:e,keyCode:n,preventDefault:function(){},stopPropagation:function(){}}:o({target:t,type:e,preventDefault:function(){},stopPropagation:function(){}},n)}},
/*!****************************************************!*\
  !*** ./node_modules/_extend@3.0.2@extend/index.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(t,e,n){"use strict";var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=Object.prototype.hasOwnProperty,i=Object.prototype.toString,c=Object.defineProperty,u=Object.getOwnPropertyDescriptor,a=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===i.call(t)},f=function(t){if(!t||"[object Object]"!==i.call(t))return!1;var e,n=r.call(t,"constructor"),o=t.constructor&&t.constructor.prototype&&r.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!n&&!o)return!1;for(e in t);return void 0===e||r.call(t,e)},l=function(t,e){c&&"__proto__"===e.name?c(t,e.name,{enumerable:!0,configurable:!0,value:e.newValue,writable:!0}):t[e.name]=e.newValue},s=function(t,e){if("__proto__"===e){if(!r.call(t,e))return;if(u)return u(t,e).value}return t[e]};t.exports=function t(){var e,n,r,i,c,u,p=arguments[0],d=1,y=arguments.length,b=!1;for("boolean"==typeof p&&(b=p,p=arguments[1]||{},d=2),(null==p||"object"!==(void 0===p?"undefined":o(p))&&"function"!=typeof p)&&(p={});d<y;++d)if(null!=(e=arguments[d]))for(n in e)r=s(p,n),p!==(i=s(e,n))&&(b&&i&&(f(i)||(c=a(i)))?(c?(c=!1,u=r&&a(r)?r:[]):u=r&&f(r)?r:{},l(p,{name:n,newValue:t(b,u,i)})):void 0!==i&&l(p,{name:n,newValue:i}));return p}}]);