extend = require('extend')

module.exports = exports  = extend({},
  require('./base'),
  require('./property')
  require('./instantiate')
  require('./tag')
  require('./each')
)