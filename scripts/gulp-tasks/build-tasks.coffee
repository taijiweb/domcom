runSequence = require('run-sequence')

{task} = require("gulp-helper")

task 'dev', (callback) -> runSequence 'clean', 'webpack-dev', callback

task 'dist', (callback) -> runSequence 'clean', 'webpack-dist', 'coffee', callback
