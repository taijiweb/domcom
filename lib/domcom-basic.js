var dc, extend;

window.dc = module.exports = dc = require('./dc');

dc.extend = extend = require('extend');

extend(dc, require('./config'), require('./flow/index'), require('./flow/watch-list'), require('./dom-util'), require('dc-util'), require('./core/index'));
