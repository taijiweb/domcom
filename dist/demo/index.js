var demoMap, runDemo, _ref;

_ref = require('./util'), runDemo = _ref.runDemo, demoMap = _ref.demoMap;

dc.alwaysRender = true;

window.onload = function() {
  return runDemo(demoMap, 'choose web framework');
};
