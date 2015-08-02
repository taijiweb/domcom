/**
 * Get object or sub-object attribute value :
 * get( {o1:{o2:{o3:{a:1}}}}, "o1.o2.o3.a") => 1
 * @param obj Object
 * @param keyName Attribute name
 * @returns {*}
 */
function get(obj, keyName) {
    if(obj == null || keyName == null) {
        return null;
    }
    if(keyName.indexOf('.') == -1) {
        return obj[keyName];
    }
    var keyNames = keyName.split('.');
    if(keyNames == null) {
        return null;
    }
    for(var i=0; i<keyNames.length; i++) {
        var res = obj[keyNames[i]];
        if(res == null) {
            return null;
        }
        obj = res;
    }
    return res;
}

module.exports = get;