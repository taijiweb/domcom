var dc, extend;

module.exports = dc = require('./dc');

dc.EventMixin = require('./dc-event');

if (typeof window !== 'undefined') {
  window.dc = dc;
}

dc.DomNode = require('./DomNode');

dc.extend = extend = require('extend');

extend(dc, require('./config'), require('lazy-flow'), require('dc-watch-list'), require('./dom-util'), require('dc-util'), require('./dc-update'), require('./core/index'), require('./dc-error'));
