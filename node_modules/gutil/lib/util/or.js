/**
 * Return value1 if not null or value2 if value1 is null
 * @param value1 value 1
 * @param value2 value 2
 * @returns value1 if value1 != null or value2 if value1 == null
 */
function or(value1, value2) {
    if(value1 != null) {
        return value1;
    } else {
        return value2;
    }
}
module.exports = or;