// addAll
var add = require('./add');
/**
 * Insert values in an array.
 * @param values array
 * @param inserts values to insert
 * @param pos insertion position
 * @returns {*}
 */
module.exports = function(values, inserts, pos) {
    if(values == null || inserts == null || pos < 0) {
        return;
    }
    if(pos == null) {
        pos = values.length;
    }
    if(inserts instanceof Object) {
        if (inserts instanceof Array) {
            for (var i = 0; i < inserts.length; i++) {
                add(values, inserts[i], pos + i);
            }
        } else {
            add(values, inserts, pos);
        }
    }
}