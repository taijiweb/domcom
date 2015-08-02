var fs = require("fs");
var path = require("path");

/*
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};
*/

var _walkSync = function(dir, results, filters) {

  if(filters != null) {
    for (var j = 0; j < filters.length; j++) {
      if (dir.indexOf(filters[j]) != -1) {
        return
      }
    }
  }

  var list = fs.readdirSync(dir);
    for(var i=0; i<list.length; i++) {
        var file = list[i];
        if (!file) {
            // nothing
        } else {

            file = path.join(dir, file);
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                var res = _walkSync(file, results, filters);
            } else {
                results.push(file);
            }
        }
    }
    return results;
};
/*
var walk = function(dir) {
    var files = {};
    var res = _walkSync(dir);
    for(var i=0; i<res.length; i++) {
        var file = res[i];
        var filename = file.substring(file.lastIndexOf('/'));
        files[filename] = file;
    }
    return files;
}
*/

var walk = function(dir, filters) {
  var result = [];
  _walkSync(dir, result, filters);
  return result;
}

module.exports=walk;