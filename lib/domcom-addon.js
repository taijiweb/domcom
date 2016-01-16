var dc, extend, flow;

extend = (dc = require('./domcom-basic')).extend;

dc.builtinDirectives = require('./directives/index');

extend(dc, dc.builtinDirectives, require('./builtins/index'), require('./core/property/css-arith'));

flow = dc.flow;

extend(flow, require('lazy-flow/addon'), require('dc-watch-list'));

dc.bindings = flow.bindings;

module.exports = dc;
