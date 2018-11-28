import dc from './dc'

if typeof window != 'undefined'
  window.dc = dc

Object.assign(dc,
  require('dc-util'),
  require('./component'),
  require('./dc-error')
)

dc.addReactProxy = require './proxy/react-proxy'

export default module.exports = dc



