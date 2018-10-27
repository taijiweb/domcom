var exports, extend;

extend = require('extend');

module.exports = exports = extend({}, require('./attrs'), require('./classFn'), require('./style'), require('./css-arith'), require('./events'), require('./delegate-event'));

exports.classFn = require('./classFn');
