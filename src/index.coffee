window.dc = module.exports = dc = require './dc'

dc.extend = extend = require './extend'

extend(dc,

  # component
  require('./core'),
  require('./directives')
  require('./builtins')

  # utilities
  require('./util'),
  require('./constant')
  require('./emitter')

)