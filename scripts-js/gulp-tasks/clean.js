var del, gulp;

gulp = require('gulp');

del = require('del');

// !!! be careful !!!
// do not remove the stuff by mistake !!!

// keep the code as simple as possible !!!
gulp.task('clean', function(cb) {
  return del(['dist', 'lib', 'demo/js', 'test/js', 'scripts-js', './scripts-coffee/**/*.js', './src/**/*.js', './test/**/*.js', './demo/**/*.js'], cb);
});
