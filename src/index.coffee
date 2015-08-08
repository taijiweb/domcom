window.dc = module.exports = dc = require './dc'

dc.extend = extend = require './extend'

extend(dc,

  # component
  require('./core'),

  # utilities
  require('./util'),
  require('./constant')
  require('./emitter')

)