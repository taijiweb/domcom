{task, from, dest, CombineStream, logTime} = require("gulp-task-helper")

rename = require("gulp-rename")

renameFn = (path) -> path.extname = ".ts"


renameJs = (fromFiles, toFolder) ->
  return from(fromFiles).pipelog(rename(renameFn)).pipe(dest(toFolder))

task 'rename', (cb) ->
  streamList = [];
  streamList.push(renameJs('./src/**/*.js', './src'))
  streamList.push(renameJs('./test/**/*.js', './test'))
  streamList.push(renameJs('./demo/**/*.js', './demo'))
  streamList.push(renameJs('./scripts/**/*.js', './scripts'))
  combineStream = new CombineStream(streamList)
  combineStream
