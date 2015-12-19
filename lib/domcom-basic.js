var dc, extend;

module.exports = dc = require('./dc');

if (typeof window !== 'undefined') {
  window.dc = dc;
}

dc.extend = extend = require('extend');

extend(dc, require('./config'), require('lazy-flow'), require('dc-watch-list'), require('./dom-util'), require('dc-util'), require('./core/index'), require('./dc-error'));
