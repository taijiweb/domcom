{task} = require("gulp-task-helper")

del = require('del')

# !!! be careful !!!
# do not remove the stuff by mistake !!!

# keep the code as simple as possible !!!

task 'clean', (cb) -> del(['dist', 'lib'], cb)
