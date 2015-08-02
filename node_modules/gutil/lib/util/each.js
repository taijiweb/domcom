// each
/**
 * Call function for each object or array values.
 * @param values Array or object values
 * @param func Function to apply with for an array "func(value, index, isFirst)" and for an object "func(value, key, isFirst)"
 */
module.exports = function(values, func) {
    if(values == null) {
        return;
    }
    if(values instanceof Object) {
        if(values instanceof Array) {
            var length = values.length;
            var isFirst = true;
            for(var i=0; i<length; i++) {
                func(values[i], i, isFirst);
                if(isFirst) {isFirst=false;}
            }
        }
        else {
            var isFirst = true;
            for(var valueKey in values) {
                func(values[valueKey], valueKey, isFirst);
                if(isFirst) {isFirst=false;}
            }
        }
    }
}