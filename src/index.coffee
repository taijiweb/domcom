window.dc = module.exports = dc = require './dc'

dc.extend = extend = require './extend'

extend(dc,

  # component
  require('./core/index'),

  # utilities
  require('./flow/index')
  require('./dom-util'),
  require('./util'),
  require('./constant')

  require('./directives/register')

)