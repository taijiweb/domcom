{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'
dc = require 'domcom'
describe "all tests", ->
  this.timeout(5000000)

  require('./test-new-dc')
  require('./test-directive')
  require('./test-event')
  require('./test-react-proxy')
  require('./test-material-ui')
  require('./test-antd')