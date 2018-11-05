extend = require('extend')

module.exports = exports  = extend({},
  require('./component'),
  require('./property')
  require('./instantiate')
  require('./tag')
  require('./each'),
  {
    model: require('./model')
  }
)