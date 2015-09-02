window.dc = module.exports = dc = require './dc'

dc.extend = extend = require './extend'

extend(dc,

  require('./constant')
  require('./config')

  # utilities
  require('./flow/index')
  require('./dom-util'),
  require('./util'),

  # component
  require('./core/index'),

  require('./directives/register')

)