var gulp, runSequence;

gulp = require('gulp');

runSequence = require('run-sequence');

gulp.task('js', function(callback) {
  return runSequence('clean', 'coffee', callback);
});

gulp.task('dev', function(callback) {
  return runSequence('clean', 'remove', 'coffee', 'webpack-server', callback);
});

gulp.task('dist', function(callback) {
  return runSequence('clean', 'remove', 'coffee', 'remove', 'webpack-dist', callback);
});
