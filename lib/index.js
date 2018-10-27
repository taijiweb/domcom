var exports, extend;

extend = require('extend');

module.exports = exports = extend({}, require('./components'), require('./property'), require('./instantiate'), require('./tag'), require('./each'), {
  model: require('./model')
});
