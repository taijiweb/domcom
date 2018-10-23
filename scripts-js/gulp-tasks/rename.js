var CombineStream, dest, from, gulp, logTime, rename, renameFn, renameJs, task;

gulp = require('gulp');

({task, from, dest, CombineStream, logTime} = require("gulp-task-helper"));

rename = require("gulp-rename");

renameFn = function(path) {
  return path.extname = ".ts";
};

renameJs = function(fromFiles, toFolder) {
  return from(fromFiles).pipelog(rename(renameFn)).pipe(dest(toFolder));
};

gulp.task('rename', function(cb) {
  var combineStream, streamList;
  streamList = [];
  streamList.push(renameJs('./src/**/*.js', './src'));
  streamList.push(renameJs('./test/**/*.js', './test'));
  streamList.push(renameJs('./demo/**/*.js', './demo'));
  streamList.push(renameJs('./scripts/**/*.js', './scripts'));
  combineStream = new CombineStream(streamList);
  return combineStream;
});
