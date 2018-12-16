var expect, idescribe, iit, ndescribe, nit;

({expect, iit, idescribe, nit, ndescribe} = require('bdd-test-helper'));

describe("all tests", function() {
  this.timeout(5000000);
  require('./test-directive');
  require('./test-event');
  require('./test-material-ui');
  require('./test-antd');
  require('./test-new-dc');
  return require('./test-react-proxy');
});
