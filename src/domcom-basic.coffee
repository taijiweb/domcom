window.dc = module.exports = dc = require './dc'

dc.extend = extend = require './extend'

extend dc,

  require './config'

  # utilities
  require './flow/index'
  require './flow/watch-list'
  require './dom-util'
  require './util'

  # component
  require './core/index'