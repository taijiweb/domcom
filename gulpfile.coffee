gulp = require('gulp')
del = require('del')

task = gulp.task.bind(gulp)
src = gulp.src.bind(gulp)
dest = gulp.dest.bind(gulp)

task 'clean', (cb) -> del(['doc'], cb)

markdown = require('gulp-markdown')
task 'markdown', (cb) ->
  src(['./src/**/*.md']).pipe(markdown({})).pipe(dest('./doc'))
  src(['./index.md']).pipe(markdown({})).pipe(dest('.'))

task 'default', ['clean', 'markdown']