{renew} = require 'lazy-flow'

#export default
module.exports = exports = {}

if typeof window != 'undefined'
  exports.normalizeDomElement = (domElement) ->
    if typeof domElement == 'string'
      domElement = document.querySelector(domElement)
    domElement