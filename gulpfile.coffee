gulp = require('gulp')
del = require('del')
runSequence = require('run-sequence')

task = gulp.task.bind(gulp)
src = gulp.src.bind(gulp)
dest = gulp.dest.bind(gulp)

task 'clean', (cb) -> del(['doc'], cb)
xtask = ->

markdown = require('gulp-markdown')

xtask 'copy', (cb) ->
  src(['./src/demo/**/*']).pipe(dest('./doc/demo'))

task 'markdown', (cb) ->
  src(['./src/**/*.md']).pipe(markdown({})).pipe(dest('./doc'))
  src(['./index.md']).pipe(markdown({})).pipe(dest('.'))

task 'default', (callback) -> runSequence 'clean', 'markdown', callback