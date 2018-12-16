// domcom demo
var demoEachPush, demoIfEach, demoModelOnMultipleInput, eachDemo, exports, makeDemoComponent;

eachDemo = require('./demo-each');

import chooseFramework from './demo-choose-web-framework';

({demoEachPush, demoIfEach, demoModelOnMultipleInput} = require('./demo-debug'));

export default module.exports = exports = {};

exports.demoMap = {
  'choose web framework': chooseFramework,
  "show hide": require('./demo-show-hide'),
  counter: require('./demo-counter'),
  controls: require('./demo-controls'),
  'function lead item': require('./demo-function-lead-item'),
  sum: require('./demo-sum'),
  'text model': require('./demo-text-model')
};

exports.makeDemoComponent = makeDemoComponent = function(demoMap, initItem) {
  var comp, componentsMap, key, view;
  componentsMap = {};
  for (key in demoMap) {
    comp = demoMap[key];
    if (typeof comp === 'function') {
      componentsMap[key] = comp();
    } else {
      componentsMap[key] = comp;
    }
  }
  view = function() {
    return [
      'div',
      [
        'select',
        {
          $options: Object.keys(demoMap),
          $model: 'select'
        }
      ],
      ['div',
      componentsMap[comp.select]]
    ];
  };
  return comp = dc({
    view,
    select: initItem
  });
};

exports.runDemo = function(demoMap, initItem, element) {
  var comp;
  comp = makeDemoComponent(demoMap, initItem);
  return comp.mount(element);
};
