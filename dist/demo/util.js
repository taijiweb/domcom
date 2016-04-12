var case_, chooseFramework, demoEachPush, demoIfEach, demoModelOnMultipleInput, div, each, eachDemo1, eachDemo2, eachDemo3, eachDemo4, func, if_, list, makeDemoComponent, p, see, select, _ref, _ref1;

select = dc.select, see = dc.see, if_ = dc.if_, case_ = dc.case_, list = dc.list, func = dc.func, each = dc.each, div = dc.div, p = dc.p;

dc.directives({
  $options: dc.$options,
  $model: dc.$model
});

_ref = require('./demo-each'), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

chooseFramework = require('./demo-choose-web-framework');

_ref1 = require('./demo-debug'), demoEachPush = _ref1.demoEachPush, demoIfEach = _ref1.demoIfEach, demoModelOnMultipleInput = _ref1.demoModelOnMultipleInput;

exports.demoMap = {
  'choose web framework': chooseFramework,
  "show hide": require('./demo-show-hide'),
  counter: require('./demo-counter'),
  event: require('./demo-event'),
  controls: require('./demo-controls'),
  "if": require('./demo-if-component'),
  each1: eachDemo1,
  each2: eachDemo2,
  each3: eachDemo3,
  each4: eachDemo4,
  'switch 1 2 3 4': require('./demo-switch-1-2-3-4'),
  sum: require('./demo-sum'),
  'text model': require('./demo-text-model'),
  'mount/unmount': require('./demo-mount-unmount')
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
