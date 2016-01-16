var exports, extend;

extend = require('extend');

module.exports = exports = extend({}, require('./attrs'), require('./events'), require('./style'));

exports.classFn = require('./classFn');
