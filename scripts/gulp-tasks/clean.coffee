gulp = require 'gulp'
del = require('del')

# !!! be careful !!!
# do not remove the stuff by mistake !!!

# keep the code as simple as possible !!!

gulp.task 'clean', (cb) -> del(['dist', 'lib'], cb)
