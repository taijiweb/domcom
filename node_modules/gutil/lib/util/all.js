var get = require('./get');

/**
 * Get all values from an array if they are an object with a "keyName" attribute.
 * @param values array
 * @param keyName object attribute name
 * @returns {Array}
 */
function all(values, keyName) {
    if(values instanceof Array) {
        var results = {};
        for(var i=0; i<values.length; i++) {
            var obj2 = values[i];
            var res = get(obj2, keyName);
            if(res != undefined) {
                results[res] = 0;
            }
        }
        var results2 = [];
        for(var result in results) {
            results2.push(result);
        }
        return results2;
    }
}
module.exports = all;