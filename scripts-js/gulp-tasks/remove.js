var gulp, rimraf, task;

gulp = require('gulp');

task = require("gulp-task-helper").task;

rimraf = require('rimraf');

gulp.task('remove', function(cb) {
  rimraf('./src/**/*.js', function() {});
  rimraf('./src/**/*.ts', function() {});
  rimraf('./test/**/*.js', function() {});
  rimraf('./test/**/*.ts', function() {});
  rimraf('./demo/**/*.js', function() {});
  rimraf('./demo/**/*.ts', function() {});
  rimraf('./scripts-coffee/**/*.js', function() {});
  rimraf('./scripts-coffee/**/*.ts', function() {});
  rimraf('./scripts-js/**/*.js', function() {});
  return cb();
});
