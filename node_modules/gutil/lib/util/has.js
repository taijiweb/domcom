var get = require('./get');

/**
 * Return true if array values or object values has this attribute value :
 * - array :
 *   - has( [{a:1,b:1},{a:2,b:2}], "a", 1 ) => true
 *   - has( [{a:1,b:1},{a:2,b:2}], "a", 11 ) => false
 *   - has( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 1 ) => true
 *   - has( [{o1:{a:1,b:1}},{o2:{a:2,b:2}}], "o1.a", 11 ) => false
 * - object :
 *   - has( {o:{a:1,b:1}}, "a", 1 ) => true
 *   - has( {o:{a:1,b:1}}, "a", 11 ) => false
 *   - has( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 1 ) => true
 *   - has( {o:{o1:{a:1,b:1},o2:{a:2,b:2}}}, "o1.a", 11 ) => false
 * @param values Array values or Object values
 * @param keyName
 * @param keyValue
 * @returns {boolean}
 */
var has = function(values, keyName, keyValue) {
    if(values == null) {
        return false;
    }
    if(typeof(keyName) == "function") {
        var func = keyName;
        for(var i=0; i<values.length; i++) {
            if(func(values[i])) {
                return true;
            }
        }
        return false;
    }
    if(values instanceof Array) {
        for(var i=0; i<values.length; i++) {
            var obj2 = values[i];
            if(has(obj2, keyName, keyValue)) {
                return true;
            }
        }
        return false;
    }
    if(values instanceof Object) {
        var obj2 = values;
        if(obj2 != null && obj2 instanceof Object) {
            var res = get(obj2, keyName);
            if(keyValue == null) {
                if(res != null) {
                    return true;
                }
            }
            else if(res instanceof Array) {
                var keyValues = res;
                for(var j=0; j<keyValues.length; j++) {
                    if(keyValue == keyValues[j]) {
                        return true;
                    }
                }
            } else {
                if(res == keyValue) {
                    return true;
                }
            }
        }
        return false;
    }
}
module.exports = has;