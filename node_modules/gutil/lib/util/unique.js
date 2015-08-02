var get = require('./get');

function unique(values) {
    if(values == null) {
        return null;
    }
    if(values instanceof Array) {
        var results = [];
        for(var i=0; i<values.length; i++) {
            var contains = false;
            for(var j=0; j<results.length; j++) {
                if(results[j] === values[i]) {
                    contains = true;
                }
            }
            if(!contains) {
                results.push(values[i]);
            }
        }
        return results;
    }
    return values;
}
module.exports = unique;