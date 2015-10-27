var extend, flow;

extend = dc.extend;

dc.builtinDirectives = require('./directives/index');

extend(dc, dc.builtinDirectives, require('./builtins/index'));

flow = dc.flow;

extend(flow, require('./flow/addon'), require('./flow/watch-list'));

module.exports = dc;
