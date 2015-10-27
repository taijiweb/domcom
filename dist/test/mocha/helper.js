exports.expect = chai.expect;

exports.iit = it.only;

exports.idescribe = describe.only;

exports.nit = function() {};

exports.ndescribe = function() {};

exports.rtimeout = function(ms, fn) {
  return setTimeout(fn, ms);
};

exports.rinterval = function(ms, fn) {
  return setInterval(fn, ms);
};

exports.newDemoNode = function(id) {
  var node;
  node = document.createElement('div');
  document.body.appendChild(node);
  id && node.setAttribute('id', id);
  return node;
};
