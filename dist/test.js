!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/assets/",n(n.s=0)}([
/*!**************************!*\
  !*** ./test/js/index.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";dc.alwaysRender=!0,n(/*! ./test-new-dc */1)},
/*!********************************!*\
  !*** ./test/js/test-new-dc.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,o,i,u=function(e){return e&&e.__esModule?e:{default:e}}(n(/*! ../../lib/backend/React */2));var c=n(/*! bdd-test-helper */4);o=c.expect,c.iit,c.idescribe,c.nit,c.ndescribe,c.newDemoNode,n(/*! ./helper */6).newDemoNode;var a=dc;r=a.bindings,a.see,a.Tag,a.Text,a.List,a.txt,a.list,a.p,a.div,a.Html,a.html,a.classFn,a.styleFrom,a.Nothing,i=a.isComponent,a.getters,r({a:1,b:2}).a_,describe("test-base-component",function(){return afterEach(function(){return dc.reset()}),describe("update baseComponent",function(){return it("should dc generate a component",function(){var e;return e=dc(),o(i(e)).to.be.true}),it("dc() chaining call",function(){var e,t;return t=at("x y"),e={x:x,y:y},dc.div(t).with(e)}),it("dc.react should be an backend",function(){var e;return e=dc.react(),o(e).to.be.instanceof(u.default)})})})},
/*!******************************!*\
  !*** ./lib/backend/React.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r=function(e){return e&&e.__esModule?e:{default:e}}(n(/*! ./Backend */3));e.exports=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default),t}()},
/*!********************************!*\
  !*** ./lib/backend/Backend.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.default=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this instanceof e&&dc.error(new Error("Backend is an abstract Base Class;\n should not create the instance of Backend directly,\n use its Derived classes instead"))}return r(e,[{key:"by",value:function(e){var t;return(t=new Component).ComponentClass=e,t.backend=this,t}},{key:"render",value:function(e){}},{key:"mount",value:function(e,t){}},{key:"unmount",value:function(e){}},{key:"create",value:function(e){}}]),e}()},
/*!**********************************************************************!*\
  !*** ./node_modules/_bdd-test-helper@0.0.3@bdd-test-helper/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";if("undefined"==typeof window)var r=n(/*! chai */5);else r=window.chai;t.expect=r.expect,t.iit=it.only,t.idescribe=describe.only,t.nit=function(){},t.ndescribe=function(){}},
/*!***********************!*\
  !*** external "chai" ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t){e.exports=chai},
/*!***************************!*\
  !*** ./test/js/helper.js ***!
  \***************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r;r=n(/*! extend */7),t.newDemoNode=function(e){var t;return t=document.createElement("div"),document.body.appendChild(t),e&&t.setAttribute("id",e),t},t.fakeEvent=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"click",n=arguments[2];return"number"==typeof n?{target:e,type:t,keyCode:n,preventDefault:function(){},stopPropagation:function(){}}:r({target:e,type:t,preventDefault:function(){},stopPropagation:function(){}},n)}},
/*!****************************************************!*\
  !*** ./node_modules/_extend@3.0.2@extend/index.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=Object.prototype.hasOwnProperty,i=Object.prototype.toString,u=Object.defineProperty,c=Object.getOwnPropertyDescriptor,a=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===i.call(e)},f=function(e){if(!e||"[object Object]"!==i.call(e))return!1;var t,n=o.call(e,"constructor"),r=e.constructor&&e.constructor.prototype&&o.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!n&&!r)return!1;for(t in e);return void 0===t||o.call(e,t)},l=function(e,t){u&&"__proto__"===t.name?u(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},s=function(e,t){if("__proto__"===t){if(!o.call(e,t))return;if(c)return c(e,t).value}return e[t]};e.exports=function e(){var t,n,o,i,u,c,p=arguments[0],d=1,y=arguments.length,b=!1;for("boolean"==typeof p&&(b=p,p=arguments[1]||{},d=2),(null==p||"object"!==(void 0===p?"undefined":r(p))&&"function"!=typeof p)&&(p={});d<y;++d)if(null!=(t=arguments[d]))for(n in t)o=s(p,n),p!==(i=s(t,n))&&(b&&i&&(f(i)||(u=a(i)))?(u?(u=!1,c=o&&a(o)?o:[]):c=o&&f(o)?o:{},l(p,{name:n,newValue:e(b,c,i)})):void 0!==i&&l(p,{name:n,newValue:i}));return p}}]);