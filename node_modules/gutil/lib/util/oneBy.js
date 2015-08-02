var by = require('./by');

function oneBy(values, keyName, keyValue) {
    var results = by(values, keyName, keyValue);
    if(results == null || results.length == 0) {
        return null;
    } else {
        if(results.length > 1 ) {
            throw "oneBy : too many results for: (values:"+values+", keyName:"+keyName+", keyValue:"+keyValue+")";
        }
        return results[0];
    }
}

module.exports = oneBy;