/**
 * Assert methods.
 */
var Assert = (function() {
    function Assert() {}
    /**
     * Assert that the expression is not null and not empty otherwise it throws an exception.
     * @param expr Expression
     * @param msg Error message
     */
    Assert.prototype.isDefined = function(expr, msg) {
        if(expr == null || expr == '') {
            throw "Not defined : " + msg;
        }
    }
    return Assert;
})();
module.exports = Assert;