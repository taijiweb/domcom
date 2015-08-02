var get = require('./get');
var unique = require('./unique');

/**
 * Select values from an array or an object if they do not have the attribute value :
 * - array :
 *   - byNot( [{a:1,b:1},{a:2,b:2}], "a", 1 ) => [{a:2,b:2}]
 *   - byNot( [{a:1,b:1},{a:2,b:2}], "a", 2 ) => [{a:1,b:1}]
 *   - byNot( [{a:1,b:1},{a:2,b:2}], "a", 11 ) => [{a:1,b:1},{a:2,b:2}]
 *   - byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) => [{o2:{a:2,b:2}}]
 *   - byNot( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) => [{o1:{a:1,b:1}},{o2:{a:2,b:2}}]
 * - object :
 *   - byNot( {o:{a:1,b:1}}, "a", 1 ) => []
 *   - byNot( {o:{a:1,b:1}}, "a", 2 ) => [{a:1,b:1}]
 *   - byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) => [{o2:{a:2,b:2}}]
 *   - byNot( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) => [{o1:{a:1,b:1}},{o2:{a:2,b:2}}]
 * @param values Array or object
 * @param keyName Attribute name
 * @param keyValue Attribute value
 * @returns {*}
 */
function byNot(values, keyName, keyValue) {
    if(values == null) {
        return null;
    }
    if(values instanceof Object) {
        if (values instanceof Array) {
            var results = [];
            for (var i = 0; i < values.length; i++) {
                var obj2 = values[i];
                addInResults(obj2, keyName, keyValue, results);
            }
            return unique(results);
        }
        else {
            var results = [];
            for (var valueKey in values) {
                var value = values[valueKey];
                if (value != null && value instanceof Object) {
                    addInResults(value, keyName, keyValue, results);
                }
            }
            return unique(results);
        }
    }
}

function addInResults(obj2, keyName, keyValue, results) {
    if(obj2 != null && obj2 instanceof Object) {
        var res = get(obj2, keyName);
        if(keyValue == null) {
            if(res == null) {
                results.push(obj2);
            }
        }
        else if(res instanceof Array) {
            var keyValues = res;
            for(var j=0; j<keyValues.length; j++) {
                if(keyValue != keyValues[j]) {
                    results.push(obj2);
                    break;
                }
            }
        } else {
            if(res != keyValue) {
                results.push(obj2);
            }
        }
    }
}

module.exports = byNot;