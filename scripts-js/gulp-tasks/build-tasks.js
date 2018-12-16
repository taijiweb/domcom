var gulp, runSequence, watchcb;

gulp = require('gulp');

watchcb = function() {
  return gulp.watch(['./src/**/*.coffee', './scripts-coffee/**/*.coffee', './test/coffee/**/*.coffee', './demo/coffee/**/*.coffee'], ['coffee']);
};

runSequence = require('run-sequence');

gulp.task('js', function(callback) {
  return runSequence('clean', 'coffee', callback);
});

gulp.task('dev', function(callback) {
  return runSequence('clean', 'webpack-server', watchcb);
});

gulp.task('dist', function(callback) {
  return runSequence('clean', 'coffee', 'webpack-dist', callback);
});
