var accordion, case_, chooseFramework, demoCombo, demoEachPush, demoIfEach, demoMap, demoModelOnMultipleInput, demoTriangle, div, each, eachDemo1, eachDemo2, eachDemo3, eachDemo4, func, if_, list, makeDemoComponent, p, see, select, splitterDemo, _ref, _ref1, _ref2;

select = dc.select, see = dc.see, if_ = dc.if_, case_ = dc.case_, list = dc.list, func = dc.func, each = dc.each, div = dc.div, p = dc.p;

dc.directives({
  $options: dc.$options,
  $model: dc.$model
});

_ref = require('./demo-each'), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

_ref1 = require('./demo-builtins'), demoTriangle = _ref1.demoTriangle, demoCombo = _ref1.demoCombo, demoModelOnMultipleInput = _ref1.demoModelOnMultipleInput;

splitterDemo = require('./demo-splitter');

accordion = require('./demo-accordion');

chooseFramework = require('./demo-choose-web-framework');

_ref2 = require('./demo-debug'), demoEachPush = _ref2.demoEachPush, demoIfEach = _ref2.demoIfEach, demoModelOnMultipleInput = _ref2.demoModelOnMultipleInput;

exports.demoMap = demoMap = {
  'choose web framework': chooseFramework(),
  accordion: accordion(),
  triangle: demoTriangle(),
  combo: demoCombo(),
  "show hide": require('./demo-show-hide')(),
  counter: require('./demo-counter')(),
  dialog: require('./demo-dialog')(),
  event: require('./demo-event')(),
  controls: require('./demo-controls')(),
  "if": require('./demo-if-component')(),
  each1: eachDemo1(),
  each2: eachDemo2(),
  each3: eachDemo3(),
  each4: eachDemo4(),
  'switch 1 2 3 4': require('./demo-switch-1-2-3-4')(),
  splitter: splitterDemo(),
  sum: require('./demo-sum')(),
  'text model': require('./demo-text-model')(),
  'auto width edit': require('./demo-auto-width-edit')(),
  'mount/unmount': require('./demo-mount-unmount')()
};

exports.makeDemoComponent = makeDemoComponent = function(demoMap, initItem) {
  var currentItem, demoSelect, else_;
  currentItem = see(initItem);
  return list(demoSelect = select({
    $options: [Object.keys(demoMap)],
    $model: currentItem
  }), case_(currentItem, demoMap, else_ = demoMap[initItem]).updateWhen(demoSelect, 'change'));
};

exports.runDemo = function(demoMap, initItem) {
  var comp;
  comp = makeDemoComponent(demoMap, initItem);
  return comp.mount();
};

window.onload = function() {
  return exports.runDemo(demoMap, 'choose web framework');
};
