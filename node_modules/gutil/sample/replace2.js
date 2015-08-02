var replace2 = require('../lib/util/replace2');

// given
var txt = "simple text";
var oldValues = ["simple","text"];
var newValues = ["hello","world"];
// when
var result = replace2(txt, oldValues, newValues);

console.log(result);
