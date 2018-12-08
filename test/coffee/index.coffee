{expect, iit, idescribe, nit, ndescribe} = require 'bdd-test-helper'
describe "all tests", ->
  this.timeout(5000000)

  require('./test-directive')
  require('./test-event')
  require('./test-material-ui')
  require('./test-antd')

  require('./test-new-dc')
  require('./test-react-proxy')