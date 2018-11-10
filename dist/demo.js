!function(e){var t={};function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)n.d(r,u,function(t){return e[t]}.bind(null,u));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/assets/",n(n.s=0)}([
/*!**********************************!*\
  !*** ./demo/coffee/index.coffee ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r=n(/*! ./util */1);dc.alwaysRender=!0,window.onload=function(){return(0,r.runDemo)(r.demoMap,"choose web framework")}},
/*!*********************************!*\
  !*** ./demo/coffee/util.coffee ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,u,o,c,a,i,d,f=n(/*! ./demo-each */2);n(/*! ./demo-debug */3);function l(){var e=function(e,t){t||(t=e.slice(0));return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}(["./demo-choose-web-framework"]);return l=function(){return e},e}var s=dc;d=s.select,i=s.see,s.if_,r=s.case_,c=s.list,s.func,s.each,u=s.div,s.p,dc.directive({$options:dc.$options,$model:dc.$model}),chooseFramework(from(l())),(o={}).demoMap={"choose web framework":chooseFramework,"show hide":n(/*! ./demo-show-hide */4).default,counter:n(/*! ./demo-counter */5).default,event:n(/*! ./demo-event */6).default,controls:n(/*! ./demo-controls */7).default,if:n(/*! ./demo-if-component */8).default,each1:f.eachDemo1,each2:f.eachDemo2,each3:f.eachDemo3,each4:f.eachDemo4,"switch 1 2 3 4":n(/*! ./demo-switch-1-2-3-4 */9).default,sum:n(/*! ./demo-sum */10).default,"text model":n(/*! ./demo-text-model */11).default,"mount/unmount":n(/*! ./demo-mount-unmount */12).default},o.makeDemoComponent=a=function(e,t){var n,o,a,f,l;for(l in a=i(t),o={},e)n=e[l],o[l]="function"==typeof n?n():n;return(n=c(f=d({$options:[Object.keys(e)],$model:a}),u(r(a,o,o[t])))).renderWhen(f,"change")},o.runDemo=function(e,t,n){return a(e,t).mount(n)};var v=o;t.default=v},
/*!**************************************!*\
  !*** ./demo/coffee/demo-each.coffee ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=dc;o=i.list,r=i.each,c=i.p,a=i.txt,(u={}).eachDemo1=function(){return o([1,2])},u.eachDemo2=function(){return r([1,2],function(e){return c(e)})},u.eachDemo3=function(){var e,t;return(e=r(t=[1,2,3,4,5,6],function(e){return c(e)})).on("willAttach",function(){return setTimeout(function(){return t.push(7),e.render()},1e3),setTimeout(function(){return t.setLength(4),e.render(),dc.clean()},2e3)}),e},u.eachDemo4=function(){var e,t;return(e=r(t=[1,2,3,4,5,6],function(e){return a(e)})).on("willAttach",function(){return setTimeout(function(){return t.push(7),e.render()},1e3),setTimeout(function(){return t.setLength(4),e.render(),dc.clean()},2e3)}),e};var d=u;t.default=d},
/*!***************************************!*\
  !*** ./demo/coffee/demo-debug.coffee ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a,i,d,f,l;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s=dc;f=s.see,a=s.if_,i=s.list,o=s.each,r=s.div,d=s.p,l=s.text,u=s.duplex,(c={}).demoEachPush=function(){var e,t;return(e=i(o(t=[1,2],function(e){return d(e)}),"some other thing")).mount(),t.push(3),e.render()},c.demoIfEach=function(){var e,t;return t=f(!0),(e=a(t,o([1,2],function(e){return r(e)}))).mount(),t(!1),e.render(),dc.clean(),t(!0),e.render(),dc.clean()},c.demoModelOnMultipleInput=function(){var e,t,n;return t=l({$model:u(e={},"x")}),n=l({$model:u(e,"x")}),i(t,n).renderWhen([t,n],"change").mount()};var v=c;t.default=v},
/*!*******************************************!*\
  !*** ./demo/coffee/demo-show-hide.coffee ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a,i;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return t=a(!0),e=o(r({onclick:function(){return i(t),e.render()}},"show/hide by changing style.display"),c({class:{},style:{display:function(){return t()?"block":"none"}}},"asdfdfs"))};var d=dc;o=d.list,d.text,r=d.div,c=d.p,a=d.see,u=d.flow,i=u.toggle},
/*!*****************************************!*\
  !*** ./demo/coffee/demo-counter.coffee ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return t=u(e=0),r(o(t)).on("willAttach",function(){var n;return n=setInterval(function(){if(t(e++),1001===e)return clearInterval(n)},1)}).renderWhen(setInterval,16,{clear:function(){return e>=1e3}})};var c=dc;o=c.txt,r=c.p,u=c.see},
/*!***************************************!*\
  !*** ./demo/coffee/demo-event.coffee ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return t=r({onclick:function(){return alert("parent")}},o({onclick:function(e){return alert("child"),e.continuePropagation=!0}},"propagation")),e=r({onclick:function(){return alert("parent")}},o({onclick:function(e){return alert("child")}},"do not propagation")),u(t,e)};var c=dc;u=c.list,r=c.a,c.checkbox,c.text,o=c.p},
/*!******************************************!*\
  !*** ./demo/coffee/demo-controls.coffee ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t,n,a,i,d,f,l=r({a:1});return e=l.a$,a=o(t=u(e),n=u(e)),f=o(i=c(e),d=c(e)),e(6),o(a,f).renderWhen([t,n,i,d],"change")};var a=dc;o=a.list,a.a,u=a.checkbox,c=a.text,a.p,r=a.bindings},
/*!**********************************************!*\
  !*** ./demo/coffee/demo-if-component.coffee ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return t=c(0,parseFloat),e=o(a({onchange:function(){return e.render(),dc.clean()}},t),u(t,r("It is not 0."),r("It is 0 or NaN.")))};var i=dc;o=i.list,u=i.if_,a=i.text,r=i.div,c=i.see},
/*!************************************************!*\
  !*** ./demo/coffee/demo-switch-1-2-3-4.coffee ***!
  \************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a,i;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return t=i(0),c(e=a(t),o(u(t,function(){var e;if((e=t())>=0&&e<=3)return r(e)}))).renderWhen(e,"change")};var d=dc;o=d.func,i=d.see,u=d.flow,d.each,c=d.list,r=d.div,a=d.number},
/*!*************************************!*\
  !*** ./demo/coffee/demo-sum.coffee ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c,a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=dc;c=i.see,r=i.flow,u=i.list,a=i.text,o=i.p;var d=function(){var e,t,n,i;return e=c(1),t=c(2),u(n=a({value:e,onchange:function(){return e(1*this.node.value)}}),i=a({value:t,onchange:function(){return t(1*this.node.value)}}),o(r.add(e,t))).renderWhen([n,i],"change")};t.default=d},
/*!********************************************!*\
  !*** ./demo/coffee/demo-text-model.coffee ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t,n,c=r({a:1});return e=c.a$,n=u(o(t={onchange:function(){return n.render()}},e),o(t,e))};var c=dc;u=c.list,r=c.bindings,c.a,c.checkbox,o=c.text},
/*!***********************************************!*\
  !*** ./demo/coffee/demo-mount-unmount.coffee ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,t,n){"use strict";var r,u,o,c;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t;return e=c(!0),o(r({onclick:function(){return e(!0),t.render()}},"mount"),r({onclick:function(){return e(!1),t.render(),dc.clean()}},"unmount"),t=u(e,r("toggle me")))};var a=dc;o=a.list,r=a.div,c=a.see,u=a.if_}]);