/**
 * Merge two arrays.
 * @param values array 1
 * @param values2 array 2
 * @returns {Array}
 */
function and(values, values2) {
    var results = [];
    if(values instanceof Array) {
        for(var i=0; i<values.length; i++) {
            results.push(values[i]);
        }
    }
    if(values2 instanceof Array) {
        for(var i=0; i<values2.length; i++) {
            results.push(values2[i]);
        }
    }
    return results;
}
module.exports = and;