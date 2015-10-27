var accordion, case_, demoCombo, demoEachPush, demoMap, demoTriangle, each, eachDemo1, eachDemo2, eachDemo3, eachDemo4, func, list, makeDemoComponent, p, see, select, splitterDemo, _ref, _ref1;

select = dc.select, see = dc.see, case_ = dc.case_, list = dc.list, func = dc.func, each = dc.each, p = dc.p;

dc.directives({
  $options: dc.$options,
  $model: dc.$model
});

demoEachPush = function() {
  var comp, lst;
  lst = [1, 2];
  comp = list(each(lst, function(item) {
    return p(item);
  }), 'some other thing');
  comp.mount();
  lst.push(3);
  return comp.render();
};

_ref = require('domcom/demo/demo-each'), eachDemo1 = _ref.eachDemo1, eachDemo2 = _ref.eachDemo2, eachDemo3 = _ref.eachDemo3, eachDemo4 = _ref.eachDemo4;

_ref1 = require('domcom/demo/demo-builtins'), demoTriangle = _ref1.demoTriangle, demoCombo = _ref1.demoCombo;

splitterDemo = require('domcom/demo/demo-splitter');

accordion = require('domcom/demo/demo-accordion');

exports.demoMap = demoMap = {
  accordion: func(accordion),
  arrow: func(demoTriangle),
  combo: func(demoCombo),
  "show hide": func(require('domcom/demo/demo-show-hide')),
  counter: func(require('domcom/demo/demo-counter')),
  dialog: func(require('domcom/demo/demo-dialog')),
  event: func(require('domcom/demo/demo-event')),
  controls: func(require('domcom/demo/demo-controls')),
  "if": func(require('domcom/demo/demo-if-component')),
  each1: func(eachDemo1),
  each2: func(eachDemo2),
  each3: func(eachDemo3),
  each4: func(eachDemo4),
  'switch 1 2 3 4': func(require('domcom/demo/demo-switch-1-2-3-4')),
  'choose web framework': func(require('domcom/demo/demo-choose-web-framework')),
  splitter: func(splitterDemo),
  sum: func(require('domcom/demo/demo-sum')),
  'text model': func(require('domcom/demo/demo-text-model')),
  'auto width edit': func(require('domcom/demo/demo-auto-width-edit')),
  'mount/unmount': func(require('domcom/demo/demo-mount-unmount'))
};

exports.makeDemoComponent = makeDemoComponent = function(demoMap, initItem) {
  var currentItem, demoSelect;
  if (initItem == null) {
    initItem = 'arrow';
  }
  currentItem = see(initItem);
  return list(demoSelect = select({
    $options: [Object.keys(demoMap)],
    $model: currentItem
  }), case_(currentItem, demoMap, accordion).updateWhen(demoSelect, 'change'));
};

exports.runDomComDemo = window.runDomComDemo = function() {
  var comp;
  comp = makeDemoComponent(demoMap);
  return comp.mount();
};
