!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/assets/",t(t.s=0)}([
/*!**********************************!*\
  !*** ./demo/coffee/index.coffee ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r=t(/*! ./util */1);dc.alwaysRender=!0,window.onload=function(){return(0,r.runDemo)(r.demoMap,"choose web framework")}},
/*!*********************************!*\
  !*** ./demo/coffee/util.coffee ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s=t(/*! ./demo-each */2);t(/*! ./demo-debug */3);function f(){var e=function(e,n){n||(n=e.slice(0));return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}(["./demo-choose-web-framework"]);return f=function(){return e},e}var l=dc;a=l.select,i=l.see,l.if_,r=l.case_,u=l.list,l.func,l.each,o=l.div,l.p,dc.directives({$options:dc.$options,$model:dc.$model}),chooseFramework(from(f())),n.demoMap={"choose web framework":chooseFramework,"show hide":t(/*! ./demo-show-hide */4),counter:t(/*! ./demo-counter */5),event:t(/*! ./demo-event */6),controls:t(/*! ./demo-controls */7),if:t(/*! ./demo-if-component */8),each1:s.eachDemo1,each2:s.eachDemo2,each3:s.eachDemo3,each4:s.eachDemo4,"switch 1 2 3 4":t(/*! ./demo-switch-1-2-3-4 */9),sum:t(/*! ./demo-sum */10),"text model":t(/*! ./demo-text-model */11),"mount/unmount":t(/*! ./demo-mount-unmount */12)},n.makeDemoComponent=c=function(e,n){var t,c,s,f,l;for(l in s=i(n),c={},e)t=e[l],c[l]="function"==typeof t?t():t;return(t=u(f=a({$options:[Object.keys(e)],$model:s}),o(r(s,c,c[n])))).renderWhen(f,"change")},n.runDemo=function(e,n,t){return c(e,n).mount(t)}},
/*!**************************************!*\
  !*** ./demo/coffee/demo-each.coffee ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;o=i.list,r=i.each,u=i.p,c=i.txt,n.eachDemo1=function(){return o([1,2])},n.eachDemo2=function(){return r([1,2],function(e){return u(e)})},n.eachDemo3=function(){var e,n;return(e=r(n=[1,2,3,4,5,6],function(e){return u(e)})).on("willAttach",function(){return setTimeout(function(){return n.push(7),e.render()},1e3),setTimeout(function(){return n.setLength(4),e.render(),dc.clean()},2e3)}),e},n.eachDemo4=function(){var e,n;return(e=r(n=[1,2,3,4,5,6],function(e){return c(e)})).on("willAttach",function(){return setTimeout(function(){return n.push(7),e.render()},1e3),setTimeout(function(){return n.setLength(4),e.render(),dc.clean()},2e3)}),e}},
/*!***************************************!*\
  !*** ./demo/coffee/demo-debug.coffee ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s,f,l=dc;s=l.see,c=l.if_,i=l.list,u=l.each,r=l.div,a=l.p,f=l.text,o=l.duplex,n.demoEachPush=function(){var e,n;return(e=i(u(n=[1,2],function(e){return a(e)}),"some other thing")).mount(),n.push(3),e.render()},n.demoIfEach=function(){var e,n;return n=s(!0),(e=c(n,u([1,2],function(e){return r(e)}))).mount(),n(!1),e.render(),dc.clean(),n(!0),e.render(),dc.clean()},n.demoModelOnMultipleInput=function(){var e,n,t;return n=f({$model:o(e={},"x")}),t=f({$model:o(e,"x")}),i(n,t).renderWhen([n,t],"change").mount()}},
/*!*******************************************!*\
  !*** ./demo/coffee/demo-show-hide.coffee ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s=dc;u=s.list,s.text,r=s.div,c=s.p,i=s.see,o=s.flow,a=o.toggle,e.exports=function(){var e,n;return n=i(!0),e=u(r({onclick:function(){return a(n),e.render()}},"show/hide by changing style.display"),c({class:{},style:{display:function(){return n()?"block":"none"}}},"asdfdfs"))}},
/*!*****************************************!*\
  !*** ./demo/coffee/demo-counter.coffee ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;u=c.txt,r=c.p,o=c.see,e.exports=function(){var e,n;return n=o(e=0),r(u(n)).on("willAttach",function(){var t;return t=setInterval(function(){if(n(e++),1001===e)return clearInterval(t)},1)}).renderWhen(setInterval,16,{clear:function(){return e>=1e3}})}},
/*!***************************************!*\
  !*** ./demo/coffee/demo-event.coffee ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;o=c.list,r=c.a,c.checkbox,c.text,u=c.p,e.exports=function(){var e,n;return n=r({onclick:function(){return alert("parent")}},u({onclick:function(e){return alert("child"),e.continuePropagation=!0}},"propagation")),e=r({onclick:function(){return alert("parent")}},u({onclick:function(e){return alert("child")}},"do not propagation")),o(n,e)}},
/*!******************************************!*\
  !*** ./demo/coffee/demo-controls.coffee ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;u=i.list,i.a,o=i.checkbox,c=i.text,i.p,r=i.bindings,e.exports=function(){var e,n,t,i,a,s,f;return e=r({a:1}).a$,i=u(n=o(e),t=o(e)),f=u(a=c(e),s=c(e)),e(6),u(i,f).renderWhen([n,t,a,s],"change")}},
/*!**********************************************!*\
  !*** ./demo/coffee/demo-if-component.coffee ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a=dc;u=a.list,o=a.if_,i=a.text,r=a.div,c=a.see,e.exports=function(){var e,n;return n=c(0,parseNumber),e=u(i({onchange:function(){return n=parseInt(this.node.value),e.render(),dc.clean()}},n),o(n,r(1),r(2)))},e.exports=function(){var e,n;return n=c(0,parseFloat),e=u(i({onchange:function(){return e.render(),dc.clean()}},n),o(n,r("It is not 0."),r("It is 0 or NaN.")))}},
/*!************************************************!*\
  !*** ./demo/coffee/demo-switch-1-2-3-4.coffee ***!
  \************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s,f=dc;c=f.func,s=f.see,u=f.flow,o=f.each,i=f.list,r=f.div,a=f.number,e.exports=function(){var e,n,t,u;return u=0,e=null,n=a({onchange:function(){return u=parseInt(this.node.value),e.render(),dc.clean()}}),t=o([0,1,2,3],function(e){return r({style:{display:function(){return e===u?"block":"none"}}},e)}),e=i(n,t)},e.exports=function(){var e,n,t;return t=0,e=null,n=a({onchange:function(){return t=parseInt(this.node.value),e.render(),dc.clean()}}),e=i(n,c(function(){if(t>=0&&t<=3)return r(t)}))},e.exports=function(){var e,n;return n=s(0),i(e=a(n),c(u(n,function(){var e;if((e=n())>=0&&e<=3)return r(e)}))).renderWhen(e,"change")}},
/*!*************************************!*\
  !*** ./demo/coffee/demo-sum.coffee ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a=dc;c=a.see,r=a.flow,o=a.list,i=a.text,u=a.p,e.exports=function(){var e,n,t,a;return e=c(1,parseFloat),n=c(2,parseFloat),o(t=i({value:e,onchange:function(){return e(this.node.value)}}),a=i({value:n,onchange:function(){return n(this.node.value)}}),u(r.add(e,n))).renderWhen([t,a],"change")},e.exports=function(){var e,n,t,a;return e=c(1),n=c(2),o(t=i({value:e,onchange:function(){return e(1*this.node.value)}}),a=i({value:n,onchange:function(){return n(1*this.node.value)}}),u(r.add(e,n))).renderWhen([t,a],"change")}},
/*!********************************************!*\
  !*** ./demo/coffee/demo-text-model.coffee ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;o=c.list,r=c.bindings,c.a,c.checkbox,u=c.text,e.exports=function(){var e,n,t;return e=r({a:1}).a$,t=o(u(n={onchange:function(){return t.render()}},e),u(n,e))}},
/*!***********************************************!*\
  !*** ./demo/coffee/demo-mount-unmount.coffee ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;u=i.list,r=i.div,c=i.see,o=i.if_,e.exports=function(){var e,n;return e=c(!0),u(r({onclick:function(){return e(!0),n.render()}},"mount"),r({onclick:function(){return e(!1),n.render(),dc.clean()}},"unmount"),n=o(e,r("toggle me")))}}]);