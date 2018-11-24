import dc from './dc'

if typeof window != 'undefined'
  window.dc = dc

Object.assign(dc,
  require('dc-util'),
  require('./dom-util'),

  # components
  require('./component'),

  require('./dc-error')
)

export default module.exports = dc



