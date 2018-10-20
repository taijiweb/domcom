{task} = require('gulp-task-helper')

for tsk in 'clean coffee rename typescript remove webpack build-tasks'.split(/\s+/)
  require('./scripts/gulp-tasks/' + tsk)

task 'default', ['webpack-server']