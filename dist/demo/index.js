var demoMap, runDemo, _ref;

_ref = require('./util'), runDemo = _ref.runDemo, demoMap = _ref.demoMap;

dc.alwaysUpdate = true;

window.onload = function() {
  var comp;
  comp = demoMap["if"]();
  return runDemo(demoMap, 'choose web framework');
};
