var sort = require('../lib/util/sort');

var values = ['c','a','d','b'];
// when
var results = sort(values);

for(var i=0; i<results.length; i++) {
    console.log(i+": "+results[i]);
}