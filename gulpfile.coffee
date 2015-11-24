{task} = require 'gulp-helper'

for tsk in 'clean coffee webpack build-tasks'.split(/\s+/)
  require('./scripts/gulp-tasks/' + tsk)

task 'default', ['webpack-server']