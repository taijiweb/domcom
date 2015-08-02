// add
/**
 * Insert value in an array.
 * @param values array
 * @param insert value to insert
 * @param pos insertion position
 * @returns {*}
 */
module.exports = function(values, insert, pos) {
    if(values == null) {
        return values;
    }
    if(values instanceof Object) {
        if(values instanceof Array) {
            var length = values.length;
            if(pos === undefined) {
                values.push(insert);
            } else {
                if (pos >= 0) {
                    if (pos >= length) {
                        values.push(insert);
                    } else {
                        values.push(values[length - 1]);
                        for (var i = length - 1; i > pos; i--) {
                            values[i] = values[i - 1];
                        }
                        values[pos] = insert;
                    }
                }
            }
        }
        else {
            // nothing
        }
    }
}