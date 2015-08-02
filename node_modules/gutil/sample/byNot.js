var gutil = require("../lib/gutil");
var byNot = gutil.byNot;

// given
var values = {o:{o1:{a:1,b:1},o2:{a:2,b:2}}};
// when
var result = byNot( values, "o1.a", 1 );
console.log(result);