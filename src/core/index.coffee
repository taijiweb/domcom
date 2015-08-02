extend = require('../extend')
module.exports = exports  = extend({},
  require('./base'),
  require('./virtual-node'),
  require('./instantiate')
  require('./tag')
  require('./property')
  require('./directives')
  require('./builtins')
)
