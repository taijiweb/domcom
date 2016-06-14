var dc, extend;

module.exports = dc = require('./dc');

if (typeof window !== 'undefined') {
  window.dc = dc;
}

dc.DomNode = require('./DomNode');

dc.extend = extend = require('extend');

dc.EventMixin = require('./dc-event');

extend(dc, dc.flow = require('lazy-flow'));

require('lazy-flow/addon');

dc.bindings = dc.flow.bindings;

require('dc-watch-list');

extend(dc, require('dc-util'), require('./dom-util'), require('./dc-render'), require('./core/index'), require('./dc-error'));

extend(dc, dc.builtinDirectives = require('./directives/index'));

extend(dc, require('./core/property/attrs'), require('./core/property/classFn'), require('./core/property/style'), require('./core/property/css-arith'), require('./core/property/events'), require('./core/property/delegate-event'));
