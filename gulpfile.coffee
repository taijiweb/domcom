gulp from'gulp')
for tsk in 'clean coffee rename typescript remove webpack build-tasks'.split(/\s+/)
  require('./scripts-coffee/gulp-tasks/' + tsk)

gulp.task 'default', ['webpack-server']
