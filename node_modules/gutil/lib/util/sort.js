// sort
var add = require("./add");
module.exports = function(values, funcIsAfter) {
    if(values == null) {
        return values;
    }
    if(funcIsAfter == null) {
        funcIsAfter = function(value1, value2) {
            return value1 > value2;
        }
    }
    if(values instanceof Object) {
        if(values instanceof Array) {
            var results = [];
            for(var i=0; i<values.length; i++) {
                var value = values[i];
                var pos = 0;
                while(pos<results.length && funcIsAfter(value,results[pos])) {
                    pos++;
                }
                add(results, value, pos);
            }
            return results;
        }
        else {
            // nothing
            return values;
        }
    }
}