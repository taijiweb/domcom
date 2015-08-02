var has = require("./has");

/**
 * Return array values which have this attribute value
 * - array :
 *   - has( [{a:1,b:1},{a:2,b:2}], "a", 2 ) => {a:2,b:2}
 *   - has( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "a", 2 ) => {o2:{a:2,b:2}}
 * @param values Array values
 * @param keyName attribute name
 * @param keyValue attribute value
 * @returns {Array}
 */
var filter = function(values, keyName, keyValue) {
    if(values instanceof Array) {
        var results = [];
        for(var i=0; i<values.length; i++) {
            if(has(values[i],keyName,keyValue)) {
                results.push(values[i]);
            }
        }
        return results;
    }
}

module.exports = filter;