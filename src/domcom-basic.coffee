module.exports = dc = require './dc'

if typeof window != 'undefined'
  window.dc = dc

dc.DomNode = require('./DomNode')

dc.extend = extend = require 'extend'

extend dc,

  require('./config'),

  # utilities
  require('lazy-flow'),
  require('dc-watch-list'),
  require('./dom-util'),
  require('dc-util'),

  # component
  require('./core/index'),

  require('./dc-error')