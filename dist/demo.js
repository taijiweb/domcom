!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/assets/",t(t.s=0)}([
/*!**************************!*\
  !*** ./demo/js/index.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u=t(/*! ./util */1);o=u.runDemo,r=u.demoMap,dc.alwaysRender=!0,window.onload=function(){return o(r,"choose web framework")}},
/*!*************************!*\
  !*** ./demo/js/util.js ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s,f,l,d,h,p=dc;h=p.select,d=p.see,p.if_,r=p.case_,f=p.list,p.func,p.each,u=p.div,p.p,dc.directives({$options:dc.$options,$model:dc.$model});var v=t(/*! ./demo-each */2);c=v.eachDemo1,i=v.eachDemo2,a=v.eachDemo3,s=v.eachDemo4,o=t(/*! ./demo-choose-web-framework */3);var m=t(/*! ./demo-debug */5);m.demoEachPush,m.demoIfEach,m.demoModelOnMultipleInput,n.demoMap={"choose web framework":o,"show hide":t(/*! ./demo-show-hide */6),counter:t(/*! ./demo-counter */7),event:t(/*! ./demo-event */8),controls:t(/*! ./demo-controls */9),if:t(/*! ./demo-if-component */10),each1:c,each2:i,each3:a,each4:s,"switch 1 2 3 4":t(/*! ./demo-switch-1-2-3-4 */11),sum:t(/*! ./demo-sum */12),"text model":t(/*! ./demo-text-model */13),"mount/unmount":t(/*! ./demo-mount-unmount */14)},n.makeDemoComponent=l=function(e,n){var t,o,c,i,a;for(a in c=d(n),o={},e)t=e[a],o[a]="function"==typeof t?t():t;return(t=f(i=h({$options:[Object.keys(e)],$model:c}),u(r(c,o,o[n])))).renderWhen(i,"change")},n.runDemo=function(e,n,t){return l(e,n).mount(t)}},
/*!******************************!*\
  !*** ./demo/js/demo-each.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;o=i.list,r=i.each,u=i.p,c=i.txt,n.eachDemo1=function(){return o([1,2])},n.eachDemo2=function(){return r([1,2],function(e){return u(e)})},n.eachDemo3=function(){var e,n;return(e=r(n=[1,2,3,4,5,6],function(e){return u(e)})).on("willAttach",function(){return setTimeout(function(){return n.push(7),e.render()},1e3),setTimeout(function(){return n.setLength(4),e.render(),dc.clean()},2e3)}),e},n.eachDemo4=function(){var e,n;return(e=r(n=[1,2,3,4,5,6],function(e){return c(e)})).on("willAttach",function(){return setTimeout(function(){return n.push(7),e.render()},1e3),setTimeout(function(){return n.setLength(4),e.render(),dc.clean()},2e3)}),e}},
/*!**********************************************!*\
  !*** ./demo/js/demo-choose-web-framework.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";(function(n){var t,r,o,u,c,i,a,s,f,l,d=n.dc,h=n.dc;c=h.flow,f=h.see,t=h.case_,o=h.each,u=h.every,i=h.func,s=h.list,r=h.div,a=h.label,l=h.text,e.exports=function(){var e,n,o,c,i,h,p,v,m,g,y;for(c=f("d",function(e){return e.toLowerCase()}),o=null,y=a("Please choose: "),g=l({onchange:function(){return o.render(),d.clean()}},c),v=u(i=["Domcom","jQuery","Angular","React","Backbone","Ember"],function(e){return r(e[0]+". "+e)}),e={},h=0,m=i.length;h<m;h++)e[(p=i[h])[0]]=p;return n=t(c,e,"some other things"),o=s(y,g,v,r("You perfer ",n,"."))},e.exports=function(){var e,n,t,u,h,p,v,m,g;return u=f("d",function(e){return e.toLowerCase()}),t=null,m=a("Please choose: "),v=l({onchange:function(){return t.render()}},u),p=o(h=["Domcom","jQuery","Angular","React","Backbone","Ember"],function(e){return r(e[0]+". "+e)}),g=a("add some others: "),e=l({onchange:function(e,n){var r;return r=n.value,h.push(r),u(r[0]),t.render(),d.clean()}}),n=i(c(u,function(){var e,n,t,r;for(e=u(),n=0,r=h.length;n<r;n++)if((t=h[n])[0].toLowerCase()===e)return t;return"some other things"})),t=s(m,v,g,e,p,r("You perfer ",n,"."))}}).call(this,t(/*! ./../../node_modules/_webpack@4.23.1@webpack/buildin/global.js */4))},
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(e){"object"===("undefined"==typeof window?"undefined":o(window))&&(r=window)}e.exports=r},
/*!*******************************!*\
  !*** ./demo/js/demo-debug.js ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s,f,l=dc;s=l.see,c=l.if_,i=l.list,u=l.each,r=l.div,a=l.p,f=l.text,o=l.duplex,n.demoEachPush=function(){var e,n;return(e=i(u(n=[1,2],function(e){return a(e)}),"some other thing")).mount(),n.push(3),e.render()},n.demoIfEach=function(){var e,n;return n=s(!0),(e=c(n,u([1,2],function(e){return r(e)}))).mount(),n(!1),e.render(),dc.clean(),n(!0),e.render(),dc.clean()},n.demoModelOnMultipleInput=function(){var e,n,t;return n=f({$model:o(e={},"x")}),t=f({$model:o(e,"x")}),i(n,t).renderWhen([n,t],"change").mount()}},
/*!***********************************!*\
  !*** ./demo/js/demo-show-hide.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s=dc;u=s.list,s.text,r=s.div,c=s.p,i=s.see,o=s.flow,a=o.toggle,e.exports=function(){var e,n;return n=i(!0),e=u(r({onclick:function(){return a(n),e.render()}},"show/hide by changing style.display"),c({class:{},style:{display:function(){return n()?"block":"none"}}},"asdfdfs"))}},
/*!*********************************!*\
  !*** ./demo/js/demo-counter.js ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;u=c.txt,r=c.p,o=c.see,e.exports=function(){var e,n;return n=o(e=0),r(u(n)).on("willAttach",function(){var t;return t=setInterval(function(){if(n(e++),1001===e)return clearInterval(t)},1)}).renderWhen(setInterval,16,{clear:function(){return e>=1e3}})}},
/*!*******************************!*\
  !*** ./demo/js/demo-event.js ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;o=c.list,r=c.a,c.checkbox,c.text,u=c.p,e.exports=function(){var e,n;return n=r({onclick:function(){return alert("parent")}},u({onclick:function(e){return alert("child"),e.continuePropagation=!0}},"propagation")),e=r({onclick:function(){return alert("parent")}},u({onclick:function(e){return alert("child")}},"do not propagation")),o(n,e)}},
/*!**********************************!*\
  !*** ./demo/js/demo-controls.js ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;u=i.list,i.a,o=i.checkbox,c=i.text,i.p,r=i.bindings,e.exports=function(){var e,n,t,i,a,s,f;return e=r({a:1}).a$,i=u(n=o(e),t=o(e)),f=u(a=c(e),s=c(e)),e(6),u(i,f).renderWhen([n,t,a,s],"change")}},
/*!**************************************!*\
  !*** ./demo/js/demo-if-component.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a=dc;u=a.list,o=a.if_,i=a.text,r=a.div,c=a.see,e.exports=function(){var e,n;return n=c(0,parseNumber),e=u(i({onchange:function(){return n=parseInt(this.node.value),e.render(),dc.clean()}},n),o(n,r(1),r(2)))},e.exports=function(){var e,n;return n=c(0,parseFloat),e=u(i({onchange:function(){return e.render(),dc.clean()}},n),o(n,r("It is not 0."),r("It is 0 or NaN.")))}},
/*!****************************************!*\
  !*** ./demo/js/demo-switch-1-2-3-4.js ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a,s,f=dc;c=f.func,s=f.see,u=f.flow,o=f.each,i=f.list,r=f.div,a=f.number,e.exports=function(){var e,n,t,u;return u=0,e=null,n=a({onchange:function(){return u=parseInt(this.node.value),e.render(),dc.clean()}}),t=o([0,1,2,3],function(e){return r({style:{display:function(){return e===u?"block":"none"}}},e)}),e=i(n,t)},e.exports=function(){var e,n,t;return t=0,e=null,n=a({onchange:function(){return t=parseInt(this.node.value),e.render(),dc.clean()}}),e=i(n,c(function(){if(t>=0&&t<=3)return r(t)}))},e.exports=function(){var e,n;return n=s(0),i(e=a(n),c(u(n,function(){var e;if((e=n())>=0&&e<=3)return r(e)}))).renderWhen(e,"change")}},
/*!*****************************!*\
  !*** ./demo/js/demo-sum.js ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i,a=dc;c=a.see,r=a.flow,o=a.list,i=a.text,u=a.p,e.exports=function(){var e,n,t,a;return e=c(1,parseFloat),n=c(2,parseFloat),o(t=i({value:e,onchange:function(){return e(this.node.value)}}),a=i({value:n,onchange:function(){return n(this.node.value)}}),u(r.add(e,n))).renderWhen([t,a],"change")},e.exports=function(){var e,n,t,a;return e=c(1),n=c(2),o(t=i({value:e,onchange:function(){return e(1*this.node.value)}}),a=i({value:n,onchange:function(){return n(1*this.node.value)}}),u(r.add(e,n))).renderWhen([t,a],"change")}},
/*!************************************!*\
  !*** ./demo/js/demo-text-model.js ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c=dc;o=c.list,r=c.bindings,c.a,c.checkbox,u=c.text,e.exports=function(){var e,n,t;return e=r({a:1}).a$,t=o(u(n={onchange:function(){return t.render()}},e),u(n,e))}},
/*!***************************************!*\
  !*** ./demo/js/demo-mount-unmount.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */function(e,n,t){"use strict";var r,o,u,c,i=dc;u=i.list,r=i.div,c=i.see,o=i.if_,e.exports=function(){var e,n;return e=c(!0),u(r({onclick:function(){return e(!0),n.render()}},"mount"),r({onclick:function(){return e(!1),n.render(),dc.clean()}},"unmount"),n=o(e,r("toggle me")))}}]);