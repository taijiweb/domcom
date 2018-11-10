let exports = {}
if (typeof window === 'undefined') {
    var chai = require('chai');
} else {
    var chai = window.chai;
}

exports.expect = chai.expect;

exports.iit = it.only;
exports.idescribe = describe.only;
exports.nit = function () {};
exports.ndescribe = function () {};

export default exports