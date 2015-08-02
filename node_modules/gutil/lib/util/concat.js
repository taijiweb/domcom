/**
 * Concatenate string array values.
 * @param values String array values
 * @param separator Separator between each values
 * @param prefix Prefix added before each value
 * @param suffix Suffix added after each value
 * @param func (not mandatory) Function to transform each value
 * @returns {string}
 */
var concat = function(values, separator, prefix, suffix, func) {
    var result = "";
    if(values != null) {
        var valuesArray;
        if(values instanceof Object) {
            if (values instanceof Array) {
                valuesArray = values;
            } else {
                valuesArray = [];
                for(var keyName in values) {
                    if(keyName != null && keyName != '') {
                        valuesArray.push(keyName);
                    }
                }
            }
        } else {
            valuesArray = [values];
        }
        for(var i=0; i<valuesArray.length; i++) {
            if(i>0) {
                result += separator;
            }
            var value = valuesArray[i];
            if(func != null) {
                value = func(value);
            }
            result += prefix + value + suffix;
        }
    }
    return result;
}

module.exports=concat;