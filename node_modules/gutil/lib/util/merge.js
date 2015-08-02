/**
 *
 * @param c1
 * @param c2
 * @returns {Array}
 */
function difference(c1, c2) {
    var diffs = [];

    return diffs;
}

/**
 *
 * @param diffsOldToCurrent
 * @param diffsOldToNew
 * @returns {Array}
 */
function updateDifference(diffsOldToCurrent, diffsOldToNew) {
    var diffs = [];

    return diffs;
}

/**
 *
 * @param oldContent
 * @param newContent
 * @param currentContent
 * @returns {*}
 */
function merge(oldContent, newContent, currentContent) {

    var diffsOldToCurrent = difference(oldContent, currentContent);
    var diffsOldToNew = difference(oldContent, newContent);

    var diffsNewToCurrent = updateDifference(diffsOldToCurrent, diffsOldToNew);

    return currentContent;
}

module.exports = merge;